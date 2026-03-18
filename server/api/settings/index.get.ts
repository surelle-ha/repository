/**
 * GET /api/settings
 * Returns public site-customisation settings.
 * Values come from the `site_settings` table when present;
 * otherwise fall back to the env-var defaults baked into runtimeConfig.
 */
import { useDb } from '../../db/client'
import { siteSettings } from '../../db/schema'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')

  const config = useRuntimeConfig()
  const db = useDb()

  const rows = await db.select().from(siteSettings)
  const map: Record<string, string> = {}
  for (const row of rows) {
    map[row.key] = row.value
  }

  return {
    siteOwner:    map['siteOwner']    ?? config.public.siteOwner,
    topbarTitle:  map['topbarTitle']  ?? config.public.topbarTitle,
    topbarDomain: map['topbarDomain'] ?? config.public.topbarDomain,
    heroBanner:   map['heroBanner']   ?? config.public.heroBanner,
    heroSub:      map['heroSub']      ?? config.public.heroSub,
  }
})