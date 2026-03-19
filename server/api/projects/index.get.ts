import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { asc } from 'drizzle-orm'
import { requireInternalToken } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  requireInternalToken(event)

  setHeader(event, 'Cache-Control', 'no-store')

  const db = useDb()
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sort_order), asc(projects.created_at))

  return rows
})