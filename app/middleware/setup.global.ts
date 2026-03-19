export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/setup') return

  if (import.meta.client) return

  try {
    const status = await $fetch<{ ready: boolean; missing: string[]; error?: string }>(
      '/api/setup/status'
    )
    if (!status.ready) {
      return navigateTo('/setup')
    }
  } catch {
    return navigateTo('/setup')
  }
})