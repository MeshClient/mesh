import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Bell, ChevronLeft, Home, Menu, MessageSquare, Search, Settings} from 'lucide-react';
import {useUI} from '@/hooks/useUI';
import Sidebar from './Sidebar';

const getIconForMiniSidebar = (iconName: string) => {
    switch (iconName) {
        case 'home':
            return <Home className="w-4 h-4"/>;
        case 'search':
            return <Search className="w-4 h-4"/>;
        case 'messages':
            return <MessageSquare className="w-4 h-4"/>;
        case 'notifications':
            return <Bell className="w-4 h-4"/>;
        case 'settings':
            return <Settings className="w-4 h-4"/>;
        default:
            return null;
    }
};

interface CollapsibleSidebarProps {
    onRoomSelect: (roomId: string) => void;
    activeRoomId?: string;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = (props) => {
    const {sidebarCollapsed, toggleSidebar, toggleSettings} = useUI();

    return (
        <div className="relative h-full bg-background-secondary">
            <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                    <motion.div
                        key="full-sidebar"
                        initial={{width: 0, opacity: 0}}
                        animate={{
                            width: 'auto',
                            opacity: 1,
                            boxShadow: "0 0 15px rgba(0, 0, 0, 0.05)"
                        }}
                        exit={{
                            width: 0,
                            opacity: 0,
                            boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
                            overflow: 'hidden'
                        }}
                        className="h-full"
                    >
                        <Sidebar {...props} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <motion.button
                className={`absolute ${sidebarCollapsed ? 'left-0' : 'right-0'} top-4 z-20 bg-background-secondary hover:bg-background-tertiary/70 rounded-full shadow-md border border-border flex items-center justify-center`}
                style={{
                    width: '32px',
                    height: '32px',
                    transform: `translateX(${sidebarCollapsed ? '12px' : '-8px'})`,
                }}
                whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{scale: 0.9}}
                onClick={toggleSidebar}
                animate={{
                    x: sidebarCollapsed ? 12 : -8,
                    rotate: sidebarCollapsed ? 0 : 180
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    rotate: {duration: 0.3}
                }}
            >
                <div className="flex items-center justify-center w-full h-full">
                    {sidebarCollapsed ? (
                        <Menu className="w-4 h-4"/>
                    ) : (
                        <ChevronLeft className="w-4 h-4"/>
                    )}
                </div>
            </motion.button>

            {/* Mini sidebar when collapsed */}
            <AnimatePresence initial={false}>
                {sidebarCollapsed && (
                    <motion.div
                        key="mini-sidebar"
                        initial={{width: 0, opacity: 0}}
                        animate={{
                            width: '56px',
                            opacity: 1,
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)"
                        }}
                        exit={{width: 0, opacity: 0}}
                        style={{overflow: 'visible'}}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="h-full bg-background-secondary border-r border-border flex flex-col items-center py-14"
                    >
                        <div className="flex pt-4 flex-col space-y-6 items-center">
                            {/* User avatar */}
                            <motion.div
                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                initial={{opacity: 1}}
                            >
                                <span className="text-sm text-white font-medium">U</span>
                            </motion.div>

                            {/* Quick action buttons */}
                            <div className="flex flex-col space-y-5">
                                {['home', 'search', 'messages', 'notifications', 'settings'].map((icon,) => (
                                    <motion.div
                                        key={icon}
                                        className="w-8 h-8 rounded-md bg-background-tertiary/40 flex items-center justify-center cursor-pointer hover:bg-background-tertiary"
                                        whileHover={{scale: 1.1, backgroundColor: 'rgba(30, 30, 30, 0.7)'}}
                                        whileTap={{scale: 0.9}}
                                        initial={{opacity: 1}}
                                        onClick={icon === 'settings' ? toggleSettings : toggleSidebar}
                                    >
                                        {getIconForMiniSidebar(icon)}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSidebar;