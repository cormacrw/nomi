/**
 * Origin for Supabase magic-link redirects (`emailRedirectTo`).
 * Prefer `runtimeConfig.public.siteUrl` (set in nuxt.config for prod builds).
 * Local dev without env: use the current origin.
 */
export function useAuthRedirectOrigin () {
  const config = useRuntimeConfig()
  const configured = (config.public.siteUrl || '').replace(/\/$/, '')
  if (configured) {
    return configured
  }
  if (import.meta.dev && import.meta.client) {
    return window.location.origin
  }
  if (import.meta.dev) {
    return 'http://localhost:3000'
  }
  return 'https://nomisocial.xyz'
}
