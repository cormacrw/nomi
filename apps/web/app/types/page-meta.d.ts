import 'nuxt/schema'

declare module 'nuxt/schema' {
  interface PageMeta {
    /** When using `layout: 'app'`, set `'none'` to hide desktop header + mobile tab bar (e.g. composer, add-friend flow). */
    appShell?: 'full' | 'none'
  }
}

export {}
