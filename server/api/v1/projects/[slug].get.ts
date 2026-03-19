import { useDb } from '../../../db/client'
import { projects } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { requireExternalApiEnabled } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireExternalApiEnabled()

  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const db = useDb()
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  return { ok: true, data: row }
})