export interface ChatPanel {
    id: string;
    direction: 'horizontal' | 'vertical';
    childPanels?: string[];
    chatTabs?: ChatTabInfo[];
    size?: number; // Size in percentage
}

export interface ChatTabInfo {
    id: string;
    roomId: string;
    roomName: string;
    roomType?: 'direct' | 'group' | 'space';
}

export type DockContextType = {
    activeDrag: string | null;
    setActiveDrag: (id: string | null) => void;
    dropTarget: string | null;
    setDropTarget: (id: string | null) => void;
    dropPosition: DropPosition;
    setDropPosition: (position: DropPosition) => void;
    onDrop: (sourceId: string, targetId: string, position: DropPosition) => void;
};

export type DropPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';