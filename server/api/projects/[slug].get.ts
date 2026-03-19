import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireInternalToken } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  requireInternalToken(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  setHeader(event, 'Cache-Control', 'no-store')

  const db = useDb()
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  return row
})