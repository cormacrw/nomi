import { appPath } from '~/utils/appBase'

/**
 * Full URL for Supabase magic-link `emailRedirectTo` (must match Supabase redirect allowlist).
 */
export function useAuthConfirmUrl () {
  const origin = useAuthRedirectOrigin()
  return `${origin}${appPath('/auth/confirm')}`
}
