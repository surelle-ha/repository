import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const slug = getRouterParam(event, 'slug')!
  const body = await readBody(event)

  // Never allow updating slug or id via this route
  delete body.id
  delete body.created_at
  body.updated_at = new Date()

  const db = useDb()
  const [updated] = await db
    .update(projects)
    .set(body)
    .where(eq(projects.slug, slug))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  return updated
})
