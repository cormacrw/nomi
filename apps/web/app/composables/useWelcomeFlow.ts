export async function syncWelcomeToProfile (
  client: ReturnType<typeof useSupabaseClient>,
  userId: string,
) {
  if (!import.meta.client) {
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
