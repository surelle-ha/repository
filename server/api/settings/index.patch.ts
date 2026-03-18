/**
 * PATCH /api/settings
 * Updates one or more site-customisation settings.
 * Requires admin authentication.
 */
import { useDb } from '../../db/client'
import { siteSettings } from '../../db/schema'
import { requireAuth } from '../../utils/auth'
import { eq } from 'drizzle-orm'

const ALLOWED_KEYS = ['siteOwner', 'topbarTitle', 'topbarDomain', 'heroBanner', 'heroSub'] as const
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

    // upsert
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