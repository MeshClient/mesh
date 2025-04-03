import { Settings } from '../types/settings';

export const defaultSettings: Settings = {
    matrix: {
        homeserver: 'https://matrix.org'
    },
    ui: {
        themeId: 'dark',
        useSystemTheme: false,
        fontFamily: 'Inter'
    },
    notifications: {
        enabled: true,
        sounds: true,
        desktopNotifications: true,
        mentionsOnly: false,
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
        },
    },
    privacy: {
        sharePresence: true,
        shareReadStatus: true,
        shareTypingStatus: true,
    },
    developerMode: false,
};