import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';

const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [notifSettings, setNotifSettings] = useState({...settings.notifications});

  const handleToggle = (field: keyof typeof notifSettings) => {
    if (field !== 'quietHours') {
      const updatedSettings = { 
        ...notifSettings, 
        [field]: !notifSettings[field] 
      };
      setNotifSettings(updatedSettings);
      updateSettings({ notifications: updatedSettings });
    }
  };

  const handleQuietHoursToggle = () => {
    const updatedQuietHours = {
      ...notifSettings.quietHours,
      enabled: !notifSettings.quietHours.enabled
    };
    const updatedSettings = {
      ...notifSettings,
      quietHours: updatedQuietHours
    };
    setNotifSettings(updatedSettings);
    updateSettings({ notifications: updatedSettings });
  };

  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    const updatedQuietHours = {
      ...notifSettings.quietHours,
      [field]: value
    };
    const updatedSettings = {
      ...notifSettings,
      quietHours: updatedQuietHours
    };
    setNotifSettings(updatedSettings);
    updateSettings({ notifications: updatedSettings });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Notifications</h3>
            <p className="text-sm text-text-secondary">Receive notifications for messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={notifSettings.enabled}
              onChange={() => handleToggle('enabled')}
            />
            <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
          </label>
        </div>

        {notifSettings.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sound Notifications</h3>
                <p className="text-sm text-text-secondary">Play sound when receiving notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifSettings.sounds}
                  onChange={() => handleToggle('sounds')}
                />
                <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Desktop Notifications</h3>
                <p className="text-sm text-text-secondary">Show notifications on desktop</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifSettings.desktopNotifications}
                  onChange={() => handleToggle('desktopNotifications')}
                />
                <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mentions Only</h3>
                <p className="text-sm text-text-secondary">Only notify for messages that mention you</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifSettings.mentionsOnly}
                  onChange={() => handleToggle('mentionsOnly')}
                />
                <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-border-primary">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Quiet Hours</h3>
                  <p className="text-sm text-text-secondary">Disable notifications during specific hours</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifSettings.quietHours.enabled}
                    onChange={handleQuietHoursToggle}
                  />
                  <div className="w-11 h-6 bg-background-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
              </div>

              {notifSettings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="px-3 py-2 bg-background-secondary border border-border-primary rounded-md w-full"
                      value={notifSettings.quietHours.start}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="px-3 py-2 bg-background-secondary border border-border-primary rounded-md w-full"
                      value={notifSettings.quietHours.end}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;