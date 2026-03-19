<template>
  <div>

    <!-- ── Hero ─────────────────────────────────────────────────── -->
    <section class="relative overflow-hidden rounded-2xl mb-8 px-8 pt-8 pb-10">
      <div class="absolute inset-0 pointer-events-none">
        <BackgroundsColorBends
          class="w-full h-full"
          :colors="['#ff5c7a', '#8a5cff', '#00ffd1']"
          :rotation="30"
          :speed="0.2"
          :scale="1"
          :frequency="1"
          :warpStrength="1"
          :mouseInfluence="1.2"
          :parallax="0.5"
          :noise="0.1"
          transparent
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
      </div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5
                    bg-black/40 border border-white/15 backdrop-blur-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#e2ff5d] animate-pulse" />
          <span class="font-mono text-xs text-white/80 uppercase tracking-widest">
            {{ (projects ?? []).length }} projects indexed
          </span>
        </div>

        <h1 class="font-head font-extrabold text-ink leading-none tracking-tighter mb-4"
            style="font-size: clamp(2.8rem, 7vw, 5.5rem)">
          <template v-if="bannerLines.length > 1">
            {{ bannerLines[0] }}<br />
            <em class="not-italic text-accent">{{ bannerLines.slice(1).join(' ') }}</em>
          </template>
          <template v-else>
            <em class="not-italic text-accent">{{ bannerLines[0] }}</em>
          </template>
        </h1>

        <p class="text-ink2 text-base max-w-lg leading-relaxed">
          {{ settings.heroSub }}
        </p>
      </div>
    </section>

    <!-- ── Status filters ───────────────────────────────────────── -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs
                     border transition-all cursor-pointer"
              :class="activeFilter === f.value
                ? 'bg-accent text-bg border-accent font-semibold'
                : 'bg-surface text-ink2 border-border hover:border-ink2 hover:text-ink'">
        {{ f.label }}
        <span class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"
              :class="activeFilter === f.value ? 'bg-black/20' : 'bg-white/10'">
          {{ countFor(f.value) }}
        </span>
      </button>
    </div>

    <!-- ── Project grid ──────────────────────────────────────────── -->
    <div v-if="pending" class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      <div v-for="n in 6" :key="n" class="h-48 rounded-xl bg-surface border border-border animate-pulse" />
    </div>
    <div v-else-if="error" class="text-center py-20 font-mono text-sm text-muted">
      <span class="block text-3xl mb-3">⚠</span>Failed to load projects.
    </div>
    <div v-else-if="filtered.length === 0" class="text-center py-20 font-mono text-sm text-muted">
      <span class="block text-3xl mb-3">○</span>Nothing here yet.
    </div>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      <ProjectCard v-for="p in filtered" :key="p.id" :project="p" />
    </div>

    <!-- ── Fork / Deploy CTA — toast in lower right ─────────────── -->
    <ForkDeployToast
      v-if="!isOriginHidden"
      :fork-url="settings.forkUrl"
      :vercel-deploy-url="vercelDeployUrl"
    />

  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../server/db/schema'

const { settings, isOriginHidden } = useSiteSettings()
const config  = useRuntimeConfig()
const siteUrl = computed(() => (config.public.siteUrl as string || 'http://localhost:3000').replace(/\/$/, ''))

const vercelDeployUrl = computed(() =>
  `https://vercel.com/new/clone?repository-url=${encodeURIComponent(settings.value.forkUrl)}&env=DATABASE_URL,ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,API_SECRET_KEY,NUXT_PUBLIC_SITE_URL&project-name=repository&repository-name=repository`
)

const bannerLines = computed(() => {
  const text  = settings.value.heroBanner || "Everything I've built."
  const words = text.split(' ')
  if (words.length <= 2) return [text]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
})

const { data: projects, pending, error } = await useFetch<ProjectRow[]>('/api/projects', {
  default: () => [],
})

// ── SEO ──────────────────────────────────────────────────────────
const pageTitle       = computed(() => settings.value.topbarTitle || 'Repository')
const pageDescription = computed(() => settings.value.heroSub || 'A curated index of projects.')

useSeoMeta({
  title:              pageTitle.value,
  ogTitle:            pageTitle.value,
  description:        pageDescription.value,
  ogDescription:      pageDescription.value,
  ogUrl:              siteUrl.value,
  ogType:             'website',
  ogImage:            `${siteUrl.value}/og-default.png`,
  twitterCard:        'summary_large_image',
  twitterTitle:       pageTitle.value,
  twitterDescription: pageDescription.value,
  twitterImage:       `${siteUrl.value}/og-default.png`,
  robots:             'index,follow',
})

useHead({
  title: pageTitle.value,
  link:  [{ rel: 'canonical', href: siteUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'WebSite',
        name:        pageTitle.value,
        description: pageDescription.value,
        url:         siteUrl.value,
      }),
    },
  ],
})

// ── Filters & grid ────────────────────────────────────────────────
const filters = [
  { label: 'All',         value: 'all' },
  { label: 'Live',        value: 'live' },
  { label: 'Coming Soon', value: 'coming_soon' },
  { label: 'WIP',         value: 'wip' },
  { label: 'Archived',    value: 'archived' },
]
const activeFilter = ref('all')

const filtered = computed(() => {
  if (activeFilter.value === 'all') return projects.value ?? []
  return (projects.value ?? []).filter(p => p.status === activeFilter.value)
})

function countFor(filter: string) {
  if (filter === 'all') return projects.value?.length ?? 0
  return (projects.value ?? []).filter(p => p.status === filter).length
}
</script>