import {EmojiCategory} from '@/types/emoji'
import {cn} from '@/lib/utils'

interface EmojiCategorySelectorProps {
    categories: EmojiCategory[]
    activeCategory: string
    onCategoryChange: (slug: string) => void
}

export function EmojiCategorySelector({
    categories,
    activeCategory,
    onCategoryChange
}: EmojiCategorySelectorProps) {
    return (
        <div className="flex overflow-x-auto py-1 gap-1 no-scrollbar">
            {categories.map((category) => {
                const firstEmoji = category.emojis[0]?.emoji || '🔍'

                return (
                    <button
                        key={category.slug}
                        onClick={() => onCategoryChange(category.slug)}
                        className={cn(
                            "min-w-8 h-8 rounded flex items-center justify-center text-lg transition-colors shrink-0",
                            activeCategory === category.slug
                                ? "bg-accent"
                                : "hover:bg-accent/50"
                        )}
                        title={category.name}
                    >
                        {firstEmoji}
                    </button>
                )
            })}
        </div>
    )
}