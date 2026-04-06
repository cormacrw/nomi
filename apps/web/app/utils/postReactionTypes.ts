export const REACTION_TYPE_KEYS = ['heart', 'thumbs_up', 'laugh'] as const

export type ReactionTypeKey = (typeof REACTION_TYPE_KEYS)[number]

export const REACTION_OPTIONS: { key: ReactionTypeKey, emoji: string, label: string }[] = [
  { key: 'heart', emoji: '❤️', label: 'Love' },
  { key: 'thumbs_up', emoji: '👍', label: 'Like' },
  { key: 'laugh', emoji: '😂', label: 'Laugh' },
]

const keySet = new Set<string>(REACTION_TYPE_KEYS)

export function isValidReactionType (s: string): s is ReactionTypeKey {
  return keySet.has(s)
}

export function reactionEmoji (key: string): string {
  const row = REACTION_OPTIONS.find((o) => o.key === key)
  return row?.emoji ?? '·'
}
