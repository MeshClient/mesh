import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const MatrixSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [homeserver, setHomeserver] = useState(settings.matrix.homeserver);

  const handleSave = async () => {
    await updateSettings({
      matrix: {
        homeserver,
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Matrix Connection Settings</h2>
      
      <div className="mb-6">
        <Label className="block text-sm font-medium mb-2" htmlFor="homeserver">
          Homeserver URL
        </Label>
        <div className="flex space-x-2">
          <Input
            id="homeserver"
            type="text"
            className="bg-background-secondary border-border-primary"
            value={homeserver}
            onChange={(e) => setHomeserver(e.target.value)}
            placeholder="https://matrix.org"
          />
          <Button 
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          The URL of your Matrix homeserver. Default is matrix.org.
        </p>
      </div>
    </div>
  );
};

export default MatrixSettings;