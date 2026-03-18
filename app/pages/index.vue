<template>
  <div>
    <section class="py-16">
      <p class="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest mb-5">
        <span class="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#e2ff5d] animate-pulse" />
        {{ (projects ?? []).length }} projects indexed
      </p>
      <h1 class="font-head font-extrabold text-ink leading-none tracking-tighter mb-4"
          style="font-size: clamp(2.8rem, 7vw, 5.5rem)">
        Everything<br />
        <em class="not-italic text-accent">I've built.</em>
      </h1>
      <p class="text-ink2 text-base max-w-lg leading-relaxed">
        A living catalogue of side projects, tools, and experiments by Surelle.
      </p>
    </section>

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
  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../server/db/schema'

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