import React, {useEffect, useState} from 'react';
import {LazyStore} from '@tauri-apps/plugin-store';
import {Settings, SettingsTypes} from '../types/settings';
import {defaultSettings} from '../config/defaultSettings';
import {SettingsContext} from './SettingsContext.types';

const store = new LazyStore('settings.json');

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                let storedSettings = await store.get('settings');

                if (!storedSettings) {
                    storedSettings = defaultSettings;
                    await store.set('settings', defaultSettings);
                }

                setSettings(storedSettings as unknown as Settings);
            } catch (error) {
                console.error('Error loading settings:', error);
                setSettings(defaultSettings);
            } finally {
                setLoaded(true);
            }
        };

        loadSettings().then();
    }, []);

    const updateSettings = async (partialSettings: Partial<Settings>) => {
        try {
            const newSettings = deepMerge(settings, partialSettings);
            setSettings(newSettings);
            await store.set('settings', newSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    };

    const resetSettings = async (settingType?: SettingsTypes) => {
        try {
            if (settingType) {
                const newSettings = {...settings, [settingType]: defaultSettings[settingType]};
                setSettings(newSettings);
                await store.set('settings', newSettings);
            } else {
                setSettings(defaultSettings);
                await store.set('settings', defaultSettings);
            }
        } catch (error) {
            console.error('Error resetting settings:', error);
            throw error;
        }
    };

    const exportSettings = async (): Promise<string> => {
        return JSON.stringify(settings, null, 2);
    };

    const importSettings = async (settingsJson: string): Promise<void> => {
        try {
            const parsedSettings = JSON.parse(settingsJson) as unknown as Settings;
            // TODO: Validate the parsed settings against the Settings interface
            setSettings(parsedSettings);
            await store.set('settings', parsedSettings);
        } catch (error) {
            console.error('Error importing settings:', error);
            throw error;
        }
    };

    const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
        const output = {...target};

        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                const sourceKey = key as keyof typeof source;
                const targetKey = key as keyof typeof target;

                if (isObject(source[sourceKey])) {
                    if (!(key in target)) {
                        Object.assign(output, {[key]: source[sourceKey]});
                    } else {
                        output[targetKey] = deepMerge(
                            target[targetKey] as object,
                            source[sourceKey] as object
                        ) as T[keyof T];
                    }
                } else {
                    Object.assign(output, {[key]: source[sourceKey]});
                }
            });
        }

        return output;
    };

    const isObject = (item: unknown): item is object => {
        return Boolean(item) && typeof item === 'object' && !Array.isArray(item);
    };

    if (!loaded) {
        return <div>Loading settings...</div>;
    }

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            resetSettings,
            exportSettings,
            importSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

