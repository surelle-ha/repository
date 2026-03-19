import { useDb } from '../db/client'
import { siteSettings } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

export function requireInternalToken(event: H3Event) {
  const config   = useRuntimeConfig()
  const secret   = config.jwtSecret as string
  const siteUrl  = (config.public.siteUrl as string || '').replace(/\/$/, '')

  // 1. Check internal token (SSR server-side calls)
  const token = getHeader(event, 'x-internal-token')
  if (secret && token === secret) return

  // 2. Check Referer (client-side browser fetch after hydration)
  const referer = getHeader(event, 'referer') || getHeader(event, 'referrer') || ''
  if (siteUrl && referer.startsWith(siteUrl)) return

  // 3. Allow localhost in development
  if (
    referer.startsWith('http://localhost') ||
    referer.startsWith('http://127.0.0.1')
  ) return

  // 4. Block everything else
  throw createError({
    statusCode: 403,
    statusMessage: 'This endpoint is for internal use only. Use /api/v1/ for external access.',
  })
}

// ── External API guard ───────────────────────────────────────────
// Blocks /api/v1/* when disableExternalApi = 'true' in DB.
// Managed from Admin > Settings — no env var needed.

export async function requireExternalApiEnabled() {
  let disabled = false

  try {
    const db = useDb()
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'disableExternalApi'))
      .limit(1)

    disabled = row?.value === 'true'
  } catch {
    disabled = false
  }

  if (disabled) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The external API is disabled on this instance.',
    })
  }
}