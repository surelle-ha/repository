<template>
  <div class="flex flex-col gap-8">

    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p class="font-mono text-[11px] uppercase tracking-widest text-muted mb-1">CMS Dashboard</p>
        <h1 class="font-head font-extrabold text-ink text-3xl tracking-tighter">Projects</h1>
      </div>
      <button @click="openCreate"
              class="px-4 py-2 bg-accent text-bg font-head font-bold text-sm rounded-lg
                     hover:opacity-85 transition-opacity cursor-pointer">
        + New Project
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="s in stats" :key="s.label"
           class="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col gap-1">
        <span class="font-head font-extrabold text-ink text-3xl tracking-tighter">{{ s.value }}</span>
        <span class="font-mono text-[11px] uppercase tracking-widest text-muted">{{ s.label }}</span>
      </div>
    </div>

    <div class="bg-surface border border-border rounded-xl overflow-hidden">
      <div v-if="pending" class="flex flex-col gap-1.5 p-3">
        <div v-for="n in 4" :key="n" class="h-14 rounded-lg bg-surface2 animate-pulse" />
      </div>

      <template v-else-if="(projects ?? []).length > 0">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-surface2">
              <th v-for="h in ['Project','Status','Tags','Sort','★','Actions']" :key="h"
                  class="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest
                         text-muted border-b border-border last:text-right">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in projects" :key="p.id"
                class="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl select-none">{{ p.icon || '◆' }}</span>
                  <div>
                    <div class="text-sm font-medium text-ink">{{ p.name }}</div>
                    <div class="font-mono text-[11px] text-muted">{{ p.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-wide"
                      :class="{
                        'bg-green-500/15 text-green-400':   p.status === 'live',
                        'bg-yellow-400/10 text-yellow-400': p.status === 'coming_soon',
                        'bg-blue-300/10 text-blue-300':     p.status === 'wip',
                        'bg-white/5 text-muted':            p.status === 'archived',
                      }">{{ statusLabel(p.status) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="t in (p.tags ?? []).slice(0,3)" :key="t"
                        class="font-mono text-[10px] text-muted">#{{ t }}</span>
                  <span v-if="(p.tags?.length ?? 0) > 3"
                        class="font-mono text-[10px] text-muted">+{{ (p.tags?.length ?? 0) - 3 }}</span>
                </div>
              </td>
              <td class="px-4 py-3 font-mono text-sm text-ink2">{{ p.sort_order }}</td>
              <td class="px-4 py-3 text-base">
                <span :class="p.featured ? 'text-accent' : 'text-border'">★</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="openEdit(p)"
                          class="w-7 h-7 flex items-center justify-center rounded-md text-sm text-ink2
                                 bg-surface2 border border-border hover:text-ink hover:border-ink2
                                 transition-all cursor-pointer">✎</button>
                  <button @click="confirmDelete(p)"
                          class="w-7 h-7 flex items-center justify-center rounded-md text-sm text-ink2
                                 bg-surface2 border border-border hover:text-red-400 hover:border-red-400/40
                                 transition-all cursor-pointer">✕</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <div v-else class="py-12 text-center font-mono text-sm text-muted">
        No projects yet. Click "+ New Project" above.
      </div>
    </div>

    <ProjectFormModal
      v-if="showModal"
      :project="editingProject"
      @close="closeModal"
      @saved="onSaved"
    />

    <Teleport to="body">
      <div v-if="deletingProject"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
           @click.self="deletingProject = null">
        <div class="bg-surface border border-border rounded-2xl p-8 w-full max-w-sm">
          <h3 class="font-head font-bold text-ink text-xl mb-2">Delete "{{ deletingProject.name }}"?</h3>
          <p class="text-ink2 text-sm mb-6">This action cannot be undone.</p>
          <div class="flex justify-end gap-2.5">
            <button @click="deletingProject = null"
                    class="px-4 py-2 text-sm text-ink2 border border-border rounded-lg
                           hover:border-ink2 hover:text-ink transition-all cursor-pointer">Cancel</button>
            <button @click="doDelete" :disabled="deleteLoading"
                    class="px-4 py-2 text-sm font-semibold text-red-400 bg-red-400/15 border border-red-400/35
                           rounded-lg hover:bg-red-400/25 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all cursor-pointer">
              {{ deleteLoading ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../../server/db/schema'

definePageMeta({ middleware: 'auth' })

const { data: projects, pending, refresh } = await useFetch<ProjectRow[]>('/api/projects', {
  default: () => [],
})

const stats = computed(() => {
  const all = projects.value ?? []
  return [
    { label: 'Total',       value: all.length },
    { label: 'Live',        value: all.filter(p => p.status === 'live').length },
    { label: 'Coming Soon', value: all.filter(p => p.status === 'coming_soon').length },
    { label: 'Featured',    value: all.filter(p => p.featured).length },
  ]
})

const showModal      = ref(false)
const editingProject = ref<ProjectRow | null>(null)

function openCreate() {
  editingProject.value = null
  showModal.value      = true
}
function openEdit(p: ProjectRow) {
  editingProject.value = { ...p }
  showModal.value      = true
}
function closeModal() {
  showModal.value      = false
  editingProject.value = null
}
async function onSaved() {
  closeModal()
  await refresh()
}

const deletingProject = ref<ProjectRow | null>(null)
const deleteLoading   = ref(false)

function confirmDelete(p: ProjectRow) { deletingProject.value = p }

async function doDelete() {
  if (!deletingProject.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/projects/${deletingProject.value.slug}`, { method: 'DELETE' })
  } finally {
    deleteLoading.value   = false
    deletingProject.value = null
    await refresh()
  }
}

const statusLabels: Record<string, string> = {
  live: 'Live', coming_soon: 'Coming Soon', wip: 'WIP', archived: 'Archived',
}
function statusLabel(s: string) { return statusLabels[s] ?? s }
</script>