import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireExternalApiEnabled } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireExternalApiEnabled()

  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  const query = getQuery(event)
  const db = useDb()

  let builder = db.select().from(projects).orderBy(asc(projects.sort_order)).$dynamic()

  if (query.status) {
    builder = builder.where(eq(projects.status, query.status as any))
  }
  if (query.featured === 'true') {
    builder = builder.where(eq(projects.featured, true))
  }

  const rows = await builder

  return { ok: true, count: rows.length, data: rows }
})