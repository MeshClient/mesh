import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ThemeSettings from './ThemeSettings';
import MatrixSettings from './MatrixSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import { useSettings } from "@/hooks/useSettings.ts";
import { Button } from '../ui/button';

const SettingsPanel: React.FC = () => {
    const { settings, resetSettings } = useSettings();

    return (
        <div className="p-4 bg-background-primary text-text-primary max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="appearance">
                <TabsList className="mb-4">
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="matrix">Matrix</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    {settings.developerMode && (
                        <TabsTrigger value="developer">Developer</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="appearance">
                    <ThemeSettings />
                </TabsContent>

                <TabsContent value="matrix">
                    <MatrixSettings />
                </TabsContent>

                <TabsContent value="notifications">
                    <NotificationSettings />
                </TabsContent>

                <TabsContent value="privacy">
                    <PrivacySettings />
                </TabsContent>
            </Tabs>

            <div className="flex flex-wrap justify-between">
                <Button
                    className="mb-4"
                    variant="destructive"
                    onClick={() => resetSettings()}
                >
                    Reset All Settings
                </Button>

                <div className="space-x-2">
                    <Button
                        className="mb-4"
                        variant="secondary"
                        onClick={async () => {
                            // TODO: Implement export dialog here
                        }}
                    >
                        Export Settings
                    </Button>

                    <Button
                        className="mb-4"
                        variant="secondary"
                        onClick={() => {
                            // TODO: Implement import dialog here
                        }}
                    >
                        Import Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;