import { signAndSetSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 422, statusMessage: 'Email and password are required.' })
  }

  const config = useRuntimeConfig()

  if (email !== config.adminEmail || password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })
  }

  await signAndSetSession(event, { email, role: 'admin' }, config.jwtSecret)

  return { ok: true }
})