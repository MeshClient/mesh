import React from 'react';
import {X} from 'lucide-react';
import {TabsTrigger} from '../../ui/tabs';
import {cn} from '@/lib/utils';
import {useDockContext} from './useDockContext.ts';
import {ChatTabInfo} from './types';

interface TabHeaderProps {
    tab: ChatTabInfo;
    isActive: boolean;
    isLastActive: boolean;
    onClose: () => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({
    tab,
    isActive,
    isLastActive,
    onClose,
}) => {
    const {setActiveDrag} = useDockContext();

    return (
        <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
                "flex items-center px-3 py-1.5 relative group cursor-move transition-all duration-200",
                (isActive && isLastActive) && "data-[state=active]:bg-ring/30 font-medium"
            )}
            draggable="true"
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', tab.id);
                e.dataTransfer.effectAllowed = 'move';
                const ghost = document.createElement('div');
                ghost.classList.add('bg-background-secondary', 'text-text-primary', 'px-3', 'py-2', 'rounded-md');
                ghost.innerText = tab.roomName;
                document.body.appendChild(ghost);
                ghost.style.position = 'absolute';
                ghost.style.top = '-1000px';
                e.dataTransfer.setDragImage(ghost, 0, 0);
                setTimeout(() => {
                    document.body.removeChild(ghost);
                }, 0);

                setActiveDrag(tab.id);
            }}
        >
            <div className="flex items-center w-full">
        <span className="text-primary font-medium mr-1">
          {tab.roomType === 'direct' ? '@' : '#'}
        </span>
                <span className="truncate">{tab.roomName}</span>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary flex-shrink-0"
                    draggable="false"
                >
                    <X size={14}/>
                </div>
            </div>
        </TabsTrigger>
    );
};

export default TabHeader;