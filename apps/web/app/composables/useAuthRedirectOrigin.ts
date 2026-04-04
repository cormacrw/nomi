/**
 * Origin for Supabase magic-link redirects (`emailRedirectTo`).
 * - `NUXT_PUBLIC_SITE_URL` when set (staging / preview)
 * - dev server: current browser origin (usually localhost)
 * - production: https://nomisocial.xyz
 */
export function useAuthRedirectOrigin () {
  const config = useRuntimeConfig()
  const configured = (config.public.siteUrl || '').replace(/\/$/, '')
  if (configured) {
    return configured
  }
  if (import.meta.dev) {
    if (import.meta.client) {
      return window.location.origin
    }
    return 'http://localhost:3000'
  }
  return 'https://nomisocial.xyz'
}
