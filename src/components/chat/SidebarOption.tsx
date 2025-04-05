import React, {ReactNode} from 'react';
import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';

interface SidebarOptionProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    badge?: string | number;
    badgeVariant?: 'primary' | 'secondary';
    keyboard?: string;
    active?: boolean;
}

const SidebarOption: React.FC<SidebarOptionProps> = React.memo(({
    icon,
    label,
    onClick,
    badge,
    badgeVariant = 'primary',
    keyboard,
    active = false
}) => {
    return (
        <motion.div
            className={cn(
                "flex items-center justify-between p-2 rounded cursor-pointer",
                active && "bg-background-tertiary/50"
            )}
            onClick={onClick}
            whileHover={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                scale: 1.02,
                transition: {duration: 0.2}
            }}
            whileTap={{scale: 0.98}}
            initial={{opacity: 0.9, y: 5}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
        >
            <div className="flex items-center">
                <motion.div
                    className="mr-3 text-text-secondary"
                    whileHover={{rotate: 5}}
                    transition={{type: "spring", stiffness: 400, damping: 10}}
                >
                    {icon}
                </motion.div>
                <span>{label}</span>
            </div>

            {badge && (
                <motion.span
                    className={cn(
                        "text-xs px-1.5 rounded",
                        badgeVariant === 'primary' ? "bg-primary text-primary-foreground" : "bg-primary/80 text-primary-foreground"
                    )}
                    initial={{scale: 0.8, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{type: "spring", stiffness: 500, damping: 17}}
                >
                    {badge}
                </motion.span>
            )}

            {keyboard && (
                <span className="text-xs text-muted-foreground">{keyboard}</span>
            )}
        </motion.div>
    );
});

export default SidebarOption;