import React, {useEffect, useRef, useState} from 'react';
import {ChatPanel, ChatTabInfo, DropPosition} from './types';
import {calculateDropPosition, cleanupPanel, getRoomName, getRoomType} from './utils';
import {DockContextProvider} from './DockContext.tsx';
import Panel from './Panel';
import CollapsibleSidebar from '../CollapsibleSidebar';

const DockableChat: React.FC = () => {
    // Panel state
    const [panels, setPanels] = useState<Record<string, ChatPanel>>({
        'root': {
            id: 'root',
            direction: 'horizontal',
            childPanels: ['main-panel'],
            size: 100
        },
        'main-panel': {
            id: 'main-panel',
            direction: 'horizontal',
            chatTabs: [],
            size: 100
        }
    });

    const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});
    const [lastActivePanel, setLastActivePanel] = useState<string>('main-panel');

    const [activeDrag, setActiveDrag] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<DropPosition>('center');
    const dropTargetTimerRef = useRef<number | null>(null);
    const dropTargetElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!activeDrag) return;

        const handleDragOver = (e: DragEvent) => {
            if (!activeDrag) return;

            let target = e.target as HTMLElement;
            let panelElement = null;

            while (target) {
                if (target.dataset && target.dataset.panelId) {
                    panelElement = target;
                    break;
                }
                target = target.parentElement as HTMLElement;
            }

            if (panelElement && panelElement.dataset.panelId) {
                const panelId = panelElement.dataset.panelId;
                if (dropTargetElementRef.current === panelElement) {
                    const position = calculateDropPosition(panelElement, e.clientX, e.clientY);
                    setDropPosition(position);
                    return;
                }

                if (dropTargetTimerRef.current) {
                    window.clearTimeout(dropTargetTimerRef.current);
                    dropTargetTimerRef.current = null;
                }

                dropTargetElementRef.current = panelElement;
                const position = calculateDropPosition(panelElement, e.clientX, e.clientY);
                setDropPosition(position);
                setDropTarget(panelId);
            } else {
                if (dropTargetTimerRef.current) {
                    return; // Don't create multiple timers
                }

                dropTargetTimerRef.current = window.setTimeout(() => {
                    setDropTarget(null);
                    dropTargetElementRef.current = null;
                    dropTargetTimerRef.current = null;
                }, 100);
            }
        };

        window.addEventListener('dragover', handleDragOver);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            if (dropTargetTimerRef.current) {
                window.clearTimeout(dropTargetTimerRef.current);
            }
        };
    }, [activeDrag, dropTarget]);

    // Handle room selection from sidebar
    const handleRoomSelect = (roomId: string) => {
        // Check if room is already open in a tab
        for (const [panelId, panel] of Object.entries(panels) as [string, ChatPanel][]) {
            const existingTab = panel.chatTabs?.find(tab => tab.roomId === roomId);
            if (existingTab) {
                setActiveTabs({
                    ...activeTabs,
                    [panelId]: existingTab.id
                });
                setLastActivePanel(panelId);
                return;
            }
        }

        const roomName = getRoomName(roomId);
        const roomType = getRoomType(roomId);
        const newTabId = `tab-${Date.now()}`;

        let targetPanelId = lastActivePanel;
        if (!panels[targetPanelId]) {
            targetPanelId = 'main-panel';
            for (const [panelId, panel] of Object.entries(panels) as [string, ChatPanel][]) {
                if (panel.chatTabs && panel.chatTabs.length > 0) {
                    targetPanelId = panelId;
                    break;
                }
            }
        }

        setPanels(prev => {
            // Deep copy to avoid mutation issues
            const stateCopy = JSON.parse(JSON.stringify(prev));

            if (!stateCopy[targetPanelId]) {
                stateCopy[targetPanelId] = {
                    id: targetPanelId,
                    direction: 'horizontal',
                    chatTabs: [],
                    size: 100
                };

                if (stateCopy['root']) {
                    stateCopy['root'].childPanels = [targetPanelId];
                } else {
                    stateCopy['root'] = {
                        id: 'root',
                        direction: 'horizontal',
                        childPanels: [targetPanelId],
                        size: 100
                    };
                }
            }

            if (!stateCopy[targetPanelId].chatTabs) {
                stateCopy[targetPanelId].chatTabs = [];
            }

            stateCopy[targetPanelId].chatTabs.push({
                id: newTabId,
                roomId,
                roomName,
                roomType
            });

            return stateCopy;
        });

        setActiveTabs(prev => ({
            ...prev,
            [targetPanelId]: newTabId
        }));

        setLastActivePanel(targetPanelId);
    };

    const handleCloseTab = (panelId: string, tabId: string) => {
        const needsNewActiveTab = activeTabs[panelId] === tabId;
        let newActiveTabId: string | undefined;

        if (needsNewActiveTab) {
            const panel = panels[panelId] as ChatPanel;
            const remainingTabs = panel.chatTabs?.filter(tab => tab.id !== tabId);
            if (remainingTabs && remainingTabs.length > 0) {
                newActiveTabId = remainingTabs[0].id;
            }
        }

        setPanels(prev => {
            const stateCopy = JSON.parse(JSON.stringify(prev));
            if (stateCopy[panelId] && stateCopy[panelId].chatTabs) {
                stateCopy[panelId].chatTabs = stateCopy[panelId].chatTabs.filter(
                    (tab: ChatTabInfo) => tab.id !== tabId
                );
            }

            if (stateCopy[panelId]) {
                const isEmpty = !stateCopy[panelId].chatTabs?.length &&
                    (!stateCopy[panelId].childPanels || !stateCopy[panelId].childPanels.length);
                if (isEmpty) {
                    return cleanupPanel(stateCopy, panelId, false);
                }
            }

            return stateCopy;
        });

        if (needsNewActiveTab) {
            setActiveTabs(prev => {
                const newActive = {...prev};

                if (newActiveTabId) {
                    newActive[panelId] = newActiveTabId;
                } else {
                    delete newActive[panelId];
                }

                return newActive;
            });
        }
    };

    const handleTabActivate = (panelId: string, tabId: string) => {
        setActiveTabs(prev => ({
            ...prev,
            [panelId]: tabId
        }));
        setLastActivePanel(panelId);
    };

    const handleDrop = (sourceTabId: string, targetPanelId: string, position: DropPosition) => {
        let sourcePanelId = '';
        let sourceTab: ChatTabInfo | undefined;

        for (const [panelId, panel] of Object.entries(panels) as [string, ChatPanel][]) {
            const tab = panel.chatTabs?.find(tab => tab.id === sourceTabId);
            if (tab) {
                sourcePanelId = panelId;
                sourceTab = JSON.parse(JSON.stringify(tab));
                break;
            }
        }

        if (!sourceTab || !sourcePanelId) return;
        if (sourcePanelId === targetPanelId && position === 'center') return;

        let needToUpdateSourceActive = false;
        let newSourceActiveTab: string | undefined;

        if (activeTabs[sourcePanelId] === sourceTabId) {
            needToUpdateSourceActive = true;
            const sourcePanel = panels[sourcePanelId] as ChatPanel;
            const remainingTabs = sourcePanel.chatTabs?.filter(tab => tab.id !== sourceTabId);
            if (remainingTabs && remainingTabs.length > 0) {
                newSourceActiveTab = remainingTabs[0].id;
            }
        }

        if (position !== 'center') {
            const newPanelId = `panel-${Date.now()}`;

            setPanels(prev => {
                const stateCopy = JSON.parse(JSON.stringify(prev));

                if (stateCopy[sourcePanelId] && stateCopy[sourcePanelId].chatTabs) {
                    stateCopy[sourcePanelId].chatTabs = stateCopy[sourcePanelId].chatTabs.filter(
                        (tab: ChatTabInfo) => tab.id !== sourceTabId
                    );
                }

                stateCopy[newPanelId] = {
                    id: newPanelId,
                    direction: 'horizontal',
                    chatTabs: [sourceTab],
                    size: 50
                };

                if (stateCopy[targetPanelId]) {
                    stateCopy[targetPanelId].size = 50;
                }

                let parentPanelId: string | undefined;
                for (const [id, panel] of Object.entries(stateCopy) as [string, ChatPanel][]) {
                    if (panel.childPanels?.includes(targetPanelId)) {
                        parentPanelId = id;
                        break;
                    }
                }

                const direction: 'horizontal' | 'vertical' =
                    position === 'left' || position === 'right' ? 'horizontal' : 'vertical';

                if (!parentPanelId) {
                    parentPanelId = `parent-${Date.now()}`;

                    stateCopy[parentPanelId] = {
                        id: parentPanelId,
                        direction: direction,
                        childPanels: position === 'left' || position === 'top'
                            ? [newPanelId, targetPanelId]
                            : [targetPanelId, newPanelId],
                        size: stateCopy[targetPanelId].size || 100
                    };

                    if (stateCopy['root']) {
                        stateCopy['root'].childPanels = [parentPanelId];
                    }
                } else {
                    // If parent exists, check if we need an intermediate panel
                    const parentPanel = stateCopy[parentPanelId];
                    if (parentPanel.direction !== direction) {
                        const intermediateId = `intermediate-${Date.now()}`;
                        stateCopy[intermediateId] = {
                            id: intermediateId,
                            direction: direction,
                            childPanels: position === 'left' || position === 'top'
                                ? [newPanelId, targetPanelId]
                                : [targetPanelId, newPanelId],
                            size: stateCopy[targetPanelId].size || 50
                        };
                        if (parentPanel.childPanels) {
                            const targetIndex = parentPanel.childPanels.indexOf(targetPanelId);
                            if (targetIndex !== -1) {
                                const newChildPanels = [...parentPanel.childPanels];
                                newChildPanels[targetIndex] = intermediateId;
                                parentPanel.childPanels = newChildPanels;
                            }
                        }
                    } else {
                        if (parentPanel.childPanels) {
                            const targetIndex = parentPanel.childPanels.indexOf(targetPanelId);
                            if (targetIndex !== -1) {
                                const newChildPanels = [...parentPanel.childPanels];
                                if (position === 'left' || position === 'top') {
                                    newChildPanels.splice(targetIndex, 0, newPanelId);
                                } else {
                                    newChildPanels.splice(targetIndex + 1, 0, newPanelId);
                                }
                                parentPanel.childPanels = newChildPanels;
                            }
                        }
                    }
                }

                return cleanupPanel(stateCopy, sourcePanelId, false);
            });

            setActiveTabs(prev => {
                const newActive = {...prev};
                newActive[newPanelId] = sourceTabId;
                if (needToUpdateSourceActive) {
                    if (newSourceActiveTab) {
                        newActive[sourcePanelId] = newSourceActiveTab;
                    } else {
                        delete newActive[sourcePanelId];
                    }
                }
                return newActive;
            });

            setLastActivePanel(newPanelId);
        } else {
            // Drop in center - move tab to existing panel
            setPanels(prev => {
                const stateCopy = JSON.parse(JSON.stringify(prev));

                if (stateCopy[sourcePanelId] && stateCopy[sourcePanelId].chatTabs) {
                    stateCopy[sourcePanelId].chatTabs = stateCopy[sourcePanelId].chatTabs.filter(
                        (tab: ChatTabInfo) => tab.id !== sourceTabId
                    );
                }

                if (stateCopy[targetPanelId]) {
                    if (!stateCopy[targetPanelId].chatTabs) {
                        stateCopy[targetPanelId].chatTabs = [];
                    }
                    stateCopy[targetPanelId].chatTabs.push(sourceTab);
                }

                return cleanupPanel(stateCopy, sourcePanelId, false);
            });

            setActiveTabs(prev => {
                const newActive = {...prev};
                newActive[targetPanelId] = sourceTabId;
                if (needToUpdateSourceActive) {
                    if (newSourceActiveTab) {
                        newActive[sourcePanelId] = newSourceActiveTab;
                    } else {
                        delete newActive[sourcePanelId];
                    }
                }
                return newActive;
            });

            setLastActivePanel(targetPanelId);
        }
    };

    const getActiveRoomId = () => {
        for (const [panelId, panel] of Object.entries(panels) as [string, ChatPanel][]) {
            if (panel.chatTabs && activeTabs[panelId]) {
                const activeTab = panel.chatTabs.find(tab => tab.id === activeTabs[panelId]);
                if (activeTab) {
                    return activeTab.roomId;
                }
            }
        }
        return undefined;
    };

    const dockContextValue = {
        activeDrag,
        setActiveDrag,
        dropTarget,
        setDropTarget,
        dropPosition,
        setDropPosition,
        onDrop: handleDrop
    };

    return (
        <DockContextProvider value={dockContextValue}>
            <div className="flex h-full w-full overflow-hidden">
                {/* Sidebar */}
                <div className="flex-none h-full">
                    <CollapsibleSidebar
                        onRoomSelect={handleRoomSelect}
                        activeRoomId={getActiveRoomId()}
                    />
                </div>

                {/* Chat Area */}
                <div className="flex-1 min-w-0 overflow-hidden">
                    <Panel
                        panelId="root"
                        panels={panels}
                        activeTabs={activeTabs}
                        lastActivePanel={lastActivePanel}
                        onTabActivate={handleTabActivate}
                        onCloseTab={handleCloseTab}
                    />
                </div>
            </div>
        </DockContextProvider>
    );
};

export default DockableChat;