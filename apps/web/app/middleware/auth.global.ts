export default defineNuxtRouteMiddleware(async (to) => {
  const session = useSupabaseSession()
  const supabase = useSupabaseClient()

  if (!session.value) {
    clearProfileSetupCache()
    if (
      to.path === '/home'
      || to.path.startsWith('/home/')
      || to.path === '/onboarding/profile'
    ) {
      return navigateTo('/')
    }
    return
  }

  const uid = session.value.user?.id
  if (!uid) {
    return
  }

  if (to.path === '/onboarding/profile') {
    const complete = await getProfileSetupComplete(supabase, uid)
    if (complete) {
      return navigateTo('/home')
    }
  }

  if (to.path === '/home' || to.path.startsWith('/home/')) {
    const complete = await getProfileSetupComplete(supabase, uid)
    if (!complete) {
      return navigateTo('/onboarding/profile')
    }
  }

  if (
    to.path === '/'
    || to.path === '/onboarding/email'
    || to.path === '/onboarding/check-email'
    || to.path === '/dev/login'
  ) {
    return navigateTo('/home')
  }
})
