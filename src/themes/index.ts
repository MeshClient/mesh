import { Theme } from '../types/theme';

export const lightTheme: Theme = {
    metadata: {
        id: 'light',
        name: 'Light',
        author: 'Default',
        version: '1.0.0',
    },
    colors: {
        primary: '#5c6bc0',
        secondary: '#26a69a',
        accent: '#ec407a',
        background: {
            primary: '#ffffff',
            secondary: '#f5f5f5',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
            accent: '#5c6bc0',
        },
        status: {
            info: '#2196f3',
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336',
        },
        message: {
            sent: '#e3f2fd',
            received: '#f5f5f5',
            encrypted: '#e8f5e9',
        },
    },
    fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};

export const darkTheme: Theme = {
    metadata: {
        id: 'dark',
        name: 'Dark',
        author: 'Default',
        version: '1.0.0',
    },
    colors: {
        primary: '#7986cb',
        secondary: '#4db6ac',
        accent: '#f48fb1',
        background: {
            primary: '#121212',
            secondary: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
            accent: '#7986cb',
        },
        status: {
            info: '#42a5f5',
            success: '#66bb6a',
            warning: '#ffa726',
            error: '#ef5350',
        },
        message: {
            sent: '#1a237e20',
            received: '#263238',
            encrypted: '#1b5e2020',
        },
    },
    fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};


export const defaultThemes = [lightTheme, darkTheme];