import {useContext} from "react";
import {DockContext} from "@/components/chat/DockableChat/DockContext.tsx";

export const useDockContext = () => {
    const context = useContext(DockContext);
    if (context === undefined) {
        throw new Error('useDockContext must be used within a DockContextProvider');
    }
    return context;
};
