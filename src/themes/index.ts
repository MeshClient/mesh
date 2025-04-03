import {Theme} from '../types/theme';

export const lightTheme: Theme = {
    metadata: {
        id: 'light',
        name: 'Light',
        author: 'Default',
        version: '1.0.0',
    },
    colors: {
        primary: '#6B8CDF',
        secondary: '#E9ECEF',
        accent: '#A78BFA',
        background: {
            primary: '#FAFAFA',
            secondary: '#F5F5F5',
            tertiary: '#acc4ea',
        },
        text: {
            primary: '#343A40',
            secondary: '#6C757D',
            accent: '#ADB5BD',
        },
        status: {
            info: '#73C2FB',
            success: '#82C99B',
            warning: '#FDCA95',
            error: '#F99A9A',
        }
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
        primary: '#7289DA',
        secondary: '#36393F',
        accent: '#9B84EE',
        background: {
            primary: '#202225',
            secondary: '#2F3136',
            tertiary: '#41596f',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B9BBBE',
            accent: '#8E9297',
        },
        status: {
            info: '#3498DB',
            success: '#43B581',
            warning: '#FAA61A',
            error: '#F04747',
        }
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

export const highContrastLightTheme: Theme = {
    metadata: {
        id: 'high-contrast-light',
        name: 'High Contrast Light',
        author: 'Default',
        version: '1.0.0',
    },
    colors: {
        primary: '#5865F2',
        secondary: '#E3E5E8',
        accent: '#8B73FF',
        background: {
            primary: '#FFFFFF',
            secondary: '#F2F3F5',
            tertiary: '#5c6e8c',
        },
        text: {
            primary: '#2E3338',
            secondary: '#747F8D',
            accent: '#99AAB5',
        },
        status: {
            info: '#3498DB',
            success: '#3BA55C',
            warning: '#F0B232',
            error: '#ED4245',
        }
    },
    fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
    },
}

export const highContrastDarkTheme = {
    metadata: {
        id: 'high-contrast-dark',
        name: 'High Contrast Dark',
        author: 'Default',
        version: '1.0.0',
    },
    colors: {
        primary: '#5D8AA8',
        secondary: '#1E1E1E',
        accent: '#BB86FC',
        background: {
            primary: '#121212',
            secondary: '#1E1E1E',
            tertiary: '#2F4F4F',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            accent: '#A0A0A0',
        },
        status: {
            info: '#64B5F6',
            success: '#66BB6A',
            warning: '#FFA726',
            error: '#EF5350',
        },
        message: {
            sent: '#2D3748',
            received: '#1A202C',
            encrypted: '#2F4F4F',
        }
    },
}


export const defaultThemes = [lightTheme, darkTheme, highContrastLightTheme, highContrastDarkTheme];