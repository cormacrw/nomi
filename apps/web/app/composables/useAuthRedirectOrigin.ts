/**
 * Origin for Supabase magic-link redirects (`emailRedirectTo`).
 * In development, always use the app you are running (ignores NUXT_PUBLIC_SITE_URL so a
 * copied production .env does not send magic links to production).
 * In production builds, use `runtimeConfig.public.siteUrl` or the default prod host.
 */
export function useAuthRedirectOrigin () {
  const config = useRuntimeConfig()
  const configured = (config.public.siteUrl || '').replace(/\/$/, '')

  if (import.meta.dev) {
    if (import.meta.client) {
      return window.location.origin
    }
    return 'http://localhost:3000'
  }

  if (configured) {
    return configured
  }
  return 'https://nomisocial.xyz'
}
