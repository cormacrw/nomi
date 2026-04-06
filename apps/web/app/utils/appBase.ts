/** Single prefix for all in-app routes (marketing stays at `/`). */
export const APP_BASE = '/app' as const

/** `/home` → `/app/home`; leading slash normalized. */
export function appPath (path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${APP_BASE}${p}`
}
