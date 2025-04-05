import React from 'react';
import {SettingsProvider} from './contexts/SettingsContext';
import {ThemeProvider} from './contexts/ThemeContext';
import {UIProvider} from './contexts/UIContext';
import SettingsPanel from "./components/settings/SettingsPanel.tsx";
import DockableChat from './components/chat/DockableChat/DockableChat.tsx';
import {Toaster} from "./components/ui/toaster";
import {Button} from './components/ui/button';
import {useUI} from "@/hooks/useUI";

const AppContent: React.FC = () => {
    const {showSettings, setShowSettings} = useUI();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {showSettings ? (
                <div className="relative">
                    <Button
                        className="absolute top-4 right-4 z-10"
                        onClick={() => setShowSettings(false)}
                        variant="outline"
                    >
                        Back to Chat
                    </Button>
                    <SettingsPanel/>
                </div>
            ) : (
                <div className="relative h-screen">
                    <DockableChat/>
                </div>
            )}
            <Toaster/>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <UIProvider>
                    <AppContent/>
                </UIProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
};

export default App;