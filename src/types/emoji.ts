export interface Emoji {
  emoji: string
  skin_tone_support: boolean
  name: string
  slug: string
  unicode_version: string
  emoji_version: string
}

export interface EmojiCategory {
  name: string
  slug: string
  emojis: Emoji[]
}

export type EmojiPickerTab = 'emoji' | 'stickers' | 'gifs'