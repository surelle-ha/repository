import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { getCookie, setCookie, deleteCookie } from 'h3'

const COOKIE_NAME = 'repo_session'
const TOKEN_TTL   = '7d'

function getSecret(): Uint8Array {
  const config = useRuntimeConfig()
  if (!config.jwtSecret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(config.jwtSecret)
}

/** Sign a JWT and set it as an HttpOnly cookie on the response. */
export async function signAndSetSession(event: any, payload: Record<string, unknown>) {
  const secret = getSecret()
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret)

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/** Verify the session cookie. Returns the payload or null. */
export async function verifySession(event: any): Promise<JWTPayload | null> {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload
  } catch {
    return null
  }
}

/** Clear the session cookie. */
export function clearSession(event: any) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

/** Throw 401 if request has no valid session AND no valid API key. */
export async function requireAuth(event: any) {
  const config = useRuntimeConfig()

  // 1. Check API key header (for external/machine callers)
  const authHeader = getHeader(event, 'authorization') ?? ''
  const apiKey = authHeader.replace('Bearer ', '').trim()
  if (apiKey && apiKey === config.apiSecretKey) return

  // 2. Check session cookie (for admin panel)
  const session = await verifySession(event)
  if (session) return

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
