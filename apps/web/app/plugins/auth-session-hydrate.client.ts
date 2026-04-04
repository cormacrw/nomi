export default defineNuxtPlugin({
  name: 'auth-session-hydrate',
  dependsOn: ['supabase'],
  async setup () {
    const supabase = useSupabaseClient()
    // Ensures magic-link / PKCE tokens in the URL are applied before route middleware runs
    await supabase.auth.getSession()
  },
})
