import React, {useCallback, useState} from 'react';
import {Bell, Home, MessageSquare, Plus, Search, Settings} from 'lucide-react';
import {useUI} from '@/hooks/useUI';
import SidebarOption from './SidebarOption';
import FolderItem from './FolderItem';
import RoomItem from './RoomItem';
import {motion} from 'framer-motion';

interface RoomFolder {
    id: string;
    name: string;
    rooms: Room[];
}

interface Room {
    id: string;
    name: string;
    unread?: number;
    type: 'direct' | 'group' | 'space';
}

interface SidebarProps {
    onRoomSelect: (roomId: string) => void;
    activeRoomId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({onRoomSelect, activeRoomId}) => {
    const {toggleSettings} = useUI();

    // TODO: Replace with actual data fetching
    const folders: RoomFolder[] = [
        {
            id: 'favorites',
            name: 'Favorites',
            rooms: [
                {id: 'room1', name: 'matrix-dev', unread: 5, type: 'group'},
                {id: 'room2', name: 'design-team', type: 'group'},
            ]
        },
        {
            id: 'direct-messages',
            name: 'Direct Messages',
            rooms: [
                {id: 'dm1', name: 'jane', unread: 3, type: 'direct'},
                {id: 'dm2', name: 'alex', type: 'direct'},
            ]
        },
        {
            id: 'spaces',
            name: 'Spaces',
            rooms: [
                {id: 'space1', name: 'Matrix Community', type: 'space'},
                {id: 'space2', name: 'Mesh Project', type: 'space'},
            ]
        }
    ];

    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
        'favorites': true,
        'direct-messages': true,
        'spaces': false
    });

    const toggleFolder = useCallback((folderId: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    }, []);

    const handleRoomSelect = useCallback((roomId: string) => {
        onRoomSelect(roomId);
    }, [onRoomSelect]);

    return (
        <motion.div
            className="flex flex-col h-full w-64 bg-background-secondary border-r border-border"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.3, ease: "easeOut"}}
        >
            {/* User Profile */}
            <motion.div
                className="p-4 flex items-center border-b border-border"
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
            >
                <motion.div
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2"
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    <span className="text-sm text-white font-medium">U</span>
                </motion.div>
                <motion.span
                    className="text-sm font-medium"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2, duration: 0.3}}
                >
                    User123
                </motion.span>
            </motion.div>

            {/* Navigation */}
            <div className="px-3 py-3 space-y-1">
                <SidebarOption
                    icon={<Home className="w-4 h-4"/>}
                    label="Home"
                />

                <SidebarOption
                    icon={<Search className="w-4 h-4"/>}
                    label="Find"
                    keyboard="⌘ F"
                />

                <SidebarOption
                    icon={<MessageSquare className="w-4 h-4"/>}
                    label="Messages"
                    badge={8}
                />

                <SidebarOption
                    icon={<Bell className="w-4 h-4"/>}
                    label="Notifications"
                    badge={3}
                    badgeVariant="secondary"
                />

                <SidebarOption
                    icon={<Settings className="w-4 h-4"/>}
                    label="Settings"
                    onClick={toggleSettings}
                />
            </div>

            {/* Divider */}
            <div className="mx-3 my-2 border-t border-border"></div>

            {/* Room Folders */}
            <div className="flex-1 overflow-y-auto px-3">
                {folders.map((folder) => (
                    <FolderItem
                        key={folder.id}
                        name={folder.name}
                        expanded={expandedFolders[folder.id]}
                        onToggle={() => toggleFolder(folder.id)}
                    >
                        {folder.rooms.map((room) => (
                            <RoomItem
                                key={room.id}
                                id={room.id}
                                name={room.name}
                                unread={room.unread}
                                active={activeRoomId === room.id}
                                onClick={() => handleRoomSelect(room.id)}
                            />
                        ))}
                    </FolderItem>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-border">
                <motion.button
                    className="flex items-center justify-center w-full p-2 rounded bg-primary text-primary-foreground text-sm hover:bg-primary/80"
                    whileHover={{
                        scale: 1.03,
                        transition: {duration: 0.2}
                    }}
                    whileTap={{scale: 0.97}}
                >
                    <motion.div
                        className="mr-1.5"
                        animate={{rotate: [0, 0, 180, 180, 0]}}
                        transition={{
                            repeat: Infinity,
                            repeatDelay: 5,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        <Plus className="w-4 h-4"/>
                    </motion.div>
                    Join Room
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;