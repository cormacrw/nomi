/** Cache-bust public avatar URLs when the underlying object is overwritten at the same path. */
export function avatarSrc (
  url: string | null | undefined,
  updatedAt: string | null | undefined,
): string | null {
  if (!url) return null
  if (!updatedAt) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${encodeURIComponent(updatedAt)}`
}
