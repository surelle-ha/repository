import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (getMethod(event) === 'OPTIONS') { setResponseStatus(event, 204); return null }

  const config = useRuntimeConfig()
  await requireAuth(event, config.apiSecretKey, config.jwtSecret)

  const body = await readBody<any>(event)
  if (!body?.name || !body?.slug) {
    throw createError({ statusCode: 422, statusMessage: 'name and slug are required' })
  }

  const shouldUpsert = body.upsert === true
  const { upsert: _u, id: _id, created_at: _c, updated_at: _ua, ...values } = body

  const db = useDb()

  if (shouldUpsert) {
    const [row] = await db
      .insert(projects)
      .values(values)
      .onConflictDoUpdate({ target: projects.slug, set: { ...values, updated_at: new Date() } })
      .returning()
    return { ok: true, data: row }
  }

  const [row] = await db.insert(projects).values(values).returning()
  setResponseStatus(event, 201)
  return { ok: true, data: row }
})