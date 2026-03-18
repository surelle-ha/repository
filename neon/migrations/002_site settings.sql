-- ============================================================
-- Migration 002 — site_settings table
-- Run in your Neon SQL editor or via: pnpm db:push
-- ============================================================

create table if not exists site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now() not null
);