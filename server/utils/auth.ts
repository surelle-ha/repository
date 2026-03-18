import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { getCookie, setCookie, deleteCookie, getHeader, createError } from 'h3'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'repo_session'
const TOKEN_TTL   = '7d'

function getSecret(jwtSecret: string): Uint8Array {
  if (!jwtSecret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(jwtSecret)
}

export async function signAndSetSession(event: H3Event, payload: Record<string, unknown>, jwtSecret: string) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret(jwtSecret))

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function verifySession(event: H3Event, jwtSecret: string): Promise<JWTPayload | null> {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(jwtSecret))
    return payload
  } catch {
    return null
  }
}

export function clearSession(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export async function requireAuth(event: H3Event, apiSecretKey: string, jwtSecret: string) {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const apiKey = authHeader.replace('Bearer ', '').trim()
  if (apiKey && apiSecretKey && apiKey === apiSecretKey) return

  const session = await verifySession(event, jwtSecret)
  if (session) return

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}