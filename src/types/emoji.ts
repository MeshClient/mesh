export interface Emoji {
  emoji: string
  skin_tone_support: boolean
  name: string
  slug: string
  unicode_version?: string
  emoji_version?: string
  source?: string
}

export interface EmojiCategory {
  name: string
  slug: string
  emojis: Emoji[]
  isCustom?: boolean
  source?: string
}

export type EmojiPickerTab = 'emoji' | 'stickers' | 'gifs'

export interface CustomEmojiPack {
  name: string
  slug: string
  source: string
  emojis: Emoji[]
}