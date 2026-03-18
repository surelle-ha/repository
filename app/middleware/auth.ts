/**
 * Protects /admin/* pages (except /admin/login).
 * Calls /api/auth/me to verify the session cookie server-side.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  // On the server we check the cookie directly via the API
  // On the client the plugin has already populated useAuth().user
  if (import.meta.server) {
    try {
      await $fetch('/api/auth/me')
    } catch {
      return navigateTo('/admin/login')
    }
  } else {
    const { user, initialized, fetchUser } = useAuth()
    if (!initialized.value) await fetchUser()
    if (!user.value) return navigateTo('/admin/login')
  }
})
