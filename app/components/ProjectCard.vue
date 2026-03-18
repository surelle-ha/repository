<template>
  <NuxtLink :to="`/projects/${project.slug}`"
            class="relative flex flex-col gap-2.5 bg-surface border border-border rounded-xl p-5
                   transition-all duration-200 hover:-translate-y-0.5
                   hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-white/10
                   overflow-hidden no-underline cursor-pointer"
            :class="project.status === 'live' ? '!border-green-500/10' : ''">

    <!-- Featured glow ring -->
    <div v-if="project.featured"
         class="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(226,255,93,0.2)]" />

    <!-- Header row -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <span class="text-2xl leading-none select-none">{{ project.icon || '◆' }}</span>
        <h3 class="font-head font-bold text-ink text-[17px] leading-tight tracking-tight">
          {{ project.name }}
        </h3>
      </div>
      <!-- External link — stops propagation so it doesn't navigate to the detail page -->
      <a v-if="project.url" :href="project.url" target="_blank" rel="noopener"
         @click.stop.prevent="openExternal"
         class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-sm
                text-muted bg-surface2 border border-border hover:text-ink hover:border-ink2
                transition-all no-underline z-10">↗</a>
    </div>

    <!-- Status badge -->
    <div>
      <span class="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest"
            :class="{
              'bg-green-500/15 text-green-400':   project.status === 'live',
              'bg-yellow-400/10 text-yellow-400': project.status === 'coming_soon',
              'bg-blue-300/10 text-blue-300':     project.status === 'wip',
              'bg-white/5 text-muted':            project.status === 'archived',
            }">{{ statusLabel }}</span>
    </div>

    <!-- Description -->
    <p class="text-ink2 text-[13px] leading-relaxed flex-1 line-clamp-3">
      {{ project.description || project.tagline }}
    </p>

    <!-- Tags -->
    <div v-if="project.tags?.length" class="flex flex-wrap gap-1.5">
      <span v-for="tag in project.tags" :key="tag" class="font-mono text-[10px] text-muted tracking-wide">
        #{{ tag }}
      </span>
    </div>

    <!-- URL -->
    <div v-if="project.url" class="font-mono text-[11px] text-muted truncate">
      {{ project.url.replace(/^https?:\/\//, '') }}
    </div>

    <!-- "View details" hint -->
    <div class="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity
                font-mono text-[10px] text-muted pointer-events-none">
      View details →
    </div>

  </NuxtLink>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../server/db/schema'

const props = defineProps<{ project: ProjectRow }>()

const statusLabels: Record<string, string> = {
  live: 'Live', coming_soon: 'Coming Soon', wip: 'WIP', archived: 'Archived',
}
const statusLabel = computed(() => statusLabels[props.project.status] ?? props.project.status)

function openExternal() {
  if (props.project.url) window.open(props.project.url, '_blank', 'noopener')
}
</script>