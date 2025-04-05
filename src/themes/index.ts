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
        accent: '#116a7c',
        background: {
            primary: '#FAFAFA',
            secondary: '#F5F5F5',
            tertiary: '#acc4ea',
        },
        text: {
            primary: '#2c3035',
            secondary: '#3e4545',
            accent: '#ADB5BD',
        },
        status: {
            info: '#73C2FB',
            success: '#82C99B',
            warning: '#FDCA95',
            error: '#ff9e9e',
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
        accent: '#01a3b8',
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
            error: '#f33a3a',
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
        accent: '#004750',
        background: {
            primary: '#FFFFFF',
            secondary: '#F2F3F5',
            tertiary: '#5c6e8c',
        },
        text: {
            primary: '#17191c',
            secondary: '#2d333a',
            accent: '#99AAB5',
        },
        status: {
            info: '#3498DB',
            success: '#3BA55C',
            warning: '#F0B232',
            error: '#ffc7c7',
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
        accent: '#00BCD4',
        background: {
            primary: '#030403',
            secondary: '#141414',
            tertiary: '#3F5F5F',
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
            error: '#97100d',
        }
    },
}


export const defaultThemes = [lightTheme, darkTheme, highContrastLightTheme, highContrastDarkTheme];