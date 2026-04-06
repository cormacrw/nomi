import { appPath } from '~/utils/appBase'

export default defineNuxtRouteMiddleware(async (to) => {
  const session = useSupabaseSession()
  const supabase = useSupabaseClient()

  const home = appPath('/home')
  const onboardingProfile = appPath('/onboarding/profile')
  const onboardingEmail = appPath('/onboarding/email')
  const onboardingCheckEmail = appPath('/onboarding/check-email')
  const devLogin = appPath('/dev/login')

  if (to.path === '/app' || to.path === '/app/') {
    if (!session.value) {
      return navigateTo(onboardingEmail)
    }
    const uid = session.value.user?.id
    if (!uid) {
      return navigateTo(onboardingEmail)
    }
    const complete = await getProfileSetupComplete(supabase, uid)
    return navigateTo(complete ? home : onboardingProfile)
  }

  if (!session.value) {
    clearProfileSetupCache()
    if (
      to.path === home
      || to.path.startsWith(`${home}/`)
      || to.path === onboardingProfile
    ) {
      return navigateTo('/')
    }
    return
  }

  const uid = session.value.user?.id
  if (!uid) {
    return
  }

  if (to.path === onboardingProfile) {
    const complete = await getProfileSetupComplete(supabase, uid)
    if (complete) {
      return navigateTo(home)
    }
  }

  if (to.path === home || to.path.startsWith(`${home}/`)) {
    const complete = await getProfileSetupComplete(supabase, uid)
    if (!complete) {
      return navigateTo(onboardingProfile)
    }
  }

  if (
    to.path === '/'
    || to.path === onboardingEmail
    || to.path === onboardingCheckEmail
    || to.path === devLogin
  ) {
    return navigateTo(home)
  }
})
