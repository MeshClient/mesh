import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {colorFromUsername} from "@/lib/functions.ts";

export interface TypingUser {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface TypingIndicatorProps {
    users: TypingUser[];
    className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({users, className}) => {
    if (users.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={cn("px-4 py-1 flex items-center", className)}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 10}}
                transition={{duration: 0.2}}
            >
                <div className="flex -space-x-2 mr-2">
                    {users.slice(0, 3).map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 15
                            }}
                        >
                            <Avatar
                                size="xs"
                                className="border-2 border-background-primary"
                                style={{backgroundColor: colorFromUsername(user.name)}}
                            >
                                {user.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt={user.name}/>
                                ) : (
                                    <AvatarFallback className="text-xs">
                                        {user.name.substring(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </motion.div>
                    ))}
                </div>

                <motion.div className="text-xs text-text-secondary flex items-center">
          <span>
            {users.length === 1
                ? `${users[0].name} is typing`
                : users.length === 2
                    ? `${users[0].name} and ${users[1].name} are typing`
                    : users.length === 3
                        ? `${users[0].name}, ${users[1].name}, and ${users[2].name} are typing`
                        : `${users.length} people are typing`}
          </span>
                    <motion.div className="ml-1 flex items-center">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="inline-block w-1 h-1 bg-text-secondary rounded-full mx-0.5"
                                animate={{
                                    opacity: [0.4, 1, 0.4],
                                    y: [1, -2, 1]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TypingIndicator;