import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
}) => {
  const [tabValue, setTabValue] = useState(defaultValue);
  
  const currentValue = value !== undefined ? value : tabValue;
  const handleValueChange = onValueChange || setTabValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`tabs-list flex space-x-2 border-b border-border-primary ${className || ""}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      className={`tabs-trigger px-4 py-2 rounded-t-md ${
        isSelected 
          ? "bg-background-secondary border-b-2 border-accent-primary font-medium" 
          : "hover:bg-background-hover"
      } ${className || ""}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div className={`tabs-content p-4 ${className || ""}`}>
      {children}
    </div>
  );
};