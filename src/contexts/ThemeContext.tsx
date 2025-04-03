import React, {useCallback, useEffect, useState} from 'react';
import {Theme} from '../types/theme';
import {defaultThemes} from '@/themes';
import {useSettings} from "../hooks/useSettings";
import {ThemeContext} from './ThemeContext.types';
import {getContrastColor, hexToHSLString, isLightColor} from '../lib/functions';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {settings, updateSettings} = useSettings();
    const [availableThemes, setAvailableThemes] = useState<Theme[]>(defaultThemes);
    const [systemThemePreference, setSystemThemePreference] = useState<string | null>(null);

    const getThemeId = useCallback(() => {
        if (settings.ui.useSystemTheme && systemThemePreference) {
            return systemThemePreference;
        }
        return settings.ui.themeId;
    }, [settings.ui.themeId, settings.ui.useSystemTheme, systemThemePreference]);

    const [currentTheme, setCurrentTheme] = useState<Theme>(
        defaultThemes.find(t => t.metadata.id === getThemeId()) || defaultThemes[0]
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setSystemThemePreference(e.matches ? 'light' : 'dark');
        };

        handleChange(mediaQuery);
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        const themeId = getThemeId();
        const theme = availableThemes.find(t => t.metadata.id === themeId);
        if (theme && theme.metadata.id !== currentTheme.metadata.id) {
            setCurrentTheme(theme);
        }
    }, [settings.ui.useSystemTheme, systemThemePreference, getThemeId, availableThemes, currentTheme.metadata.id]);

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

        const isDark = currentTheme.metadata.id.includes('dark') ||
            !isLightColor(currentTheme.colors.background.primary);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Background and foreground
        const bgPrimaryHSL = hexToHSLString(currentTheme.colors.background.primary);
        const bgSecondaryHSL = hexToHSLString(currentTheme.colors.background.secondary);
        const textPrimaryHSL = hexToHSLString(currentTheme.colors.text.primary);

        if (bgPrimaryHSL) root.style.setProperty('--background', bgPrimaryHSL);
        if (bgPrimaryHSL) root.style.setProperty('--background-primary', bgPrimaryHSL);
        if (textPrimaryHSL) root.style.setProperty('--foreground', textPrimaryHSL);
        if (bgSecondaryHSL) root.style.setProperty('--background-secondary', bgSecondaryHSL);

        // Card
        root.style.setProperty('--card', bgPrimaryHSL || (isDark ? '222.2 84% 4.9%' : '0 0% 100%'));
        root.style.setProperty('--card-foreground', textPrimaryHSL || (isDark ? '210 40% 98%' : '222.2 84% 4.9%'));

        // Popover
        root.style.setProperty('--popover', bgPrimaryHSL || (isDark ? '222.2 84% 4.9%' : '0 0% 100%'));
        root.style.setProperty('--popover-foreground', textPrimaryHSL || (isDark ? '210 40% 98%' : '222.2 84% 4.9%'));

        // Primary colors
        const primaryHSL = hexToHSLString(currentTheme.colors.primary);
        if (primaryHSL) {
            root.style.setProperty('--primary', primaryHSL);
            const primaryForeground = getContrastColor(currentTheme.colors.primary);
            const primaryForegroundHSL = hexToHSLString(primaryForeground);
            if (primaryForegroundHSL) {
                root.style.setProperty('--primary-foreground', primaryForegroundHSL);
            }
        }

        // Secondary colors
        const secondaryHSL = hexToHSLString(currentTheme.colors.secondary);
        if (secondaryHSL) {
            root.style.setProperty('--secondary', secondaryHSL);
            const secondaryForeground = getContrastColor(currentTheme.colors.secondary);
            const secondaryForegroundHSL = hexToHSLString(secondaryForeground);
            if (secondaryForegroundHSL) {
                root.style.setProperty('--secondary-foreground', secondaryForegroundHSL);
            }
        }

        // Accent colors
        const accentHSL = hexToHSLString(currentTheme.colors.accent);
        if (accentHSL) {
            root.style.setProperty('--accent', accentHSL);
            const accentForeground = getContrastColor(currentTheme.colors.accent);
            const accentForegroundHSL = hexToHSLString(accentForeground);
            if (accentForegroundHSL) {
                root.style.setProperty('--accent-foreground', accentForegroundHSL);
            }
        }

        // Status colors
        if (currentTheme.colors.status) {
            const errorHSL = hexToHSLString(currentTheme.colors.status.error);
            if (errorHSL) {
                root.style.setProperty('--destructive', errorHSL);
                const errorForeground = getContrastColor(currentTheme.colors.status.error);
                const errorForegroundHSL = hexToHSLString(errorForeground);
                if (errorForegroundHSL) {
                    root.style.setProperty('--destructive-foreground', errorForegroundHSL);
                }
            }
        }

        // Muted colors
        root.style.setProperty('--muted', bgSecondaryHSL || (isDark ? '217.2 32.6% 17.5%' : '210 40% 96.1%'));
        root.style.setProperty('--muted-foreground', hexToHSLString(currentTheme.colors.text.secondary) ||
            (isDark ? '215 20.2% 65.1%' : '215.4 16.3% 46.9%'));

        // Border and input
        const borderHSL = hexToHSLString(currentTheme.colors.background.tertiary);
        root.style.setProperty('--border', borderHSL || (isDark ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%'));
        root.style.setProperty('--input', borderHSL || (isDark ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%'));

        // Ring (focus)
        root.style.setProperty('--ring', primaryHSL || (isDark ? '224.3 76.3% 48%' : '221.2 83.2% 53.3%'));

        // Border radius
        if (currentTheme.borderRadius) {
            root.style.setProperty('--radius', currentTheme.borderRadius.md);
        }

        const fontSans = settings.ui.fontFamily
            ? [settings.ui.fontFamily, ...currentTheme.fontFamily?.sans.slice(1) || ['system-ui', 'sans-serif']]
            : currentTheme.fontFamily?.sans || ['system-ui', 'sans-serif'];
        root.style.setProperty('--font-sans', fontSans.join(', '));
    }, [currentTheme, settings.ui.fontFamily]);

    const setTheme = (themeId: string) => {
        const theme = availableThemes.find(t => t.metadata.id === themeId);
        if (theme) {
            setCurrentTheme(theme);
            const uiSettings = {
                ...settings.ui,
                themeId,
                useSystemTheme: false
            };
            updateSettings({ui: uiSettings}).then();
        }
    };

    const setUseSystemTheme = (useSystemTheme: boolean) => {
        const uiSettings = {
            ...settings.ui,
            useSystemTheme
        };
        updateSettings({ui: uiSettings}).then();
    };

    const setFontFamily = (fontFamily: string) => {
        const uiSettings = {
            ...settings.ui,
            fontFamily
        };
        updateSettings({ui: uiSettings}).then();
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
            setUseSystemTheme,
            setFontFamily,
            addCustomTheme,
            removeCustomTheme
        }}>
            <div className={`theme-${currentTheme.metadata.id}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

