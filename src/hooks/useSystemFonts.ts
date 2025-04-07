import {useEffect, useState} from 'react';
import {getSystemFonts} from "@/api";

export function useSystemFonts() {
    const [fonts, setFonts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFonts() {
            const webSafeFonts = [
                'system-ui',
                'Inter',
                'Roboto',
                'Arial',
                'Helvetica',
                'Segoe UI',
                'SF Pro',
                'Verdana',
                'Tahoma'
            ];

            try {
                setLoading(true);
                const systemFonts = await getSystemFonts();

                const webSafeFontsSet = new Set(webSafeFonts);
                const uniqueSystemFonts = systemFonts.filter(font => !webSafeFontsSet.has(font));

                setFonts([...webSafeFonts, ...uniqueSystemFonts]);
            } catch (err) {
                console.error('Failed to load system fonts:', err);
                setFonts(webSafeFonts);
            } finally {
                setLoading(false);
            }
        }

        loadFonts().then();
    }, []);

    return {fonts, loading};
}