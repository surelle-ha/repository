# Repository

A self-hosted, CMS-backed project directory built with **Nuxt 4**, **Drizzle ORM**, and **Neon Postgres**. Deploy it as your own personal or team project showcase — fully customisable via environment variables or the admin panel.

---

## Features

- **Project CMS** — create, edit, and delete projects through the `/admin` panel
- **Public API** — read-only JSON endpoints so other apps can consume your project list
- **Site customisation** — change the top-bar title, hero headline, sub-header, and owner name without touching code
- **Status filters** — live, coming soon, WIP, archived
- **Featured projects** — highlight selected entries
- **Docs page** — built-in `/docs` page showing visitors how to fetch your projects
- **Fork CTA** — optional banner for visitors who want their own instance (can be hidden)
- **Vercel-ready** — one-click deployment

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/surelle-ha/repository.git
cd repository
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values (see [Environment Variables](#environment-variables) below).

### 3. Run the database migration

Open your [Neon](https://neon.tech) project's SQL editor and run:

```sql
-- Initial schema
-- (contents of neon/migrations/001_initial.sql)

-- Site settings table
-- (contents of neon/migrations/002_site_settings.sql)
```

Or push via Drizzle:

```bash
npm run db:push
```

### 4. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

Sign in at `/admin/login` using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | Neon Postgres connection string |
| `ADMIN_EMAIL` | ✅ | — | Admin login email |
| `ADMIN_PASSWORD` | ✅ | — | Admin login password |
| `JWT_SECRET` | ✅ | — | Secret for signing session JWTs (`openssl rand -hex 32`) |
| `API_SECRET_KEY` | ✅ | — | Bearer token for the external push API |
| `NUXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` | Canonical URL of your deployment |
| `NUXT_PUBLIC_SITE_OWNER` | — | `Developer` | Your name — shown in footer and sub-header |
| `NUXT_PUBLIC_TOPBAR_TITLE` | — | `repository` | Brand label in the top navigation bar |
| `NUXT_PUBLIC_TOPBAR_DOMAIN` | — | _(empty)_ | Optional domain suffix shown after the title (e.g. `.your-domain.com`) |
| `NUXT_PUBLIC_HERO_BANNER` | — | `Everything I've built.` | Large headline on the index page |
| `NUXT_PUBLIC_HERO_SUB` | — | `A living catalogue…` | Sub-text below the headline |
| `NUXT_PUBLIC_HIDE_ORIGIN_UI` | — | `false` | Set to `true` to hide the "Fork this project" button |
| `NUXT_PUBLIC_FORK_URL` | — | GitHub repo URL | URL the fork button links to |

> All `NUXT_PUBLIC_*` values can also be changed at runtime through **Admin → Settings** without redeploying.

---

## Deploying to Vercel

### Option A — Vercel dashboard (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add all required environment variables in the **Environment Variables** section.
4. Click **Deploy**.

The included `vercel.json` pre-configures the build command, output directory, and Singapore region (`sin1`). Change the `regions` value to one closer to your Neon database for lower latency.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and set your environment variables when asked, or add them later via `vercel env add`.

---

## API Reference

### `GET /api/projects`

Returns all projects ordered by `sort_order`. Public — no authentication required.

```bash
curl https://your-domain.com/api/projects
```

### `GET /api/projects/:slug`

Returns a single project by slug. Returns `404` if not found.

### `POST /api/v1/projects`

Authenticated endpoint for external services to push project data.

```bash
curl -X POST https://your-domain.com/api/v1/projects \
  -H "Authorization: Bearer YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug":"my-app","name":"My App","status":"live","upsert":true}'
```

Set `"upsert": true` to update an existing project (matched by `slug`) instead of erroring on conflict.

Full API documentation is available at `/docs` on your deployed instance.

---

## Admin Panel

Visit `/admin` (redirects to `/admin/login` if unauthenticated).

| Section | Description |
|---|---|
| **Projects** | Create, edit, delete projects. Toggle featured status and sort order. |
| **Settings** | Change the site owner name, top-bar title, domain suffix, hero headline, and sub-header — all saved to the database instantly. |

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run db:push      # Push Drizzle schema to Neon
npm run db:generate  # Generate Drizzle migration files
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

---

## Tech Stack

- [Nuxt 4](https://nuxt.com) — full-stack Vue framework
- [Drizzle ORM](https://orm.drizzle.team) — type-safe database toolkit
- [Neon](https://neon.tech) — serverless Postgres
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [jose](https://github.com/panva/jose) — JWT authentication

---

## License

MIT