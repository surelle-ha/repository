export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const missing: string[] = []

  if (!config.databaseUrl)  missing.push('DATABASE_URL')
  if (!config.jwtSecret)    missing.push('JWT_SECRET')
  if (!config.adminEmail)   missing.push('ADMIN_EMAIL')
  if (!config.adminPassword) missing.push('ADMIN_PASSWORD')

  if (missing.length > 0) {
    return { ready: false, missing }
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
      error: 'Could not connect to the database. Check your DATABASE_URL.',
    }
  }

  return { ready: true, missing: [] }
})