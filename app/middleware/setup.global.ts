// PATH: app/middleware/setup.global.ts
//
// Runs on every route navigation (global middleware).
// If the server isn't configured yet, redirects to /setup.
// Skips the check on /setup itself to avoid infinite redirect loops.

export default defineNuxtRouteMiddleware(async (to) => {
  // Never redirect when already on the setup page
  if (to.path === '/setup') return

  // Only run on server — client already has the app loaded by then
  if (import.meta.client) return

  try {
    const status = await $fetch<{ ready: boolean; missing: string[]; error?: string }>(
      '/api/setup/status'
    )
    if (!status.ready) {
      return navigateTo('/setup')
    }
  } catch {
    // If the status endpoint itself fails, redirect to setup
    return navigateTo('/setup')
  }
})