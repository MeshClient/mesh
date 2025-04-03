import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

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
          <Switch 
            checked={notifSettings.enabled}
            onCheckedChange={() => handleToggle('enabled')}
          />
        </div>

        {notifSettings.enabled && (
          <>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sound Notifications</h3>
                <p className="text-sm text-text-secondary">Play sound when receiving notifications</p>
              </div>
              <Switch 
                checked={notifSettings.sounds}
                onCheckedChange={() => handleToggle('sounds')}
              />
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Desktop Notifications</h3>
                <p className="text-sm text-text-secondary">Show notifications on desktop</p>
              </div>
              <Switch 
                checked={notifSettings.desktopNotifications}
                onCheckedChange={() => handleToggle('desktopNotifications')}
              />
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mentions Only</h3>
                <p className="text-sm text-text-secondary">Only notify for messages that mention you</p>
              </div>
              <Switch 
                checked={notifSettings.mentionsOnly}
                onCheckedChange={() => handleToggle('mentionsOnly')}
              />
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Quiet Hours</h3>
                  <p className="text-sm text-text-secondary">Disable notifications during specific hours</p>
                </div>
                <Switch 
                  checked={notifSettings.quietHours.enabled}
                  onCheckedChange={handleQuietHoursToggle}
                />
              </div>

              {notifSettings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      className="bg-background-secondary border-border-primary"
                      value={notifSettings.quietHours.start}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      className="bg-background-secondary border-border-primary"
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