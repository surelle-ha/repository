import { pgTable, uuid, text, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('project_status', ['live', 'coming_soon', 'wip', 'archived'])

export const projects = pgTable('projects', {
  id:          uuid('id').primaryKey().defaultRandom(),
  slug:        text('slug').unique().notNull(),
  name:        text('name').notNull(),
  tagline:     text('tagline'),
  description: text('description'),
  url:         text('url'),
  icon:        text('icon'),
  tags:        text('tags').array().default([]),
  status:      statusEnum('status').default('live').notNull(),
  featured:    boolean('featured').default(false).notNull(),
  sort_order:  integer('sort_order').default(0).notNull(),
  created_at:  timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at:  timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ProjectRow    = typeof projects.$inferSelect
export type ProjectInsert = typeof projects.$inferInsert
