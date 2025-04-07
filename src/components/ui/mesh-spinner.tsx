import React from 'react';
import {motion} from 'framer-motion';

interface MeshSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const MeshSpinner: React.FC<MeshSpinnerProps> = ({size = 'md'}) => {
    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-20 h-20',
    };

    const nodeSize = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    const lineThickness = {
        sm: 'border-[1px]',
        md: 'border-[1.5px]',
        lg: 'border-2',
    };

    return (
        <div className={`relative ${sizeMap[size]}`}>
            {/* Rotating outer container */}
            <motion.div
                className="absolute inset-0"
                animate={{rotate: 360}}
                transition={{duration: 10, repeat: Infinity, ease: "linear"}}
            >
                {/* Mesh network nodes */}
                {/* Node 1 (top) */}
                <motion.div
                    className={`absolute ${nodeSize[size]} rounded-full bg-primary top-0 left-1/2 transform -translate-x-1/2`}
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{duration: 2, repeat: Infinity, delay: 0}}
                />

                {/* Node 2 (right) */}
                <motion.div
                    className={`absolute ${nodeSize[size]} rounded-full bg-primary right-0 top-1/2 transform -translate-y-1/2`}
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{duration: 2, repeat: Infinity, delay: 0.4}}
                />

                {/* Node 3 (bottom right) */}
                <motion.div
                    className={`absolute ${nodeSize[size]} rounded-full bg-primary bottom-1/5 right-1/5`}
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{duration: 2, repeat: Infinity, delay: 0.8}}
                />

                {/* Node 4 (bottom left) */}
                <motion.div
                    className={`absolute ${nodeSize[size]} rounded-full bg-primary bottom-1/5 left-1/5`}
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{duration: 2, repeat: Infinity, delay: 1.2}}
                />

                {/* Node 5 (left) */}
                <motion.div
                    className={`absolute ${nodeSize[size]} rounded-full bg-primary left-0 top-1/2 transform -translate-y-1/2`}
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{duration: 2, repeat: Infinity, delay: 1.6}}
                />
            </motion.div>

            {/* Pulsing mesh connection lines */}
            <motion.div
                className="absolute inset-0"
                animate={{rotate: -180}}
                transition={{duration: 15, repeat: Infinity, ease: "linear"}}
            >
                <motion.div
                    className={`absolute h-full w-full rounded-full border-primary ${lineThickness[size]} opacity-40 `}
                    animate={{scale: [0.7, 0.85, 0.7]}}
                    transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
                />

                <motion.div
                    className={`absolute h-full w-full rounded-full border-primary ${lineThickness[size]} opacity-30`}
                    animate={{scale: [0.9, 1.1, 0.9]}}
                    transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                />
            </motion.div>

            {/* Central mesh node */}
            <motion.div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${nodeSize[size]} rounded-full bg-primary`}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
            />

            {/* Cross-mesh lines */}
            <div
                className={`absolute top-0 left-0 w-full h-full ${lineThickness[size]} border-t-primary border-l-primary border-r-transparent border-b-transparent rounded-full opacity-20 rotate-45`}></div>
            <div
                className={`absolute top-0 left-0 w-full h-full ${lineThickness[size]} border-b-primary border-r-primary border-l-transparent border-t-transparent rounded-full opacity-20 rotate-45`}></div>
        </div>
    );
};

export {MeshSpinner};