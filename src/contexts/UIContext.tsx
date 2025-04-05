import React, {ReactNode, useState} from 'react';
import {UIContext} from './UIContext.types';

export const UIProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSettings = () => {
        setShowSettings(prev => !prev);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    return (
        <UIContext.Provider value={{
            showSettings,
            setShowSettings,
            toggleSettings,
            sidebarCollapsed,
            toggleSidebar,
            setSidebarCollapsed
        }}>
            {children}
        </UIContext.Provider>
    );
};
