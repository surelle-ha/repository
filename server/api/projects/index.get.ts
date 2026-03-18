import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

  const db = useDb()
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sort_order), asc(projects.created_at))

  return rows
})
