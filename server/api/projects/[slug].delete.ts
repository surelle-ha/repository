import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const slug = getRouterParam(event, 'slug')!
  const db = useDb()

  await db.delete(projects).where(eq(projects.slug, slug))

  setResponseStatus(event, 204)
  return null
})
