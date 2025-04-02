import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ThemeSettings from './ThemeSettings';
import MatrixSettings from './MatrixSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import { useSettings } from "../../hooks/useSettings";

const SettingsPanel: React.FC = () => {
    const { settings, resetSettings } = useSettings();

    return (
        <div className="p-4 bg-background-primary text-text-primary">
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

            <div className="mt-8 flex justify-between">
                <button
                    className="px-4 py-2 bg-status-error text-white rounded-md"
                    onClick={() => resetSettings()}
                >
                    Reset All Settings
                </button>

                <div>
                    <button
                        className="px-4 py-2 bg-status-info text-white rounded-md mr-2"
                        onClick={async () => {
                            // TODO: Implement export dialog here
                        }}
                    >
                        Export Settings
                    </button>

                    <button
                        className="px-4 py-2 bg-status-info text-white rounded-md"
                        onClick={() => {
                            // TODO: Implement import dialog here
                        }}
                    >
                        Import Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;