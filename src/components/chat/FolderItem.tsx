import React, {ReactNode} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronDown, Folder, Plus} from 'lucide-react';

interface FolderItemProps {
    name: string;
    expanded: boolean;
    onToggle: () => void;
    children: ReactNode;
}

const FolderItem: React.FC<FolderItemProps> = React.memo(({
    name,
    expanded,
    onToggle,
    children
}) => {
    return (
        <motion.div
            className="mb-2"
            initial={{opacity: 0, y: 5}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
        >
            <motion.div
                className="flex items-center justify-between p-1 cursor-pointer group"
                onClick={onToggle}
                whileHover={{
                    backgroundColor: 'rgba(30, 30, 30, 0.5)',
                    borderRadius: '0.25rem'
                }}
                whileTap={{scale: 0.98}}
            >
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-5 h-5 mr-1">
                        <motion.div
                            initial={{rotate: expanded ? 90 : 0}}
                            animate={{rotate: expanded ? 0 : -90}}
                            transition={{duration: 0.2, ease: "easeInOut"}}
                            style={{
                                display: "flex",
                                transformOrigin: "center"
                            }}
                        >
                            <ChevronDown className="w-3.5 h-3.5 text-text-secondary"/>
                        </motion.div>
                    </div>

                    <motion.div whileHover={{rotate: 5}} transition={{type: "spring", stiffness: 400, damping: 10}}>
                        <Folder className="w-4 h-4 mr-1.5 text-text-secondary"/>
                    </motion.div>

                    <span className="text-sm font-medium">{name}</span>
                </div>

                <motion.div
                    initial={{opacity: 0}}
                    whileHover={{opacity: 1, scale: 1.1}}
                    transition={{duration: 0.2}}
                >
                    <Plus className="w-3.5 h-3.5 text-text-secondary"/>
                </motion.div>
            </motion.div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        className="pl-6 space-y-0.5 mt-1 overflow-hidden"
                        key="folder-content"
                        initial={{opacity: 0, height: 0}}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            transition: {
                                height: {duration: 0.3},
                                opacity: {duration: 0.2, delay: 0.1}
                            }
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                                height: {duration: 0.2},
                                opacity: {duration: 0.1}
                            }
                        }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

export default FolderItem;