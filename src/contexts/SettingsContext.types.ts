import { createContext } from 'react';
import { Settings } from '../types/settings';

export interface SettingsContextType {
    settings: Settings;
    updateSettings: (partialSettings: Partial<Settings>) => Promise<void>;
    resetSettings: () => Promise<void>;
    exportSettings: () => Promise<string>;
    importSettings: (settingsJson: string) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);