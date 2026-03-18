import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (getMethod(event) === 'OPTIONS') { setResponseStatus(event, 204); return null }

  await requireAuth(event)

  const body = await readBody<any>(event)
  if (!body?.name || !body?.slug) {
    throw createError({ statusCode: 422, statusMessage: 'name and slug are required' })
  }

  const shouldUpsert = body.upsert === true
  delete body.upsert

  const db = useDb()

  if (shouldUpsert) {
    const [row] = await db
      .insert(projects)
      .values(body)
      .onConflictDoUpdate({ target: projects.slug, set: { ...body, updated_at: new Date() } })
      .returning()
    return { ok: true, data: row }
  }

  const [row] = await db.insert(projects).values(body).returning()
  setResponseStatus(event, 201)
  return { ok: true, data: row }
})
