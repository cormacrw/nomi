export type FriendProfile = {
  profileId: string
  displayName: string | null
  avatarUrl: string | null
  avatarUpdatedAt: string | null
}

export type PendingByRequest = {
  friendRequestId: string
  profileId: string
  displayName: string | null
  avatarUrl: string | null
  avatarUpdatedAt: string | null
}

async function getCurrentUserId (supabase: ReturnType<typeof useSupabaseClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

function mapProfiles (
  rows: {
    profile_id: string
    display_name: string | null
    avatar_url: string | null
    updated_at: string | null
  }[],
): Map<string, { displayName: string | null, avatarUrl: string | null, avatarUpdatedAt: string | null }> {
  const m = new Map<string, { displayName: string | null, avatarUrl: string | null, avatarUpdatedAt: string | null }>()
  for (const p of rows) {
    m.set(p.profile_id, {
      displayName: p.display_name,
      avatarUrl: p.avatar_url,
      avatarUpdatedAt: p.updated_at,
    })
  }
  return m
}

export function useFriendsList () {
  const supabase = useSupabaseClient()

  const friends = ref<FriendProfile[]>([])
  const incomingPending = ref<PendingByRequest[]>([])
  const outgoingPending = ref<PendingByRequest[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function refresh () {
    const uid = await getCurrentUserId(supabase)
    if (!uid) {
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    const [
      { data: acceptedRows, error: accErr },
      { data: inRows, error: inErr },
      { data: outRows, error: outErr },
    ] = await Promise.all([
      supabase
        .from('friend_requests')
        .select('from_profile_id, to_profile_id')
        .eq('status', 'accepted')
        .or(`from_profile_id.eq.${uid},to_profile_id.eq.${uid}`),
      supabase
        .from('friend_requests')
        .select('friend_request_id, from_profile_id')
        .eq('to_profile_id', uid)
        .eq('status', 'pending'),
      supabase
        .from('friend_requests')
        .select('friend_request_id, to_profile_id')
        .eq('from_profile_id', uid)
        .eq('status', 'pending'),
    ])

    if (accErr) {
      error.value = accErr.message
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }
    if (inErr) {
      error.value = inErr.message
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }
    if (outErr) {
      error.value = outErr.message
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }

    const accepted = acceptedRows ?? []
    const otherIdsForFriends = accepted.map((fr) =>
      fr.from_profile_id === uid ? fr.to_profile_id : fr.from_profile_id,
    )

    const incomingFr = inRows ?? []
    const outgoingFr = outRows ?? []

    const pendingOtherIds = [
      ...incomingFr.map((r) => r.from_profile_id),
      ...outgoingFr.map((r) => r.to_profile_id),
    ]

    const allProfileIds = [...new Set([...otherIdsForFriends, ...pendingOtherIds])]

    if (allProfileIds.length === 0) {
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }

    const { data: profs, error: pErr } = await supabase
      .from('profiles')
      .select('profile_id, display_name, avatar_url, updated_at')
      .in('profile_id', allProfileIds)

    if (pErr) {
      error.value = pErr.message
      friends.value = []
      incomingPending.value = []
      outgoingPending.value = []
      loading.value = false
      return
    }

    const pmap = mapProfiles(profs ?? [])

    const friendList: FriendProfile[] = otherIdsForFriends.map((id) => {
      const meta = pmap.get(id)
      return {
        profileId: id,
        displayName: meta?.displayName ?? null,
        avatarUrl: meta?.avatarUrl ?? null,
        avatarUpdatedAt: meta?.avatarUpdatedAt ?? null,
      }
    })

    friendList.sort((a, b) => {
      const na = (a.displayName || 'Friend').toLowerCase()
      const nb = (b.displayName || 'Friend').toLowerCase()
      return na.localeCompare(nb)
    })
    friends.value = friendList

    incomingPending.value = incomingFr.map((r) => {
      const meta = pmap.get(r.from_profile_id)
      return {
        friendRequestId: r.friend_request_id,
        profileId: r.from_profile_id,
        displayName: meta?.displayName ?? null,
        avatarUrl: meta?.avatarUrl ?? null,
        avatarUpdatedAt: meta?.avatarUpdatedAt ?? null,
      }
    })

    outgoingPending.value = outgoingFr.map((r) => {
      const meta = pmap.get(r.to_profile_id)
      return {
        friendRequestId: r.friend_request_id,
        profileId: r.to_profile_id,
        displayName: meta?.displayName ?? null,
        avatarUrl: meta?.avatarUrl ?? null,
        avatarUpdatedAt: meta?.avatarUpdatedAt ?? null,
      }
    })

    loading.value = false
  }

  return {
    friends,
    incomingPending,
    outgoingPending,
    loading,
    error,
    refresh,
  }
}
