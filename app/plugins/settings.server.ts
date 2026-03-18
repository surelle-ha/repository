/**
 * Fetches site settings on the server during SSR so pages receive
 * personalised content without a client-side flash.
 */
export default defineNuxtPlugin(async () => {
  const { fetchSettings } = useSiteSettings()
  await fetchSettings()
})