// PATH: app/plugins/settings.server.ts
//
// Runs on the SERVER for every SSR request.
// Fetches fresh settings from the DB so pages are never stale.
// The result is hydrated to the client via useState.

export default defineNuxtPlugin(async () => {
  const { fetchSettings } = useSiteSettings()
  await fetchSettings()
})