import { EmojiCategory } from '@/types/emoji'
import { RefObject } from 'react'

interface EmojiListProps {
  categories: EmojiCategory[]
  onEmojiSelect: (emoji: string) => void
  categoryRefs: RefObject<Map<string, HTMLDivElement>>
}

export function EmojiList({ categories, onEmojiSelect, categoryRefs }: EmojiListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-muted-foreground text-center">No emojis found</p>
      </div>
    )
  }

  return (
    <div className="px-3 pt-1 pb-3 h-full">
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
          <h3 className="text-xs font-medium text-muted-foreground pt-2 pb-1 sticky top-0 bg-background-secondary z-10 mb-1">{category.name}</h3>
          <div className="grid grid-cols-8 gap-1">
            {category.emojis.map((emoji) => (
              <button
                key={emoji.slug}
                onClick={() => onEmojiSelect(emoji.emoji)}
                className="w-7 h-7 flex items-center justify-center text-lg hover:bg-accent rounded cursor-pointer transition-colors"
                title={emoji.name}
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