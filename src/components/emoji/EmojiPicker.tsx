import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Input} from '@/components/ui/input'
import {CustomEmojiPack, EmojiCategory, EmojiPickerTab} from '@/types/emoji'
import {EmojiList} from './EmojiList'
import {EmojiCategorySelector} from './EmojiCategorySelector'
import {Image, Search, Smile, StickyNote} from 'lucide-react'
import {searchAndDisplayGifs} from "@/lib/gifs.ts"
import {motion} from 'framer-motion';

const loadEmojiData = async () => {
    const module = await import('unicode-emoji-json/data-by-group.json');
    return module.default as EmojiCategory[];
};

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string, slug?: string) => void
    className?: string
    customPacks?: CustomEmojiPack[]
}

export function EmojiPicker({onEmojiSelect, className = '', customPacks = []}: EmojiPickerProps) {
    const [activeTab, setActiveTab] = useState<EmojiPickerTab>('emoji')
    const [searchTerm, setSearchTerm] = useState('')
    const [gifSearchTerm, setGifSearchTerm] = useState('')
    const [isLoadingEmojis, setIsLoadingEmojis] = useState(true)
    const [standardEmojis, setStandardEmojis] = useState<EmojiCategory[]>([])
    const [customEmojis, setCustomEmojis] = useState<EmojiCategory[]>(
        customPacks.map(pack => ({
            ...pack,
            isCustom: true
        }))
    )
    const [activeCategory, setActiveCategory] = useState<string>('')
    const [gifs, setGifs] = useState<string[]>([])
    const [isLoadingGifs, setIsLoadingGifs] = useState(false)
    const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const didInitialLoad = useRef(false)

    useEffect(() => {
        if (didInitialLoad.current) return;

        const loadEmojis = async () => {
            try {
                const data = await loadEmojiData();
                setStandardEmojis(data);
                setActiveCategory(data[0]?.slug || '');
                setIsLoadingEmojis(false);
                didInitialLoad.current = true;
            } catch (error) {
                console.error('Error loading emoji data:', error);
                setIsLoadingEmojis(false);
            }
        };

        loadEmojis().then();
    }, []);

    const allEmojis = useMemo(() => {
        return [...customEmojis, ...standardEmojis]
    }, [standardEmojis, customEmojis])

    const filteredEmojis = useMemo(() => {
        if (!searchTerm) {
            return allEmojis
        }

        const normalizedSearchTerm = searchTerm.toLowerCase()

        return allEmojis
            .map(category => ({
                ...category,
                emojis: category.emojis.filter(emoji =>
                    emoji.name.toLowerCase().includes(normalizedSearchTerm) ||
                    emoji.emoji.includes(normalizedSearchTerm) ||
                    (`:${emoji.slug}:`.toLowerCase().includes(normalizedSearchTerm))
                )
            }))
            .filter(category => category.emojis.length > 0)
    }, [searchTerm, allEmojis])

    useEffect(() => {
        setCustomEmojis(customPacks.map(pack => ({
            ...pack,
            isCustom: true
        })))
    }, [customPacks])

    const scrollToCategory = useCallback((categorySlug: string) => {
        if (categorySlug && scrollContainerRef.current && categoryRefs.current.has(categorySlug)) {
            const container = scrollContainerRef.current
            const categoryElement = categoryRefs.current.get(categorySlug)

            if (categoryElement) {
                container.scrollTo({
                    top: categoryElement.offsetTop,
                    behavior: 'smooth'
                })
            }
        }
    }, [])

    useEffect(() => {
        scrollToCategory(activeCategory)
    }, [activeCategory, scrollToCategory])

    const handleCategoryChange = useCallback((slug: string) => {
        setActiveCategory(slug)
    }, [])

    const handleGifSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!gifSearchTerm.trim()) {
            setGifs([])
            return
        }
        setIsLoadingGifs(true)
        try {
            const searchQuery = gifSearchTerm.trim() || 'trending'
            const gifs = await searchAndDisplayGifs(searchQuery)

            setGifs(gifs)
        } catch (error) {
            console.error('Error fetching GIFs:', error)
        } finally {
            setIsLoadingGifs(false)
        }
    }, [gifSearchTerm])

    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value as EmojiPickerTab)

        if (value !== 'gifs' && gifs.length > 0) {
            setGifs([])
            setGifSearchTerm('')
        }

        if (value !== 'emoji' && searchTerm) {
            setSearchTerm('')
        }
    }, [gifs.length, searchTerm])

    const handleEmojiSelect = useCallback((emoji: string, slug?: string) => {
        onEmojiSelect(emoji, slug)
    }, [onEmojiSelect])

    return (
        <div
            className={`h-96 w-96 bg-background-secondary border rounded-md shadow-lg flex flex-col overflow-hidden ${className}`}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full max-h-full w-full">
                <div className="px-3 pt-3 pb-2 flex-shrink-0">
                    <TabsList className="w-full">
                        <TabsTrigger value="emoji" className="flex-1 flex justify-center items-center">
                            <Smile size={18}/>
                            <span className="sr-only">Emojis</span>
                        </TabsTrigger>
                        <TabsTrigger value="stickers" className="flex-1 flex justify-center items-center">
                            <StickyNote size={18}/>
                            <span className="sr-only">Stickers</span>
                        </TabsTrigger>
                        <TabsTrigger value="gifs" className="flex-1 flex justify-center items-center">
                            <Image size={18}/>
                            <span className="sr-only">GIFs</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="px-3 pb-2 flex-shrink-0">
                    {activeTab === 'emoji' && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search emojis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    )}

                    {activeTab === 'gifs' && (
                        <form onSubmit={handleGifSearch} className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search GIFs and press Enter..."
                                value={gifSearchTerm}
                                onChange={(e) => setGifSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </form>
                    )}

                    {activeTab === 'stickers' && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search stickers (coming soon)..."
                                disabled
                                className="pl-8"
                            />
                        </div>
                    )}
                </div>

                <TabsContent value="emoji" className="p-0 h-full flex-1 overflow-hidden">
                    {isLoadingEmojis ? (
                        <div className="flex items-center justify-center h-full">
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3}}
                            >
                                <p className="text-muted-foreground text-sm mb-2">Loading emojis</p>
                                <div className="flex space-x-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-primary rounded-full"
                                            animate={{
                                                y: [0, -10, 0],
                                                opacity: [0.4, 1, 0.4],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="flex h-full">
                            <div className="h-full flex-1 overflow-y-auto" ref={scrollContainerRef}>
                                <EmojiList
                                    categories={filteredEmojis}
                                    onEmojiSelect={handleEmojiSelect}
                                    categoryRefs={categoryRefs}
                                />
                            </div>

                            {filteredEmojis.length > 0 && !searchTerm && (
                                <div className="h-full border-l pl-1 pr-1 flex-shrink-0">
                                    <EmojiCategorySelector
                                        categories={allEmojis}
                                        activeCategory={activeCategory}
                                        onCategoryChange={handleCategoryChange}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="stickers" className="p-0 overflow-hidden h-full w-full">
                    <div className="flex h-full">
                        <div className="h-full overflow-y-auto flex-1">
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Stickers coming
                                    soon</p> {/* TODO: implement stickers */}
                            </div>
                        </div>

                        <div className="border-l h-full py-2 pl-1 pr-3 flex-shrink-0 overflow-hidden">
                            <div
                                className="h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center">
                                <p className="text-xs text-muted-foreground rotate-90">Sticker packs</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="gifs" className="p-0 overflow-hidden h-full w-full">
                    <div className="w-full h-full overflow-y-auto px-3 py-2">
                        {isLoadingGifs ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                >
                                    <p className="text-muted-foreground text-sm mb-2">Loading GIFs</p>
                                    <div className="flex space-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-primary rounded-full"
                                                animate={{
                                                    y: [0, -10, 0],
                                                    opacity: [0.4, 1, 0.4],
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        ) : gifs.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-2 gap-2"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.2}}
                            >
                                {gifs.map((gifUrl, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleEmojiSelect(gifUrl)} //TODO: potentially upload gif directly for better compatibility with other clients
                                        className="overflow-hidden rounded hover:ring-2 ring-primary"
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.03,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <img
                                            src={gifUrl}
                                            alt={`GIF result ${index + 1}`}
                                            className="w-full h-auto object-cover"
                                            loading="lazy"
                                        />
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="w-full h-full flex flex-col items-center justify-center"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3}}
                            >
                                <motion.p
                                    className="text-muted-foreground text-sm mb-2"
                                    initial={{y: 10}}
                                    animate={{y: 0}}
                                    transition={{delay: 0.1}}
                                >
                                    No GIFs to display
                                </motion.p>
                                <motion.p
                                    className="text-muted-foreground text-xs"
                                    initial={{y: 10}}
                                    animate={{y: 0}}
                                    transition={{delay: 0.2}}
                                >
                                    Try searching for something above
                                </motion.p>
                            </motion.div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}