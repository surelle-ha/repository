# Repository

> A self-hosted, open-source project directory with a built-in CMS, public API, and live admin panel. Built with Nuxt 4, Drizzle ORM, and Neon Postgres. Deploy to Vercel in one click.

---

## Features

- **Project CMS** — create, edit, delete, and sort projects from `/admin`
- **Project detail pages** — each project gets its own page with a stylised hero, overview, tags, and metadata
- **Public external API** — `GET /api/v1/projects` and `GET /api/v1/projects/:slug` for external consumers, toggleable from the admin panel
- **Protected internal API** — `/api/projects` is restricted to same-origin requests only; external clients must use `/api/v1/`
- **Live admin settings** — change site name, hero text, topbar title, and visibility toggles without redeploying
- **Visibility controls** — disable the external API, hide the docs page, and hide the fork/deploy CTAs all from the admin panel
- **Status filters** — live, coming soon, WIP, archived
- **Featured projects** — pin selected entries to the top
- **Docs page** — built-in `/docs` page with full API reference for external consumers
- **Setup wizard** — if required environment variables are missing, the app redirects to a guided setup page
- **One-click Vercel deploy** — includes `vercel.json` and a deploy button that pre-fills required env vars
- **Smooth UX** — minimalist scrollbar, page transition animations, dark design system built with Tailwind CSS

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/surelle-ha/repository.git
cd repository
pnpm install   # or npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the five required values. Everything else is configured from the admin panel at runtime.

### 3. Set up the database

Open your [Neon](https://neon.tech) SQL editor and run both migration files in order:

```
neon/migrations/001_initial.sql
neon/migrations/002_site_settings.sql
```

Or push via Drizzle:

```bash
pnpm db:push
```

### 4. Start the dev server

```bash
pnpm dev
# → http://localhost:3000
```

Sign in at `/admin/login` using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set.

---

## Environment Variables

Only five variables are required. Everything else — site name, hero text, visibility toggles — is managed from **Admin → Settings** and stored in the database.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon Postgres connection string |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `JWT_SECRET` | ✅ | Secret for signing session cookies (`openssl rand -hex 32`) |
| `API_SECRET_KEY` | ✅ | Bearer token for `POST /api/v1/projects` |
| `NUXT_PUBLIC_SITE_URL` | — | Canonical URL of your deployment (default: `http://localhost:3000`) |

---

## Deploying to Vercel

### Option A — One-click deploy

Click the **Deploy to Vercel** button on the live site or docs page. It pre-fills all required environment variable names so you just need to paste in your values.

### Option B — Vercel dashboard

1. Push your fork to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add the five required environment variables.
4. Click **Deploy**.

The included `vercel.json` targets the `sin1` (Singapore) region. Change `regions` to whichever is closest to your Neon database.

### Option C — Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## API Reference

### Internal API — same-origin only

These routes are used by the site's own frontend. Requests from external clients are blocked with `403`.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | None (same-origin) | All projects, ordered by sort order |
| `GET` | `/api/projects/:slug` | None (same-origin) | Single project by slug |
| `POST` | `/api/projects` | Admin session | Create a project |
| `PATCH` | `/api/projects/:slug` | Admin session | Update a project |
| `DELETE` | `/api/projects/:slug` | Admin session | Delete a project |

### External API — public, toggleable

These routes are intended for external apps and services. They can be disabled from **Admin → Settings** without redeploying.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/projects` | None | All projects (supports `?status=` and `?featured=true`) |
| `GET` | `/api/v1/projects/:slug` | None | Single project by slug |
| `POST` | `/api/v1/projects` | Bearer token | Push or upsert a project from an external service |

#### Push a project from an external service

```bash
curl -X POST https://your-domain.com/api/v1/projects \
  -H "Authorization: Bearer YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug":   "my-app",
    "name":   "My App",
    "status": "live",
    "upsert": true
  }'
```

Set `"upsert": true` to update an existing project by slug instead of erroring on conflict.

Full interactive API docs are available at `/docs` on your deployed instance.

---

## Admin Panel

Visit `/admin` — redirects to `/admin/login` if not authenticated.

| Section | What you can do |
|---|---|
| **Projects** | Create, edit, delete projects. Set status, tags, sort order, featured flag. |
| **Settings → Display** | Site owner name, topbar title, domain suffix, hero headline, sub-header, fork URL. |
| **Settings → Visibility** | Toggle external API on/off, show/hide the docs page, show/hide fork/deploy buttons. All changes are instant — no redeploy needed. |

---

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm db:push      # Push Drizzle schema to Neon
pnpm db:generate  # Generate Drizzle migration files
pnpm db:studio    # Open Drizzle Studio (visual DB GUI)
```

---

## Tech Stack

| | |
|---|---|
| [Nuxt 4](https://nuxt.com) | Full-stack Vue framework with SSR and file-based routing |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe SQL query builder |
| [Neon](https://neon.tech) | Serverless Postgres with HTTP driver |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [jose](https://github.com/panva/jose) | Lightweight JWT for admin session auth |

---

## Todo

- [ ] Add missing `vercel.json` file for Vercel deployment.
- [ ] Add `Custom CSS textbox` for custom UI on admin page.
- [ ] Add `Accent color selection` on admin page. 
- [ ] Add `Dockerfile`.
- [ ] Add `GitHub/GitLab Repository` field on admin page.
- [ ] Add `Rate Limit` for external API.
- [ ] Add `CORS` for external API.
- [ ] Change `docs` page to use `cURL` instead of Nuxt's fetch.

---

## License

MIT