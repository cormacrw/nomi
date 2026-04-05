function publicSiteUrl () {
  const raw = (process.env.NUXT_PUBLIC_SITE_URL || '').trim().replace(/\/$/, '')
  const prod = process.env.NODE_ENV === 'production'
  if (prod) {
    // Never ship localhost from a prod build (bad Vercel env copy/paste, etc.)
    if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) {
      return 'https://nomisocial.xyz'
    }
    return raw
  }
  return raw
}

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  runtimeConfig: {
    public: {
      siteUrl: publicSiteUrl(),
    },
  },
  routeRules: {
    '/auth/confirm': { ssr: false },
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
        },
      ],
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    types: false,
    // Long-lived session cookie for prototype (refresh still follows Supabase JWT settings)
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
})
