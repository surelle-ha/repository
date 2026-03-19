export interface SiteSettings {
  siteOwner:          string
  topbarTitle:        string
  topbarDomain:       string
  heroBanner:         string
  heroSub:            string
  disableExternalApi: string  // 'true' | 'false'
  hideDocs:           string  // 'true' | 'false'
  hideOriginUi:       string  // 'true' | 'false'
  forkUrl:            string
}

const DEFAULTS: SiteSettings = {
  siteOwner:          'Developer',
  topbarTitle:        'repository',
  topbarDomain:       '',
  heroBanner:         "Everything I've built.",
  heroSub:            'A living catalogue of side projects, tools, and experiments.',
  disableExternalApi: 'false',
  hideDocs:           'false',
  hideOriginUi:       'false',
  forkUrl:            'https://github.com/surelle-ha/repository',
}

export function useSiteSettings() {
  const settings = useState<SiteSettings>('site:settings', () => ({ ...DEFAULTS }))

  async function fetchSettings() {
    try {
      const data = await $fetch<SiteSettings>('/api/settings')
      // Replace the entire settings object so all computed values react
      settings.value = { ...DEFAULTS, ...data }
    } catch {
      // Keep defaults silently on error
    }
  }

  // Computed boolean helpers — use these in templates instead of === 'true'
  const isDocsHidden   = computed(() => settings.value.hideDocs            === 'true')
  const isApiDisabled  = computed(() => settings.value.disableExternalApi  === 'true')
  const isOriginHidden = computed(() => settings.value.hideOriginUi        === 'true')

  return { settings, fetchSettings, isDocsHidden, isApiDisabled, isOriginHidden }
}