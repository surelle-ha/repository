export interface SeoOptions {
  title?: string
  description?: string
  image?: string        // absolute URL to OG image
  url?: string          // canonical URL
  type?: 'website' | 'article'
  noindex?: boolean
}

export function useSeo(options: SeoOptions = {}) {
  const config   = useRuntimeConfig()
  const siteUrl  = (config.public.siteUrl as string || 'http://localhost:3000').replace(/\/$/, '')
  const { settings } = useSiteSettings()

  const siteName = computed(() => settings.value.topbarTitle || 'Repository')

  const title       = computed(() => options.title ? `${options.title} — ${siteName.value}` : siteName.value)
  const description = computed(() => options.description || settings.value.heroSub || 'A curated index of projects.')
  const image       = computed(() => options.image || `${siteUrl}/og-default.png`)
  const canonical   = computed(() => options.url   || siteUrl)
  const type        = options.type || 'website'

  useHead({
    title: title.value,
    link: [
      { rel: 'canonical', href: canonical.value },
    ],
    meta: [
      // ── Core ────────────────────────────────────────────────────
      { name: 'description',        content: description.value },
      { name: 'robots',             content: options.noindex ? 'noindex,nofollow' : 'index,follow' },

      // ── Open Graph ───────────────────────────────────────────────
      { property: 'og:site_name',   content: siteName.value },
      { property: 'og:type',        content: type },
      { property: 'og:title',       content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image',       content: image.value },
      { property: 'og:url',         content: canonical.value },

      // ── Twitter / X card ────────────────────────────────────────
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:image',       content: image.value },
    ],
  })
}