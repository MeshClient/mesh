import {EmojiCategory} from '@/types/emoji'
import {cn} from '@/lib/utils'

interface EmojiCategorySelectorProps {
    categories: EmojiCategory[]
    activeCategory: string
    onCategoryChange: (slug: string) => void
    isCustom?: boolean
}

export function EmojiCategorySelector({
    categories,
    activeCategory,
    onCategoryChange,
    isCustom = false
}: EmojiCategorySelectorProps) {
    return (
        <div className="flex flex-col gap-1 h-full overflow-y-auto max-h-full py-1 no-scrollbar">
            {categories.map((category) => {
                const firstEmoji = category.emojis[0]?.emoji || '🔍'
                const isCustomCategory = isCustom || category.isCustom;

                return (
                    <button
                        key={category.slug}
                        onClick={() => onCategoryChange(category.slug)}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-lg hover:bg-accent rounded cursor-pointer transition-colors",
                            activeCategory === category.slug
                                ? "bg-accent"
                                : "hover:bg-accent/50",
                            isCustomCategory ? "border-l-2 border-primary" : ""
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