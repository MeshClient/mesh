import React from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SettingsPanel from "./components/settings/SettingsPanel.tsx";

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <SettingsPanel/>
            </ThemeProvider>
        </SettingsProvider>
    );
};

export default App;