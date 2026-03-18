import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (getMethod(event) === 'OPTIONS') { setResponseStatus(event, 204); return null }

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
