import { useDb } from '../db/client'
import { siteSettings } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

export function requireSameOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string || '').replace(/\/$/, '')

  // No Origin header = SSR server-side call or same-site navigation → allow
  if (!origin) return

  // Origin matches our site → allow
  if (siteUrl && origin === siteUrl) return

  // In development, also allow localhost origins
  if (
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1')
  ) return

  // Everything else → block
  throw createError({
    statusCode: 403,
    statusMessage: 'This endpoint is restricted to same-origin requests only. Use /api/v1/ for external access.',
  })
}

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
    // DB unreachable — fail open, keep API working
    disabled = false
  }

  // Throw OUTSIDE the try/catch so it propagates correctly
  if (disabled) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The external API is disabled on this instance.',
    })
  }
}