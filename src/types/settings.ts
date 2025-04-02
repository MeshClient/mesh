export interface MatrixSettings {
    homeserver: string;
}

export interface UISettings {
    themeId: string;
}

export interface NotificationSettings { // TODO: rough draft
    enabled: boolean;
    sounds: boolean;
    desktopNotifications: boolean;
    mentionsOnly: boolean;
    quietHours: {
        enabled: boolean;
        start: string; // "HH:MM"
        end: string; // "HH:MM"
    };
}

export interface PrivacySettings {
    sharePresence: boolean;
    shareReadStatus: boolean;
    shareTypingStatus: boolean;
}

export type SettingsTypes = 'matrix' | 'ui' | 'notifications' | 'privacy' | 'developerMode';

export interface Settings {
    matrix: MatrixSettings;
    ui: UISettings;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    developerMode: boolean;
}