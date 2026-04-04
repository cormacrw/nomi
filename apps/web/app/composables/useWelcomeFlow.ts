const WELCOME_LS = 'nomi_seen_welcome'

export function useWelcomeLocal () {
  const seen = useState('welcome_seen_local', () => false)

  if (import.meta.client) {
    seen.value = localStorage.getItem(WELCOME_LS) === '1'
  }

  function markSeen () {
    if (import.meta.client) {
      localStorage.setItem(WELCOME_LS, '1')
      seen.value = true
    }
  }

  return { seen, markSeen }
}

export async function syncWelcomeToProfile (
  client: ReturnType<typeof useSupabaseClient>,
  userId: string,
) {
  if (!import.meta.client || localStorage.getItem(WELCOME_LS) !== '1') {
    return
  }

  const { error } = await client
    .from('profiles')
    .update({ has_completed_welcome: true })
    .eq('profile_id', userId)

  if (error) {
    console.error('syncWelcomeToProfile', error)
  }
}
