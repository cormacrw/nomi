/**
 * useSupabaseUser() can lag behind the session; auth.getUser() matches middleware.
 * Use this when comparing DB profile_id / FKs to the signed-in user.
 */
export function useResolvedAuthUserId () {
  const supabase = useSupabaseClient()
  const pluginUser = useSupabaseUser()

  const userId = ref<string | null>(null)

  watch(
    pluginUser,
    (u) => {
      if (u?.id) userId.value = u.id
    },
    { immediate: true },
  )

  function syncFromGetUser () {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) userId.value = user.id
    })
  }

  if (import.meta.client) {
    void syncFromGetUser()
  }

  onMounted(() => {
    void syncFromGetUser()
  })

  return { userId }
}

/** Compare profile UUIDs from PostgREST vs auth (case / formatting) */
export function sameProfileId (a: string | null | undefined, b: string | null | undefined) {
  if (a == null || b == null) return false
  return String(a).toLowerCase() === String(b).toLowerCase()
}
