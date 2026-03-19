<template>
  <div>
    <!-- Back -->
    <NuxtLink to="/"
      class="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink2
             transition-colors mb-10 no-underline">
      ← Back to index
    </NuxtLink>

    <div v-if="pending" class="flex flex-col gap-6 animate-pulse">
      <div class="h-64 rounded-2xl bg-surface border border-border" />
      <div class="h-8 w-1/2 rounded-lg bg-surface" />
      <div class="h-4 w-3/4 rounded bg-surface" />
    </div>

    <div v-else-if="!project" class="text-center py-32 font-mono text-sm text-muted">
      <span class="block text-4xl mb-4">○</span>
      Project not found.
    </div>

    <template v-else>

      <!-- Hero image placeholder -->
      <div class="relative w-full h-52 sm:h-72 rounded-2xl border border-border overflow-hidden mb-10 bg-surface">
        <div class="absolute inset-0"
             style="background-image:radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:24px 24px" />
        <div class="absolute inset-0"
             :style="`background: radial-gradient(ellipse at 30% 50%, ${accentColor}22 0%, transparent 70%),
                                  radial-gradient(ellipse at 80% 20%, ${accentColor}11 0%, transparent 60%)`" />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[6rem] leading-none select-none drop-shadow-lg" style="filter:drop-shadow(0 0 32px rgba(0,0,0,0.6))">
            {{ project.icon || '◆' }}
          </span>
        </div>
        <div class="absolute top-4 right-4">
          <span class="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md"
                :class="{
                  'bg-green-500/20 text-green-400 border border-green-500/30':   project.status === 'live',
                  'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30': project.status === 'coming_soon',
                  'bg-blue-300/15 text-blue-300 border border-blue-300/30':       project.status === 'wip',
                  'bg-white/5 text-muted border border-white/10':                 project.status === 'archived',
                }">{{ statusLabel }}</span>
        </div>
        <div v-if="project.featured"
             class="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    bg-accent/20 border border-accent/30 backdrop-blur-md">
          <span class="text-accent text-xs">★</span>
          <span class="font-mono text-[10px] text-accent uppercase tracking-widest">Featured</span>
        </div>
      </div>

      <!-- Title row -->
      <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 class="font-head font-extrabold text-ink text-4xl tracking-tighter leading-none mb-2">
            {{ project.name }}
          </h1>
          <p v-if="project.tagline" class="text-ink2 text-lg leading-snug">
            {{ project.tagline }}
          </p>
        </div>
        <a v-if="project.url" :href="project.url" target="_blank" rel="noopener"
           class="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-accent text-bg font-head font-bold text-sm
                  hover:opacity-85 transition-opacity no-underline">
          Visit project ↗
        </a>
      </div>

      <!-- Tags -->
      <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-8">
        <span v-for="tag in project.tags" :key="tag"
              class="font-mono text-[11px] text-muted bg-surface2 border border-border
                     px-2.5 py-1 rounded-full tracking-wide">
          #{{ tag }}
        </span>
      </div>

      <!-- Description -->
      <div v-if="project.description"
           class="bg-surface border border-border rounded-2xl p-7 mb-8">
        <p class="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">Overview</p>
        <p class="text-ink2 leading-relaxed text-[15px]">{{ project.description }}</p>
      </div>

      <!-- Meta grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div v-for="m in meta" :key="m.label"
             class="bg-surface border border-border rounded-xl px-4 py-3 flex flex-col gap-1">
          <span class="font-mono text-[10px] uppercase tracking-widest text-muted">{{ m.label }}</span>
          <span class="font-mono text-xs text-ink2 truncate">{{ m.value }}</span>
        </div>
      </div>

      <!-- URL bar -->
      <div v-if="project.url"
           class="flex items-center gap-3 bg-surface border border-border rounded-xl px-5 py-3 mb-10">
        <span class="font-mono text-[10px] text-muted uppercase tracking-widest shrink-0">URL</span>
        <a :href="project.url" target="_blank" rel="noopener"
           class="font-mono text-xs text-accent truncate hover:underline">
          {{ project.url }}
        </a>
      </div>

      <!-- Back -->
      <NuxtLink to="/"
        class="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink2
               transition-colors no-underline">
        ← Back to index
      </NuxtLink>

    </template>
  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../../server/db/schema'

const route = useRoute()
const slug  = route.params.slug as string

const config  = useRuntimeConfig()
const siteUrl = computed(() => (config.public.siteUrl as string || 'http://localhost:3000').replace(/\/$/, ''))

const { settings } = useSiteSettings()
const siteName = computed(() => settings.value.topbarTitle || 'Repository')

const { data: project, pending } = await useFetch<ProjectRow>(`/api/projects/${slug}`)

// ── SEO ──────────────────────────────────────────────────────────
const pageTitle = computed(() =>
  project.value ? `${project.value.name} — ${siteName.value}` : siteName.value
)
const pageDescription = computed(() =>
  project.value?.description || project.value?.tagline || `Check out ${project.value?.name} on ${siteName.value}.`
)
const canonicalUrl = computed(() => `${siteUrl.value}/projects/${slug}`)

useSeoMeta({
  title:              pageTitle.value,
  ogTitle:            pageTitle.value,
  description:        pageDescription.value,
  ogDescription:      pageDescription.value,
  ogUrl:              canonicalUrl.value,
  ogType:             'article',
  ogImage:            `${siteUrl.value}/og-default.png`,
  twitterCard:        'summary_large_image',
  twitterTitle:       pageTitle.value,
  twitterDescription: pageDescription.value,
  twitterImage:       `${siteUrl.value}/og-default.png`,
  robots:             'index,follow',
})

useHead({
  title: pageTitle.value,
  link:  [{ rel: 'canonical', href: canonicalUrl.value }],
  script: computed(() => project.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context':   'https://schema.org',
        '@type':      'SoftwareApplication',
        name:          project.value.name,
        description:   project.value.description || project.value.tagline || '',
        url:           project.value.url || canonicalUrl.value,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        keywords:      (project.value.tags || []).join(', '),
        dateModified:  new Date(project.value.updated_at).toISOString(),
        datePublished: new Date(project.value.created_at).toISOString(),
        isPartOf: {
          '@type': 'WebSite',
          name:    siteName.value,
          url:     siteUrl.value,
        },
      }),
    },
  ] : []),
})

// ── Display helpers ───────────────────────────────────────────────
const statusLabels: Record<string, string> = {
  live: 'Live', coming_soon: 'Coming Soon', wip: 'WIP', archived: 'Archived',
}
const statusLabel = computed(() => statusLabels[project.value?.status ?? ''] ?? project.value?.status ?? '')

const tagColours: Record<string, string> = {
  nuxt: '#00dc82', vue: '#42b883', react: '#61dafb', ai: '#e2ff5d',
  postgres: '#336791', node: '#8cc84b', typescript: '#3178c6', rust: '#ce422b',
  python: '#ffd343', go: '#00acd7', docker: '#2496ed', default: '#e2ff5d',
}
const accentColor = computed(() => {
  const firstTag = project.value?.tags?.[0] ?? 'default'
  return tagColours[firstTag] ?? tagColours.default
})

const meta = computed(() => {
  const p = project.value
  if (!p) return []
  return [
    { label: 'Status',   value: statusLabels[p.status] ?? p.status },
    { label: 'Tags',     value: p.tags?.length ? `${p.tags.length} tag${p.tags.length !== 1 ? 's' : ''}` : 'None' },
    { label: 'Featured', value: p.featured ? 'Yes' : 'No' },
    { label: 'Updated',  value: new Date(p.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  ]
})
</script>