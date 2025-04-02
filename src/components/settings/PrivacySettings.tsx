import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

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
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={privacySettings.sharePresence}
              onChange={() => handleToggle('sharePresence')}
            />
            <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Share Read Status</h3>
            <p className="text-sm text-text-secondary">Allow others to see when you've read messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={privacySettings.shareReadStatus}
              onChange={() => handleToggle('shareReadStatus')}
            />
            <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Share Typing Status</h3>
            <p className="text-sm text-text-secondary">Allow others to see when you're typing</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={privacySettings.shareTypingStatus}
              onChange={() => handleToggle('shareTypingStatus')}
            />
            <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;