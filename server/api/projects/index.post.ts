import { useDb } from '../../db/client'
import { projects } from '../../db/schema'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  await requireAuth(event, config.apiSecretKey, config.jwtSecret)

  const body = await readBody<{
    slug:         string
    name:         string
    tagline?:     string | null
    description?: string | null
    url?:         string | null
    icon?:        string | null
    tags?:        string[]
    status?:      'live' | 'coming_soon' | 'wip' | 'archived'
    featured?:    boolean
    sort_order?:  number
  }>(event)

  if (!body?.name || !body?.slug) {
    throw createError({ statusCode: 422, statusMessage: 'name and slug are required' })
  }

  const db = useDb()
  const [created] = await db
    .insert(projects)
    .values({
      slug:        body.slug,
      name:        body.name,
      tagline:     body.tagline     ?? null,
      description: body.description ?? null,
      url:         body.url         ?? null,
      icon:        body.icon        ?? null,
      tags:        body.tags        ?? [],
      status:      body.status      ?? 'live',
      featured:    body.featured    ?? false,
      sort_order:  body.sort_order  ?? 0,
    })
    .returning()

  setResponseStatus(event, 201)
  return created
})