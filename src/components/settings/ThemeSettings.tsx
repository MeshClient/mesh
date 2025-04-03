import React, { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme.ts';
import { useSettings } from '@/hooks/useSettings.ts';
import { useSystemFonts } from '@/hooks/useSystemFonts.ts';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';

const ThemeSettings: React.FC = () => {
  const { currentTheme, availableThemes, setTheme, setUseSystemTheme, setFontFamily } = useTheme();
  const { settings } = useSettings();
  const { fonts, loading } = useSystemFonts();
  
  const fontOptions = useMemo(() => {
    return fonts.map(font => ({
      value: font,
      label: font === 'system-ui' ? 'System Font' : font
    }));
  }, [fonts]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Theme Settings</h2>
      
      {/* System Theme Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="system-theme-toggle" className="block text-sm font-medium">
            Use System Theme
          </Label>
          <Switch 
            id="system-theme-toggle"
            checked={settings.ui.useSystemTheme}
            onCheckedChange={setUseSystemTheme}
          />
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Automatically switch between light and dark theme based on your system preferences
        </p>
      </div>
      
      {/* Only show theme selection if system theme is disabled */}
      {!settings.ui.useSystemTheme && (
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-2">
            Select Theme
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {availableThemes.map((theme) => (
              <Card
                key={theme.metadata.id}
                className={`cursor-pointer border-2 
                  ${currentTheme.metadata.id === theme.metadata.id 
                    ? 'border-ring' 
                    : 'border-border-primary'}`}
                onClick={() => setTheme(theme.metadata.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{theme.metadata.name}</span>
                    {currentTheme.metadata.id === theme.metadata.id && (
                      <span className="text-sm text-accent-primary">Active</span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">{theme.metadata.description}</div>
                  <div className="mt-3 flex space-x-2">
                    {Object.entries(theme.colors).slice(0, 3).map(([key, value]) => {
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Font Family Selection */}
      <div className="mb-6">
        <Label htmlFor="font-family-select" className="block text-sm font-medium mb-2">
          Font Family
        </Label>
        
        {loading ? (
          <div className="w-full p-2 text-text-secondary">Loading system fonts...</div>
        ) : (
          <>
            <Select
              value={settings.ui.fontFamily}
              onValueChange={setFontFamily}
            >
              <SelectTrigger id="font-family-select" className="w-full">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {fontOptions.map(font => (
                    <SelectItem 
                      key={font.value} 
                      value={font.value} 
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="text-xs text-text-secondary mt-1">
              {fonts.length} fonts available
            </div>
          </>
        )}
        
        <p className="text-xs text-text-secondary mt-1">
          Choose the main font used throughout the application
        </p>
        
        {/* Font Preview */}
        <Card className="mt-4">
          <CardContent className="p-3">
            <p className="mb-2 text-sm font-medium">Preview:</p>
            <p className="text-lg" style={{ fontFamily: settings.ui.fontFamily }}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-sm mt-2" style={{ fontFamily: settings.ui.fontFamily }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettings;