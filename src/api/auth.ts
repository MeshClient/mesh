import {invoke} from "@tauri-apps/api/core";
import {LoginOption} from "@/types/auth.ts";

/**
 * Fetches the login options for a given homeserver URL.
 * @param {string} homeserverUrl - The URL of the homeserver.
 * @returns {Promise<LoginOption[]>} A promise that resolves to an array of login options.
 */
export const getLoginOptions = async (homeserverUrl: string): Promise<LoginOption[]> => {
    try {
        if (!homeserverUrl) {
            return [];
        }
        let url = homeserverUrl;
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }
        return await invoke<LoginOption[]>('get_login_options', {homeserverUrl: url});
    } catch (error) {
        console.error("Error fetching login options:", error);
        return [];
    }
}

/**
 * Fetches the list of available homeservers.
 * @returns {Promise<string[]>} A promise that resolves to an array of homeserver URLs.
 */
export const getUsername = async (): Promise<string | null> => {
    try {
        return await invoke<string>('get_username');
    } catch {
        return null;
    }
}

/**
 * Logs in to the application using the specified login method.
 * @param {string} kind - The type of login method (e.g., "m.login.password").
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
 */
export const login = async (kind: string, username: string, password: string): Promise<boolean> => {
    try {
        await invoke<void>('login', {kind, username, password});
        return true;
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
}