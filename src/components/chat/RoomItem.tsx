import React from 'react';
import {motion} from 'framer-motion';
import {Hash} from 'lucide-react';
import {cn} from '@/lib/utils';

interface RoomItemProps {
    id: string;
    name: string;
    unread?: number;
    active?: boolean;
    onClick: (id: string) => void;
}

const RoomItem: React.FC<RoomItemProps> = React.memo(({
    id,
    name,
    unread,
    active = false,
    onClick
}) => {
    return (
        <motion.div
            className={cn(
                "flex items-center p-1.5 rounded text-sm",
                "hover:bg-background-tertiary/50 cursor-pointer",
                active && "bg-background-tertiary text-text-primary"
            )}
            onClick={onClick.bind(null, id)}
            whileHover={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                scale: 1.02,
                transition: {duration: 0.2}
            }}
            whileTap={{scale: 0.98}}
            initial={{opacity: 0, x: -5}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.2}}
        >
            <motion.div
                className="mr-2 flex-shrink-0"
                whileHover={{rotate: 15}}
                transition={{type: "spring", stiffness: 400, damping: 10}}
            >
                <Hash className="w-3.5 h-3.5"/>
            </motion.div>

            <span className="truncate">{name}</span>

            {unread && (
                <motion.span
                    className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 rounded"
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 17
                    }}
                >
                    {unread}
                </motion.span>
            )}
        </motion.div>
    );
});

export default RoomItem;