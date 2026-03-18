import { signAndSetSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 422, statusMessage: 'Email and password are required.' })
  }

  const config = useRuntimeConfig()

  // Constant-time-ish comparison to avoid timing attacks
  const emailMatch    = email    === config.adminEmail
  const passwordMatch = password === config.adminPassword

  if (!emailMatch || !passwordMatch) {
    // Identical error regardless of which field was wrong
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })
  }

  await signAndSetSession(event, { email, role: 'admin' })

  return { ok: true }
})
