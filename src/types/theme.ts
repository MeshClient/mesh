export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: {
        primary: string;
        secondary: string;
    };
    text: {
        primary: string;
        secondary: string;
        accent: string;
    };
    status: {
        info: string;
        success: string;
        warning: string;
        error: string;
    };
    // Matrix colors
    message: {
        sent: string;
        received: string;
        encrypted: string;
    };
}

export interface ThemeMetadata {
    id: string;
    name: string;
    author: string;
    version: string;
    description?: string;
}

export interface Theme {
    metadata: ThemeMetadata;
    colors: ThemeColors;
    fontFamily?: {
        sans: string[];
        mono: string[];
    };
    borderRadius?: {
        sm: string;
        md: string;
        lg: string;
    };
}