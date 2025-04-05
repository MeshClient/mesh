import {ChatPanel, DropPosition} from './types';

// Helper function to clean up empty panels
export const cleanupPanel = (
    state: Record<string, ChatPanel>,
    panelId: string,
    skipMainPanel: boolean = false
): Record<string, ChatPanel> => {
    if (skipMainPanel && panelId === 'main-panel') return state;
    if (!state[panelId]) return state;

    // Create a deep copy of the state to avoid mutating the original
    const stateCopy = JSON.parse(JSON.stringify(state));
    const panel = stateCopy[panelId] as ChatPanel;

    if ((panel.chatTabs && panel.chatTabs.length > 0) ||
        (panel.childPanels && panel.childPanels.length > 0)) {
        return stateCopy;
    }

    let parentId: string | undefined;
    for (const [id, p] of Object.entries(stateCopy) as [string, ChatPanel][]) {
        if (p.childPanels?.includes(panelId)) {
            parentId = id;
            break;
        }
    }
    if (!parentId) return stateCopy;

    const parentPanel = stateCopy[parentId] as ChatPanel;
    parentPanel.childPanels = parentPanel.childPanels!.filter(childId => childId !== panelId);

    if (parentPanel.childPanels.length === 1 && parentId !== 'root') {
        const remainingChildId = parentPanel.childPanels[0];

        for (const [, grandParent] of Object.entries(stateCopy)) {
            const typedGrandParent = grandParent as ChatPanel;
            if (typedGrandParent.childPanels?.includes(parentId)) {
                typedGrandParent.childPanels = typedGrandParent.childPanels.map(
                    pid => pid === parentId ? remainingChildId : pid
                );

                if (stateCopy[remainingChildId]) {
                    (stateCopy[remainingChildId] as ChatPanel).size = parentPanel.size;
                }

                delete stateCopy[parentId];
                break;
            }
        }
    }

    delete stateCopy[panelId];
    return stateCopy;
};

// Calculate drop position based on mouse coordinates
export const calculateDropPosition = (
    element: HTMLElement,
    clientX: number,
    clientY: number
): DropPosition => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const edgeSize = 0.2;

    if (x < width * edgeSize) {
        return 'left';
    } else if (x > width * (1 - edgeSize)) {
        return 'right';
    } else if (y < height * edgeSize) {
        return 'top';
    } else if (y > height * (1 - edgeSize)) {
        return 'bottom';
    }

    return 'center';
};

// Mock functions for room data - TODO: Replace with actual data fetching logic
export const getRoomName = (roomId: string): string => {
    const rooms: Record<string, string> = {
        'room1': 'matrix-dev',
        'room2': 'design-team',
        'dm1': 'jane',
        'dm2': 'alex',
        'space1': 'Matrix Community',
        'space2': 'Mesh Project'
    };

    return rooms[roomId] || 'Unknown Room';
};

export const getRoomType = (roomId: string): 'direct' | 'group' | 'space' => {
    if (roomId.startsWith('dm')) return 'direct';
    if (roomId.startsWith('space')) return 'space';
    return 'group';
};