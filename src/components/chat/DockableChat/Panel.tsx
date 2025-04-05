import React from 'react';
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Move} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Tabs, TabsContent, TabsList} from '../../ui/tabs';
import {ChatPanel} from './types';
import {useDockContext} from './useDockContext.ts';
import {calculateDropPosition} from './utils';
import TabHeader from './TabHeader';
import ChatTab from '../ChatTab';

interface PanelProps {
    panelId: string;
    panels: Record<string, ChatPanel>;
    activeTabs: Record<string, string>;
    lastActivePanel: string;
    onTabActivate: (panelId: string, tabId: string) => void;
    onCloseTab: (panelId: string, tabId: string) => void;
}

const Panel: React.FC<PanelProps> = ({
    panelId,
    panels,
    activeTabs,
    lastActivePanel,
    onTabActivate,
    onCloseTab,
}) => {
    const {activeDrag, dropTarget, onDrop, setDropTarget, setActiveDrag} = useDockContext();
    const panel = panels[panelId];

    if (!panel) return null;

    if (panel.childPanels && panel.childPanels.length > 0) {
        return (
            <div
                className={cn(
                    "flex",
                    panel.direction === 'horizontal' ? "flex-row" : "flex-col",
                    "h-full w-full overflow-hidden"
                )}
            >
                {panel.childPanels.map((childId) => {
                    const childPanel = panels[childId] as ChatPanel | undefined;
                    return (
                        <div
                            key={childId}
                            className="flex-1 min-w-0 min-h-0 overflow-hidden"
                            style={{flexBasis: `${childPanel?.size || 100}%`}}
                        >
                            <Panel
                                panelId={childId}
                                panels={panels}
                                activeTabs={activeTabs}
                                lastActivePanel={lastActivePanel}
                                onTabActivate={onTabActivate}
                                onCloseTab={onCloseTab}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    if (panel.chatTabs && panel.chatTabs.length > 0) {
        const activeTabId = activeTabs[panelId] || panel.chatTabs[0]?.id;

        return (
            <Tabs
                value={activeTabId}
                onValueChange={(value) => onTabActivate(panelId, value)}
                className="flex flex-col h-full border-[2px] border-border"
            >
                <TabsList
                    className="flex-none px-1 pt-1 bg-background-secondary border-b border-border overflow-x-auto">
                    {panel.chatTabs.map((tab) => (
                        <TabHeader
                            key={tab.id}
                            tab={tab}
                            isActive={tab.id === activeTabId}
                            isLastActive={lastActivePanel === panelId}
                            onClose={() => onCloseTab(panelId, tab.id)}
                        />
                    ))}
                </TabsList>

                <div
                    className="flex-1 relative overflow-hidden"
                    data-panel-id={panelId}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const tabId = e.dataTransfer.getData('text/plain');
                        const position = calculateDropPosition(
                            e.currentTarget as HTMLElement,
                            e.clientX,
                            e.clientY
                        );
                        onDrop(tabId, panelId, position);
                        setDropTarget(null);
                        setActiveDrag(null);
                    }}
                >
                    {/* Drop indicators */}
                    {dropTarget === panelId && activeDrag && <DropIndicator/>}

                    {panel.chatTabs.map((tab) => (
                        <TabsContent
                            key={tab.id}
                            value={tab.id}
                            className="h-full p-0 data-[state=inactive]:hidden"
                        >
                            <ChatTab
                                roomId={tab.roomId}
                                roomName={tab.roomName}
                                roomType={tab.roomType}
                                onActivate={() => onTabActivate(panelId, tab.id)}
                            />
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        );
    }

    return (
        <div className="flex items-center justify-center h-full bg-background-primary text-text-secondary">
            No chat tabs open
        </div>
    );
};

const DropIndicator: React.FC = () => {
    const {dropPosition} = useDockContext();

    return (
        <>
            <div className="absolute inset-0 z-10 pointer-events-none border-2 border-primary/80 rounded-md"></div>
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-[20%] z-20 pointer-events-none rounded-l-md border-r border-primary/40 transition-colors duration-100",
                dropPosition === 'left' ? "bg-primary/30" : "bg-primary/10"
            )}>
                <ArrowLeft className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
                    dropPosition === 'left' ? "text-primary scale-125" : "text-primary/60"
                )} size={24}/>
            </div>
            <div className={cn(
                "absolute right-0 top-0 bottom-0 w-[20%] z-20 pointer-events-none rounded-r-md border-l border-primary/40 transition-colors duration-100",
                dropPosition === 'right' ? "bg-primary/30" : "bg-primary/10"
            )}>
                <ArrowRight className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
                    dropPosition === 'right' ? "text-primary scale-125" : "text-primary/60"
                )} size={24}/>
            </div>
            <div className={cn(
                "absolute top-0 left-0 right-0 h-[20%] z-20 pointer-events-none rounded-t-md border-b border-primary/40 transition-colors duration-100",
                dropPosition === 'top' ? "bg-primary/30" : "bg-primary/10"
            )}>
                <ArrowUp className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
                    dropPosition === 'top' ? "text-primary scale-125" : "text-primary/60"
                )} size={24}/>
            </div>
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-[20%] z-20 pointer-events-none rounded-b-md border-t border-primary/40 transition-colors duration-100",
                dropPosition === 'bottom' ? "bg-primary/30" : "bg-primary/10"
            )}>
                <ArrowDown className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
                    dropPosition === 'bottom' ? "text-primary scale-125" : "text-primary/60"
                )} size={24}/>
            </div>
            <div className={cn(
                "absolute left-[20%] right-[20%] top-[20%] bottom-[20%] z-20 pointer-events-none flex items-center justify-center transition-colors duration-100",
                dropPosition === 'center' ? "bg-primary/30" : "bg-primary/10"
            )}>
                <Move className={cn(
                    "transition-transform duration-200",
                    dropPosition === 'center' ? "text-primary scale-125" : "text-primary/60"
                )} size={32}/>
            </div>
        </>
    );
};

export default Panel;