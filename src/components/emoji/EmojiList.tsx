import {EmojiCategory} from '@/types/emoji'
import {RefObject, useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

interface EmojiListProps {
    categories: EmojiCategory[]
    onEmojiSelect: (emoji: string, slug: string) => void
    categoryRefs: RefObject<Map<string, HTMLDivElement>>
}

export function EmojiList({categories, onEmojiSelect, categoryRefs}: EmojiListProps) {
    const [tooltipData, setTooltipData] = useState<{ slug: string; x: number; y: number } | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!document.getElementById('emoji-tooltip-container')) {
            const portalContainer = document.createElement('div');
            portalContainer.id = 'emoji-tooltip-container';
            portalContainer.style.position = 'absolute';
            portalContainer.style.top = '0';
            portalContainer.style.left = '0';
            portalContainer.style.width = '100%';
            portalContainer.style.height = '100%';
            portalContainer.style.pointerEvents = 'none';
            portalContainer.style.zIndex = '9999';
            document.body.appendChild(portalContainer);
        }

        return () => {
            const container = document.getElementById('emoji-tooltip-container');
            if (container) {
                document.body.removeChild(container);
            }
        };
    }, []);

    if (categories.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="text-muted-foreground text-center">No emojis found</p>
            </div>
        )
    }

    const renderTooltip = () => {
        if (!tooltipData) return null;

        return createPortal(
            <div
                ref={tooltipRef}
                className="bg-background-primary text-text-primary text-xs px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none"
                style={{
                    position: 'fixed',
                    left: `${tooltipData.x}px`,
                    top: `${tooltipData.y}px`,
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                }}
            >
                :{tooltipData.slug}:
            </div>,
            document.getElementById('emoji-tooltip-container') || document.body
        );
    };

    return (
        <div className="relative px-3 pb-3 h-full">
            {renderTooltip()}
            {categories.map((category, index) => (
                <div
                    key={category.slug}
                    ref={(el) => {
                        if (el && categoryRefs.current) {
                            categoryRefs.current.set(category.slug, el)
                        }
                    }}
                    className={index === categories.length - 1 ? "mb-0" : "mb-3"}
                >
                    <h3 className="text-xs font-medium text-muted-foreground pt-2 pb-1 sticky top-0 bg-background-secondary z-10 mb-1 -mt-px">{category.name}</h3>
                    <div className="grid grid-cols-8 gap-1">
                        {category.emojis.map((emoji) => (
                            <button
                                key={emoji.slug}
                                onClick={() => onEmojiSelect(emoji.emoji, `:${emoji.slug}:`)}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltipData({
                                        slug: emoji.slug,
                                        x: rect.left + rect.width / 2,
                                        y: rect.bottom + 5
                                    });
                                }}
                                onMouseLeave={() => {
                                    setTooltipData(null);
                                }}
                                className="w-7 h-7 flex items-center justify-center text-lg hover:bg-accent rounded cursor-pointer transition-colors"
                                title=""
                            >
                                {emoji.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}