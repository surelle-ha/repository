import { verifySession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await verifySession(event, config.jwtSecret)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  return { ok: true, email: session.email, role: session.role }
})