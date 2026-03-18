-- ============================================================
-- Repository — Neon Migration
-- Run this in your Neon SQL editor, or via: pnpm db:push
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. STATUS ENUM
-- ─────────────────────────────────────────────
do $$ begin
  create type project_status as enum ('live', 'coming_soon', 'wip', 'archived');
exception when duplicate_object then null;
end $$;

-- ─────────────────────────────────────────────
-- 2. PROJECTS TABLE
-- ─────────────────────────────────────────────
create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  tagline      text,
  description  text,
  url          text,
  icon         text,
  tags         text[]            default '{}',
  status       project_status    default 'live' not null,
  featured     boolean           default false not null,
  sort_order   integer           default 0 not null,
  created_at   timestamptz       default now() not null,
  updated_at   timestamptz       default now() not null
);

-- ─────────────────────────────────────────────
-- 3. AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at
  before update on projects
  for each row execute procedure set_updated_at();

-- ─────────────────────────────────────────────
-- 4. INDEXES
-- ─────────────────────────────────────────────
create index if not exists idx_projects_status     on projects(status);
create index if not exists idx_projects_featured   on projects(featured);
create index if not exists idx_projects_sort_order on projects(sort_order);

-- ─────────────────────────────────────────────
-- 5. SEED — sample data (safe to re-run)
-- ─────────────────────────────────────────────
insert into projects (slug, name, tagline, description, url, icon, tags, status, featured, sort_order)
values
  (
    'ghostly-ai',
    'Ghostly AI',
    'Desktop overlay powered by local AI.',
    'Reads your screen in real time — coaches interviews, explains code, summarises docs. Zero trace. Zero cloud. Zero compromise.',
    'https://ghostly.surelle.xyz',
    '👻',
    array['ai','desktop','local'],
    'coming_soon', true, 1
  ),
  (
    'prompter',
    'Prompter',
    'Browser extension for your AI prompts.',
    'Store your AI prompts and automatically paste them into ChatGPT, Gemini, and Claude — one click, any chat.',
    'https://prompter.surelle.xyz',
    '⚡',
    array['browser-extension','ai','productivity'],
    'coming_soon', true, 2
  ),
  (
    'repository',
    'Repository',
    'A curated index of all my projects.',
    'The very site you are on — a self-hosted CMS-backed project directory, powered by Neon + Nuxt.',
    'https://repository.surelle.xyz',
    '📦',
    array['nuxt','neon','cms'],
    'live', false, 3
  )
on conflict (slug) do nothing;
