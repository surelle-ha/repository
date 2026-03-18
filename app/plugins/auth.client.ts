/**
 * Runs once on the client after hydration.
 * Silently checks if the user has a valid session cookie
 * so all components can access useAuth().user reactively.
 */
export default defineNuxtPlugin(async () => {
  const { initialized, fetchUser } = useAuth()
  if (!initialized.value) {
    await fetchUser()
  }
})
