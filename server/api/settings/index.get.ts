// PATH: server/api/settings/index.get.ts
//
// Returns all site settings from the DB.
// Falls back to hardcoded defaults when a key has no DB row yet.
// No env vars — everything is managed via Admin > Settings.

import { useDb } from '../../db/client'
import { siteSettings } from '../../db/schema'

export const SETTING_DEFAULTS: Record<string, string> = {
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

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache')

  const db = useDb()
  const rows = await db.select().from(siteSettings)

  const map: Record<string, string> = {}
  for (const row of rows) {
    map[row.key] = row.value
  }

  // Merge DB values over defaults — DB always wins
  const result: Record<string, string> = {}
  for (const [key, defaultVal] of Object.entries(SETTING_DEFAULTS)) {
    result[key] = map[key] ?? defaultVal
  }

  return result
})