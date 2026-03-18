import { useDb } from '../../../db/client'
import { projects } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const db = useDb()
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  return { ok: true, data: row }
})
