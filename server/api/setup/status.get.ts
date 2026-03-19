export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const missing: string[] = []

  if (!config.databaseUrl)  missing.push('DATABASE_URL')
  if (!config.jwtSecret)    missing.push('JWT_SECRET')
  if (!config.adminEmail)   missing.push('ADMIN_EMAIL')
  if (!config.adminPassword) missing.push('ADMIN_PASSWORD')

  const optionalPresence: Record<string, boolean> = {
    NUXT_PUBLIC_SITE_URL:            !!(config.public.siteUrl && config.public.siteUrl !== 'http://localhost:3000'),
    NUXT_PUBLIC_GOOGLE_ANALYTICS_ID: !!(config.public.googleAnalyticsId),
    API_SECRET_KEY:                  !!(config.apiSecretKey),
  }

  if (missing.length > 0) {
    return { ready: false, missing, optionalPresence }
  }

  try {
    const { useDb } = await import('../../db/client')
    const { siteSettings } = await import('../../db/schema')
    const db = useDb()
    await db.select().from(siteSettings).limit(1)
  } catch (err: any) {
    return {
      ready: false,
      missing: ['DATABASE_URL'],
      optionalPresence,
      error: 'Could not connect to the database. Check your DATABASE_URL.',
    }
  }

  return { ready: true, missing: [], optionalPresence }
})