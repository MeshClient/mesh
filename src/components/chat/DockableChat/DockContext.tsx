import React, {createContext, ReactNode} from 'react';
import {DockContextType} from './types';

const DockContext = createContext<DockContextType>({
    activeDrag: null,
    setActiveDrag: () => {
    },
    dropTarget: null,
    setDropTarget: () => {
    },
    dropPosition: 'center',
    setDropPosition: () => {
    },
    onDrop: () => {
    },
});

interface DockContextProviderProps {
    children: ReactNode;
    value: DockContextType;
}

const DockContextProvider: React.FC<DockContextProviderProps> = ({
    children,
    value
}) => {
    return (
        <DockContext.Provider value={value}>
            {children}
        </DockContext.Provider>
    );
};


export {DockContext, DockContextProvider};