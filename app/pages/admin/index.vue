<template>
  <div class="flex flex-col gap-8">

    <!-- Page header -->
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p class="font-mono text-[11px] uppercase tracking-widest text-muted mb-1">CMS Dashboard</p>
        <h1 class="font-head font-extrabold text-ink text-3xl tracking-tighter">Admin</h1>
      </div>
      <button v-if="activeTab === 'projects'" @click="openCreate"
              class="px-4 py-2 bg-accent text-bg font-head font-bold text-sm rounded-lg
                     hover:opacity-85 transition-opacity cursor-pointer">
        + New Project
      </button>
    </div>

    <!-- Tab bar -->
    <div class="flex gap-1 border-b border-border">
      <button v-for="tab in tabs" :key="tab.value"
              @click="activeTab = tab.value"
              class="px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              :class="activeTab === tab.value
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-muted hover:text-ink2'">
        {{ tab.label }}
      </button>
    </div>

    <!-- ── PROJECTS TAB ─────────────────────────────────── -->
    <template v-if="activeTab === 'projects'">
      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="s in stats" :key="s.label"
             class="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col gap-1">
          <span class="font-head font-extrabold text-ink text-3xl tracking-tighter">{{ s.value }}</span>
          <span class="font-mono text-[11px] uppercase tracking-widest text-muted">{{ s.label }}</span>
        </div>
      </div>

      <!-- Table -->
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
    </template>

    <!-- ── SETTINGS TAB ─────────────────────────────────── -->
    <template v-else-if="activeTab === 'settings'">
      <div class="bg-surface border border-border rounded-2xl p-8 max-w-2xl flex flex-col gap-6">
        <div>
          <h2 class="font-head font-bold text-ink text-xl tracking-tight mb-1">Site Settings</h2>
          <p class="font-mono text-xs text-muted">Changes are saved to the database and take effect immediately.</p>
        </div>

        <div class="flex flex-col gap-5">
          <!-- Site owner / name -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Site Owner Name
            </label>
            <input v-model="settingsForm.siteOwner" placeholder="Developer"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            <p class="font-mono text-[10px] text-muted">Shown in the footer and hero sub-text.</p>
          </div>

          <!-- Top-bar title -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Top-bar Title
            </label>
            <input v-model="settingsForm.topbarTitle" placeholder="repository"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
          </div>

          <!-- Top-bar domain suffix -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Top-bar Domain Suffix
            </label>
            <input v-model="settingsForm.topbarDomain" placeholder=".your-domain.com"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            <p class="font-mono text-[10px] text-muted">Displayed in muted colour after the title. Leave blank to hide.</p>
          </div>

          <!-- Hero banner -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Hero Banner Headline
            </label>
            <input v-model="settingsForm.heroBanner" placeholder="Everything I've built."
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            <p class="font-mono text-[10px] text-muted">Large headline on the index page. The second half is highlighted.</p>
          </div>

          <!-- Hero sub-header -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Hero Sub-header
            </label>
            <textarea v-model="settingsForm.heroSub" rows="2"
                      placeholder="A living catalogue of side projects, tools, and experiments."
                      class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                             font-sans placeholder:text-muted outline-none focus:border-accent transition-colors resize-none" />
          </div>
        </div>

        <p v-if="settingsSaveMsg"
           class="font-mono text-xs px-3 py-2 rounded-md border"
           :class="settingsSaveError
             ? 'text-red-400 bg-red-400/10 border-red-400/25'
             : 'text-green-400 bg-green-400/10 border-green-400/25'">
          {{ settingsSaveMsg }}
        </p>

        <div class="flex justify-end">
          <button @click="saveSettings" :disabled="settingsLoading"
                  class="px-5 py-2 bg-accent text-bg font-head font-bold text-sm rounded-lg
                         flex items-center gap-2 hover:opacity-85 transition-opacity
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <span v-if="settingsLoading"
                  class="w-3.5 h-3.5 border-2 border-bg/25 border-t-bg rounded-full animate-spin" />
            <span v-else>Save Settings</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Project form modal -->
    <ProjectFormModal
      v-if="showModal"
      :project="editingProject"
      @close="closeModal"
      @saved="onSaved"
    />

    <!-- Delete confirm -->
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
import type { SiteSettings } from '../../composables/useSiteSettings'

definePageMeta({ middleware: 'auth' })

// ── Tab state ──────────────────────────────────────────────────────
const tabs = [
  { label: 'Projects', value: 'projects' },
  { label: 'Settings', value: 'settings' },
]
const activeTab = ref<'projects' | 'settings'>('projects')

// ── Projects ───────────────────────────────────────────────────────
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

function openCreate() { editingProject.value = null; showModal.value = true }
function openEdit(p: ProjectRow) { editingProject.value = { ...p }; showModal.value = true }
function closeModal() { showModal.value = false; editingProject.value = null }
async function onSaved() { closeModal(); await refresh() }

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

// ── Settings ───────────────────────────────────────────────────────
const { settings, fetchSettings } = useSiteSettings()

const settingsForm = reactive<SiteSettings>({
  siteOwner:    settings.value.siteOwner,
  topbarTitle:  settings.value.topbarTitle,
  topbarDomain: settings.value.topbarDomain,
  heroBanner:   settings.value.heroBanner,
  heroSub:      settings.value.heroSub,
})

// Keep form in sync when settings tab is opened
watch(activeTab, async (tab) => {
  if (tab === 'settings') {
    await fetchSettings()
    Object.assign(settingsForm, settings.value)
  }
})

const settingsLoading  = ref(false)
const settingsSaveMsg  = ref('')
const settingsSaveError = ref(false)

async function saveSettings() {
  settingsLoading.value  = true
  settingsSaveMsg.value  = ''
  settingsSaveError.value = false
  try {
    await $fetch('/api/settings', { method: 'PATCH', body: { ...settingsForm } })
    await fetchSettings()
    Object.assign(settings.value, settingsForm)
    settingsSaveMsg.value = 'Settings saved successfully.'
  } catch (err: any) {
    settingsSaveError.value = true
    settingsSaveMsg.value   = err?.data?.statusMessage ?? 'Failed to save settings.'
  } finally {
    settingsLoading.value = false
  }
}
</script>