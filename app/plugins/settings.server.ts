export default defineNuxtPlugin(async () => {
  const { fetchSettings } = useSiteSettings()
  await fetchSettings()
})