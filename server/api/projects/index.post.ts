import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { requireAuth } from '../../utils/auth'
import type { ProjectInsert } from '../../db/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body = await readBody<ProjectInsert>(event)
  if (!body?.name || !body?.slug) {
    throw createError({ statusCode: 422, statusMessage: 'name and slug are required' })
  }

  const db = useDb()
  const [created] = await db.insert(projects).values(body).returning()

  setResponseStatus(event, 201)
  return created
})
