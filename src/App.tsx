import React, {useEffect, useState} from 'react';
import {SettingsProvider} from './contexts/SettingsContext';
import {ThemeProvider} from './contexts/ThemeContext';
import {UIProvider} from './contexts/UIContext';
import SettingsPanel from "./components/settings/SettingsPanel.tsx";
import DockableChat from './components/chat/DockableChat/DockableChat.tsx';
import {Toaster} from "./components/ui/toaster";
import {Button} from './components/ui/button';
import {useUI} from "@/hooks/useUI";
import {motion} from 'framer-motion';
import LoginPage from './pages/LoginPage';
import {getUsername} from '@/api';
import {MeshSpinner} from './components/ui/mesh-spinner';

const AppContent: React.FC = () => {
    const {showSettings, setShowSettings} = useUI();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const username = await getUsername();
            setIsLoggedIn(username !== null);
        };

        checkLoginStatus().then();
    }, []);


    if (isLoggedIn === null) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
                <motion.div
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.5}}
                >
                    <MeshSpinner size="lg"/>
                </motion.div>
                <motion.p
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3, duration: 0.5}}
                    className="mt-4 text-muted-foreground"
                >
                    Starting Mesh...
                </motion.p>
            </div>
        );
    }

    if (isLoggedIn) { // TODO: enable later when login is implemented (!isLoggedIn)
        return (
            <div className="min-h-screen bg-background text-foreground">
                <LoginPage/>
                <Toaster/>
            </div>
        );
    }

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
