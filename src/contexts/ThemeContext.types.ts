import { createContext } from 'react';
import { Theme } from '../types/theme';

export interface ThemeContextType {
    currentTheme: Theme;
    availableThemes: Theme[];
    setTheme: (themeId: string) => void;
    addCustomTheme: (theme: Theme) => void;
    removeCustomTheme: (themeId: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);