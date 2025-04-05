import {createContext} from "react";

export interface UIContextType {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    toggleSettings: () => void;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);