export interface SiteSettings {
  siteOwner:    string
  topbarTitle:  string
  topbarDomain: string
  heroBanner:   string
  heroSub:      string
}

const DEFAULT: SiteSettings = {
  siteOwner:    'Developer',
  topbarTitle:  'repository',
  topbarDomain: '',
  heroBanner:   "Everything I've built.",
  heroSub:      'A living catalogue of side projects, tools, and experiments.',
}

export function useSiteSettings() {
  // useState so all components share the same reactive object
  const settings = useState<SiteSettings>('site:settings', () => ({ ...DEFAULT }))

  async function fetchSettings() {
    try {
      const data = await $fetch<SiteSettings>('/api/settings')
      Object.assign(settings.value, data)
    } catch {
      // keep defaults on error
    }
  }

  return { settings, fetchSettings }
}