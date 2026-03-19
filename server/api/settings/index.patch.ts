// PATH: server/api/settings/index.patch.ts
//
// Admin-only. Upserts any of the allowed setting keys into site_settings.

import { useDb } from '../../db/client'
import { siteSettings } from '../../db/schema'
import { requireAuth } from '../../utils/auth'

const ALLOWED_KEYS = [
  'siteOwner',
  'topbarTitle',
  'topbarDomain',
  'heroBanner',
  'heroSub',
  'disableExternalApi',
  'hideDocs',
  'hideOriginUi',
  'forkUrl',
] as const

type SettingKey = (typeof ALLOWED_KEYS)[number]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  await requireAuth(event, config.apiSecretKey, config.jwtSecret)

  const body = await readBody<Partial<Record<SettingKey, string>>>(event)
  const db = useDb()

  const results: Record<string, string> = {}

  for (const key of ALLOWED_KEYS) {
    if (body[key] === undefined) continue
    const value = String(body[key])

    await db
      .insert(siteSettings)
      .values({ key, value, updated_at: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updated_at: new Date() },
      })

    results[key] = value
  }

  return { ok: true, updated: results }
})