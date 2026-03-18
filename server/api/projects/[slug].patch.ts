import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  await requireAuth(event, config.apiSecretKey, config.jwtSecret)

  const slug = getRouterParam(event, 'slug')!
  const body = await readBody<{
    name?: string
    tagline?: string | null
    description?: string | null
    url?: string | null
    icon?: string | null
    tags?: string[]
    status?: 'live' | 'coming_soon' | 'wip' | 'archived'
    featured?: boolean
    sort_order?: number
  }>(event)

  const db = useDb()
  const [updated] = await db
    .update(projects)
    .set({ ...body, updated_at: new Date() })
    .where(eq(projects.slug, slug))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  return updated
})