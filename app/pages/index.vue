<template>
  <div>
    <section class="py-16">
      <p class="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest mb-5">
        <span class="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#e2ff5d] animate-pulse" />
        {{ (projects ?? []).length }} projects indexed
      </p>

      <!-- Hero banner (configurable) -->
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
    </section>

    <!-- Status filters -->
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

    <!-- Project grid -->
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

    <!-- Fork / Deploy CTA — hidden when NUXT_PUBLIC_HIDE_ORIGIN_UI=true -->
    <div v-if="!hideOriginUi"
         class="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-start
                sm:items-center justify-between gap-4 flex-wrap">
      <p class="font-mono text-xs text-muted">Want your own project repository page?</p>
      <div class="flex items-center gap-2 flex-wrap">
        <a :href="vercelDeployUrl" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-black border border-white/20 font-mono text-xs text-white
                  hover:border-white/50 transition-all no-underline">
          <svg width="12" height="10" viewBox="0 0 76 65" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
          </svg>
          Deploy to Vercel
        </a>
        <a :href="forkUrl" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border
                  font-mono text-xs text-ink2 bg-surface hover:border-ink2 hover:text-ink
                  transition-all no-underline">
          <span>⑂</span> Fork on GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../server/db/schema'

const { settings } = useSiteSettings()
const config = useRuntimeConfig()

const hideOriginUi = computed(() => config.public.hideOriginUi)
const forkUrl      = computed(() => config.public.forkUrl || 'https://github.com/surelle-ha/repository')
const vercelDeployUrl = computed(() =>
  `https://vercel.com/new/clone?repository-url=${encodeURIComponent(forkUrl.value)}&env=DATABASE_URL,ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,API_SECRET_KEY,NUXT_PUBLIC_SITE_URL,NUXT_PUBLIC_SITE_OWNER&project-name=repository&repository-name=repository`
)

// Split banner into two visual lines for the accent treatment
const bannerLines = computed(() => {
  const text = settings.value.heroBanner || "Everything I've built."
  const words = text.split(' ')
  if (words.length <= 2) return [text]
  const midpoint = Math.ceil(words.length / 2)
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')]
})

const { data: projects, pending, error } = await useFetch<ProjectRow[]>('/api/projects', {
  default: () => [],
})

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