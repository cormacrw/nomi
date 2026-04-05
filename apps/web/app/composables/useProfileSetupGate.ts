type ProfileSetupCache = { uid: string | null, complete: boolean | null }

export function useProfileSetupCache () {
  return useState<ProfileSetupCache>(
    'profile-setup-complete-cache',
    () => ({ uid: null, complete: null }),
  )
}

export async function getProfileSetupComplete (
  client: ReturnType<typeof useSupabaseClient>,
  userId: string,
): Promise<boolean> {
  const cache = useProfileSetupCache()
  if (cache.value.uid === userId && cache.value.complete !== null) {
    return cache.value.complete
  }
  const { data, error } = await client
    .from('profiles')
    .select('has_completed_profile_setup')
    .eq('profile_id', userId)
    .maybeSingle()
  if (error || !data) {
    cache.value = { uid: userId, complete: false }
    return false
  }
  const complete = !!data.has_completed_profile_setup
  cache.value = { uid: userId, complete }
  return complete
}

export function markProfileSetupComplete (userId: string) {
  const cache = useProfileSetupCache()
  cache.value = { uid: userId, complete: true }
}

export function clearProfileSetupCache () {
  const cache = useProfileSetupCache()
  cache.value = { uid: null, complete: null }
}
