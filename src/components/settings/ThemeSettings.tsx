import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeSettings: React.FC = () => {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Theme Settings</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availableThemes.map((theme) => (
            <div
              key={theme.metadata.id}
              className={`p-4 rounded-md cursor-pointer border-2 
                ${currentTheme.metadata.id === theme.metadata.id 
                  ? 'border-accent-primary' 
                  : 'border-border-primary'}`}
              onClick={() => setTheme(theme.metadata.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{theme.metadata.name}</span>
                {currentTheme.metadata.id === theme.metadata.id && (
                  <span className="text-sm text-accent-primary">Active</span>
                )}
              </div>
              <div className="text-sm text-text-secondary">{theme.metadata.description}</div>
              <div className="mt-3 flex space-x-2">
                {Object.entries(theme.colors).slice(0, 5).map(([key, value]) => {
                  if (typeof value === 'string') {
                    return (
                      <div 
                        key={key}
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: value }}
                        title={key}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;