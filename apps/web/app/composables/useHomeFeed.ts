import { sameProfileId } from '~/composables/useResolvedAuthUserId'
import type { ReactionTypeKey } from '~/utils/postReactionTypes'
import { isValidReactionType } from '~/utils/postReactionTypes'

const PAGE_SIZE = 20
const SIGNED_URL_TTL_SEC = 900

/** PostgREST double-quoted literal for filter values */
function postgrestQuote (value: string) {
  return `"${String(value).replace(/"/g, '""')}"`
}

export type FeedMediaItem = {
  postMediaId: string
  sortOrder: number
  storagePath: string
  mimeType: string | null
  width: number | null
  height: number | null
  signedUrl: string | null
}

export type FeedReaction = {
  profileId: string
  reactionType: string
  createdAt: string
  reactorDisplayName: string | null
  reactorAvatarUrl: string | null
  reactorAvatarUpdatedAt: string | null
}

export type FeedPost = {
  postId: string
  caption: string
  createdAt: string
  authorProfileId: string
  authorDisplayName: string | null
  authorAvatarUrl: string | null
  authorAvatarUpdatedAt: string | null
  media: FeedMediaItem[]
  reactions: FeedReaction[]
}

type RawProfile = {
  display_name: string | null
  avatar_url: string | null
  updated_at: string | null
} | null
type RawMedia = {
  post_media_id: string
  sort_order: number
  storage_path: string
  mime_type: string | null
  width: number | null
  height: number | null
}

type RawReactionRow = {
  profile_id: string
  reaction_type: string
  created_at: string
  profiles?: RawProfile | RawProfile[] | null
}

type RawPostRow = {
  post_id: string
  caption: string
  created_at: string
  author_profile_id: string
  profiles: RawProfile | RawProfile[]
  post_media: RawMedia[] | null
  post_reactions: RawReactionRow[] | null
}

function normalizeProfile (p: RawProfile | RawProfile[] | null | undefined) {
  const row = p == null ? null : Array.isArray(p) ? p[0] : p
  if (!row) {
    return {
      display_name: null as string | null,
      avatar_url: null as string | null,
      updated_at: null as string | null,
    }
  }
  return row
}

function mapRawReactions (rows: RawReactionRow[] | null | undefined): FeedReaction[] {
  if (!rows?.length) return []
  const sorted = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
  return sorted.map((r) => {
    const prof = normalizeProfile(r.profiles)
    return {
      profileId: r.profile_id,
      reactionType: r.reaction_type,
      createdAt: r.created_at,
      reactorDisplayName: prof.display_name,
      reactorAvatarUrl: prof.avatar_url,
      reactorAvatarUpdatedAt: prof.updated_at,
    }
  })
}

function mapRawPost (row: RawPostRow): Omit<FeedPost, 'media'> & { media: Omit<FeedMediaItem, 'signedUrl'>[] } {
  const prof = normalizeProfile(row.profiles)
  const mediaRows = [...(row.post_media ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return {
    postId: row.post_id,
    caption: row.caption,
    createdAt: row.created_at,
    authorProfileId: row.author_profile_id,
    authorDisplayName: prof.display_name,
    authorAvatarUrl: prof.avatar_url,
    authorAvatarUpdatedAt: prof.updated_at,
    reactions: mapRawReactions(row.post_reactions),
    media: mediaRows.map((m) => ({
      postMediaId: m.post_media_id,
      sortOrder: m.sort_order,
      storagePath: m.storage_path,
      mimeType: m.mime_type,
      width: m.width,
      height: m.height,
    })),
  }
}

function patchPostReactions (
  post: FeedPost,
  userId: string,
  next: { type: 'set', reactionType: ReactionTypeKey } | { type: 'clear' },
): FeedPost {
  if (next.type === 'clear') {
    return {
      ...post,
      reactions: post.reactions.filter((r) => !sameProfileId(r.profileId, userId)),
    }
  }
  const idx = post.reactions.findIndex((r) => sameProfileId(r.profileId, userId))
  if (idx >= 0) {
    const nextReactions = [...post.reactions]
    nextReactions[idx] = {
      ...post.reactions[idx],
      reactionType: next.reactionType,
    }
    return { ...post, reactions: nextReactions }
  }
  const newRow: FeedReaction = {
    profileId: userId,
    reactionType: next.reactionType,
    createdAt: new Date().toISOString(),
    reactorDisplayName: 'You',
    reactorAvatarUrl: null,
    reactorAvatarUpdatedAt: null,
  }
  return { ...post, reactions: [...post.reactions, newRow] }
}

export function useHomeFeed () {
  const supabase = useSupabaseClient()

  const posts = useState<FeedPost[]>('home-feed-posts', () => [])
  const loadingInitial = useState('home-feed-loading-initial', () => true)
  const loadingMore = useState('home-feed-loading-more', () => false)
  const error = useState<string | null>('home-feed-error', () => null)
  const hasMore = useState('home-feed-has-more', () => true)

  const signedUrlCache = useState<Record<string, string>>('home-feed-signed-urls', () => ({}))

  const selectColumns = `
    post_id,
    caption,
    created_at,
    author_profile_id,
    profiles!posts_author_profile_id_fkey (display_name, avatar_url, updated_at),
    post_media (post_media_id, sort_order, storage_path, mime_type, width, height),
    post_reactions (
      profile_id,
      reaction_type,
      created_at,
      profiles!post_reactions_profile_id_fkey (display_name, avatar_url, updated_at)
    )
  `

  async function signPaths (paths: string[]) {
    const unique = [...new Set(paths)].filter(Boolean)
    const cache = signedUrlCache.value
    const out: Record<string, string> = { ...cache }
    const need = unique.filter((p) => !out[p])
    if (need.length === 0) return out

    const results = await Promise.all(
      need.map(async (path) => {
        const { data, error: signErr } = await supabase.storage
          .from('post_media')
          .createSignedUrl(path, SIGNED_URL_TTL_SEC)
        if (signErr || !data?.signedUrl) {
          return { path, url: null as string | null }
        }
        return { path, url: data.signedUrl }
      }),
    )

    for (const { path, url } of results) {
      if (url) out[path] = url
    }
    signedUrlCache.value = out
    return out
  }

  async function attachSignedUrls (mapped: ReturnType<typeof mapRawPost>[]): Promise<FeedPost[]> {
    const paths = mapped.flatMap((p) => p.media.map((m) => m.storagePath))
    const urlByPath = await signPaths(paths)
    return mapped.map((p) => ({
      postId: p.postId,
      caption: p.caption,
      createdAt: p.createdAt,
      authorProfileId: p.authorProfileId,
      authorDisplayName: p.authorDisplayName,
      authorAvatarUrl: p.authorAvatarUrl,
      authorAvatarUpdatedAt: p.authorAvatarUpdatedAt,
      reactions: p.reactions,
      media: p.media.map((m) => ({
        ...m,
        signedUrl: urlByPath[m.storagePath] ?? null,
      })),
    }))
  }

  function keysetOr (cursor: { createdAt: string, postId: string }) {
    const t = postgrestQuote(cursor.createdAt)
    const id = cursor.postId
    return `and(created_at.eq.${t},post_id.lt.${id}),created_at.lt.${t}`
  }

  async function fetchPage (cursor: { createdAt: string, postId: string } | null) {
    let q = supabase
      .from('posts')
      .select(selectColumns)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .order('post_id', { ascending: false })
      .order('created_at', { ascending: true, foreignTable: 'post_reactions' })
      .limit(PAGE_SIZE)

    if (cursor) {
      q = q.or(keysetOr(cursor))
    }

    const { data, error: qErr } = await q

    if (qErr) {
      return { ok: false as const, message: qErr.message, rows: [] as RawPostRow[] }
    }

    return { ok: true as const, rows: (data ?? []) as RawPostRow[] }
  }

  async function refresh () {
    const silent = posts.value.length > 0
    if (!silent) {
      loadingInitial.value = true
    }
    error.value = null
    hasMore.value = true

    const { ok, message, rows } = await fetchPage(null)

    if (!ok) {
      error.value = message
      if (!silent) {
        posts.value = []
      }
      loadingInitial.value = false
      return
    }

    const mapped = rows.map((r) => mapRawPost(r))
    posts.value = await attachSignedUrls(mapped)
    hasMore.value = rows.length >= PAGE_SIZE
    loadingInitial.value = false
  }

  async function loadMore () {
    if (loadingMore.value || !hasMore.value || posts.value.length === 0) return

    const last = posts.value[posts.value.length - 1]
    const cursor = { createdAt: last.createdAt, postId: last.postId }

    loadingMore.value = true
    error.value = null

    const { ok, message, rows } = await fetchPage(cursor)

    if (!ok) {
      error.value = message
      loadingMore.value = false
      return
    }

    const mapped = rows.map((r) => mapRawPost(r))
    const withUrls = await attachSignedUrls(mapped)
    posts.value = [...posts.value, ...withUrls]
    hasMore.value = rows.length >= PAGE_SIZE
    loadingMore.value = false
  }

  /** Re-sign a single path (e.g. image 403) and patch posts in place */
  async function refreshSignedUrlForPath (storagePath: string) {
    const { data, error: signErr } = await supabase.storage
      .from('post_media')
      .createSignedUrl(storagePath, SIGNED_URL_TTL_SEC)
    if (signErr || !data?.signedUrl) return

    signedUrlCache.value = { ...signedUrlCache.value, [storagePath]: data.signedUrl }

    posts.value = posts.value.map((p) => ({
      ...p,
      media: p.media.map((m) =>
        m.storagePath === storagePath ? { ...m, signedUrl: data.signedUrl } : m,
      ),
    }))
  }

  async function setReaction (postId: string, reactionType: ReactionTypeKey) {
    if (!isValidReactionType(reactionType)) {
      return { ok: false as const, message: 'Invalid reaction' }
    }
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return { ok: false as const, message: 'Not signed in' }

    const before = posts.value.find((p) => p.postId === postId)
    if (!before) return { ok: false as const, message: 'Post not found' }

    posts.value = posts.value.map((p) =>
      p.postId === postId ? patchPostReactions(p, user.id, { type: 'set', reactionType }) : p,
    )

    const { error: upErr } = await supabase.from('post_reactions').upsert(
      {
        post_id: postId,
        profile_id: user.id,
        reaction_type: reactionType,
      },
      { onConflict: 'post_id,profile_id' },
    )

    if (upErr) {
      posts.value = posts.value.map((p) => (p.postId === postId ? before : p))
      return { ok: false as const, message: upErr.message }
    }
    return { ok: true as const }
  }

  async function clearReaction (postId: string) {
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return { ok: false as const, message: 'Not signed in' }

    const before = posts.value.find((p) => p.postId === postId)
    if (!before) return { ok: false as const, message: 'Post not found' }

    posts.value = posts.value.map((p) =>
      p.postId === postId ? patchPostReactions(p, user.id, { type: 'clear' }) : p,
    )

    const { error: delErr } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('profile_id', user.id)

    if (delErr) {
      posts.value = posts.value.map((p) => (p.postId === postId ? before : p))
      return { ok: false as const, message: delErr.message }
    }
    return { ok: true as const }
  }

  return {
    posts,
    loadingInitial,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    refreshSignedUrlForPath,
    setReaction,
    clearReaction,
  }
}
