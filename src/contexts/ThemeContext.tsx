import React, { useState, useEffect } from 'react';
import { Theme } from '../types/theme';
import { defaultThemes } from '../themes';
import { useSettings } from "../hooks/useSettings";
import { ThemeContext } from './ThemeContext.types';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { settings, updateSettings } = useSettings();
    const [availableThemes, setAvailableThemes] = useState<Theme[]>(defaultThemes);
    const [currentTheme, setCurrentTheme] = useState<Theme>(
        defaultThemes.find(t => t.metadata.id === settings.ui.themeId) || defaultThemes[0]
    );

    useEffect(() => {
        const root = document.documentElement;

        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            if (typeof value === 'string') {
                root.style.setProperty(`--color-${key}`, value);
            } else {
                // Handle nested color objects
                Object.entries(value).forEach(([subKey, subValue]) => {
                    root.style.setProperty(`--color-${key}-${subKey}`, subValue as string);
                });
            }
        });

        if (currentTheme.fontFamily) {
            root.style.setProperty('--font-sans', currentTheme.fontFamily.sans.join(', '));
            root.style.setProperty('--font-mono', currentTheme.fontFamily.mono.join(', '));
        }
    }, [currentTheme]);

    const setTheme = (themeId: string) => {
        const theme = availableThemes.find(t => t.metadata.id === themeId);
        if (theme) {
            setCurrentTheme(theme);
            updateSettings({ui: {themeId}}).then();
        }
    };

    const addCustomTheme = (theme: Theme) => {
        setAvailableThemes(prev => [...prev, theme]);
    };

    const removeCustomTheme = (themeId: string) => {
        setAvailableThemes(prev => prev.filter(t => t.metadata.id !== themeId));
        if (currentTheme.metadata.id === themeId) {
            setTheme(defaultThemes[0].metadata.id);
        }
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            availableThemes,
            setTheme,
            addCustomTheme,
            removeCustomTheme
        }}>
            <div className={`theme-${currentTheme.metadata.id}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

