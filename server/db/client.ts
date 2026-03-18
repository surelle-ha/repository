import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Returns a Drizzle client connected to Neon.
 * Call this inside any server route / middleware.
 * Uses neon's HTTP driver — ideal for serverless/edge environments.
 */
export function useDb() {
  const config = useRuntimeConfig()

  if (!config.databaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DATABASE_URL is not configured.',
    })
  }

  const sql = neon(config.databaseUrl)
  return drizzle(sql, { schema })
}
