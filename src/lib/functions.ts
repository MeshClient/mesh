/**
 * Utility functions for error handling and color conversion
 * @param error
 * @param fallbackMessage
 */
export const parseError = (error: unknown, fallbackMessage: string = 'An unknown error occurred'): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return fallbackMessage;
}

/**
 * Generates a color based on the username using HSL format
 * @param username Username string
 * @returns HSL color string (e.g. "hsl(120, 50%, 50%)")
 */
export const colorFromUsername = (username: string): string => {
    return `hsl(${username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 40%, 40%)`
}

/**
 * Converts a hex color to HSL format
 * @param hex Hex color string (e.g. "#ffffff" or "#fff")
 * @returns HSL object with h, s, l properties or null if invalid
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return null;
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const l = (max + min) / 2;

    if (max === min) {
        return {h: 0, s: 0, l: Math.round(l * 100)};
    }

    const s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

    let h: number;
    if (max === r) {
        h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
        h = (b - r) / (max - min) + 2;
    } else {
        h = (r - g) / (max - min) + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return {
        h,
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Converts hex color to an HSL string format used by Radix UI
 * @param hex Hex color string
 * @returns HSL string format (e.g. "220 13% 91%") or null if invalid
 */
export function hexToHSLString(hex: string): string | null {
    const hsl = hexToHSL(hex);
    if (!hsl) return null;
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

/**
 * Determines if a color is light or dark
 * @param hex Hex color string
 * @returns true if color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
    const hsl = hexToHSL(hex);
    if (!hsl) return false; // Default to dark if invalid
    return hsl.l > 50;
}

/**
 * Generates a suitable contrast color (black or white) for text on a given background
 * @param bgHex Background color in hex format
 * @returns "#ffffff" for dark backgrounds, "#000000" for light backgrounds
 */
export function getContrastColor(bgHex: string): string {
    return isLightColor(bgHex) ? "#000000" : "#ffffff";
}