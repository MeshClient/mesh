import {UIContext, UIContextType} from "@/contexts/UIContext.types.ts";
import {useContext} from "react";

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};