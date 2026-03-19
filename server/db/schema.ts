// PATH: server/db/schema.ts

import {
  pgTable, pgEnum,
  uuid, text, boolean, integer, timestamp,
} from 'drizzle-orm/pg-core'

// ── Status enum ──────────────────────────────────────────────────
export const projectStatusEnum = pgEnum('project_status', [
  'live', 'coming_soon', 'wip', 'archived',
])

// ── Projects ─────────────────────────────────────────────────────
export const projects = pgTable('projects', {
  id:          uuid('id').primaryKey().defaultRandom(),
  slug:        text('slug').unique().notNull(),
  name:        text('name').notNull(),
  tagline:     text('tagline'),
  description: text('description'),
  url:         text('url'),
  icon:        text('icon'),
  tags:        text('tags').array().default([]),
  status:      projectStatusEnum('status').default('live').notNull(),
  featured:    boolean('featured').default(false).notNull(),
  sort_order:  integer('sort_order').default(0).notNull(),
  created_at:  timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at:  timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ProjectRow    = typeof projects.$inferSelect
export type ProjectInsert = typeof projects.$inferInsert

// ── Site settings ────────────────────────────────────────────────
// All keys stored as text. Boolean settings use 'true' / 'false' strings.
//
// Supported keys:
//   siteOwner          — display name in footer (default: 'Developer')
//   topbarTitle        — brand label in nav     (default: 'repository')
//   topbarDomain       — suffix after title     (default: '')
//   heroBanner         — index page headline    (default: "Everything I've built.")
//   heroSub            — index page sub-text    (default: 'A living catalogue...')
//   disableExternalApi — block /api/v1/*        (default: 'false')
//   hideDocs           — hide /docs page        (default: 'false')
//   hideOriginUi       — hide fork/deploy CTA   (default: 'false')
//   forkUrl            — fork button URL        (default: GitHub repo URL)

export const siteSettings = pgTable('site_settings', {
  key:        text('key').primaryKey(),
  value:      text('value').notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type SiteSettingRow = typeof siteSettings.$inferSelect