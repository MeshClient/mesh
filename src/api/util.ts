import {invoke} from "@tauri-apps/api/core";


/**
 * Fetches the list of system fonts.
 * @returns {Promise<string[]>} A promise that resolves to an array of font names.
 */
export const getSystemFonts = async (): Promise<string[]> => {
    try {
        return await invoke<string[]>('get_system_fonts');
    } catch (error) {
        console.error("Error fetching system fonts:", error);
        return [];
    }
}

/**
 * Fetches the content of a given URL. No preprocessing is done on the content.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string | null>} A promise that resolves to the fetched content or null if an error occurs.
 */
export const fetchPage = async (url: string): Promise<string | null> => {
    try {
        return await invoke<string>('fetch_url', {url});
    } catch (error) {
        console.error("Error fetching page:", error);
        return null;
    }
}