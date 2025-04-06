import {invoke} from "@tauri-apps/api/core";

const fetchHtmlFromTenor = async (searchQuery: string): Promise<string | null> => {
    try {
        const encodedQuery = encodeURIComponent(searchQuery);
        const searchUrl = `https://tenor.com/search/${encodedQuery}-gifs`;
        return await invoke<string>('fetch_url', {url: searchUrl});
    } catch (error) {
        console.error("Error fetching from Tenor:", error);
        return null;
    }
}

export const searchAndDisplayGifs = async (query: string): Promise<string[]> => {
    const html = await fetchHtmlFromTenor(query);

    if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const gifItems = doc.querySelectorAll('.UniversalGifListItem.clickable');

        const gifUrls: string[] = [];
        gifItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.src && img.src.endsWith('.gif')) {
                gifUrls.push(img.src);
            }
        });
        return gifUrls.filter((url: string) => url.includes('tenor.com'));
    }

    return [];
}