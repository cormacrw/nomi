export default defineNuxtRouteMiddleware((to) => {
  const session = useSupabaseSession()

  if (!session.value && to.path === '/home') {
    return navigateTo('/')
  }

  if (!session.value) {
    return
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
