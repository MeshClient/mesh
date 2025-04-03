import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

const PrivacySettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [privacySettings, setPrivacySettings] = useState({...settings.privacy});

  const handleToggle = (field: keyof typeof privacySettings) => {
    const updatedSettings = { 
      ...privacySettings, 
      [field]: !privacySettings[field] 
    };
    setPrivacySettings(updatedSettings);
    updateSettings({ privacy: updatedSettings });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Share Presence</h3>
            <p className="text-sm text-text-secondary">Allow others to see when you're online</p>
          </div>
          <Switch 
            checked={privacySettings.sharePresence}
            onCheckedChange={() => handleToggle('sharePresence')}
          />
        </div>
        
        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Share Read Status</h3>
            <p className="text-sm text-text-secondary">Allow others to see when you've read messages</p>
          </div>
          <Switch 
            checked={privacySettings.shareReadStatus}
            onCheckedChange={() => handleToggle('shareReadStatus')}
          />
        </div>
        
        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Share Typing Status</h3>
            <p className="text-sm text-text-secondary">Allow others to see when you're typing</p>
          </div>
          <Switch 
            checked={privacySettings.shareTypingStatus}
            onCheckedChange={() => handleToggle('shareTypingStatus')}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;