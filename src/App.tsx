import React from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SettingsPanel from "./components/settings/SettingsPanel.tsx";
import { Toaster } from "./components/ui/toaster";

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <div className="min-h-screen bg-background text-foreground">
                    <SettingsPanel/>
                    <Toaster />
                </div>
            </ThemeProvider>
        </SettingsProvider>
    );
};

export default App;