<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
         @click.self="$emit('close')">
      <div class="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

        <div class="flex items-center justify-between px-6 pt-6 mb-5">
          <h2 class="font-head font-extrabold text-ink text-2xl tracking-tighter">
            {{ isEdit ? 'Edit Project' : 'New Project' }}
          </h2>
          <button type="button" @click="$emit('close')"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-muted
                         bg-surface2 hover:text-ink transition-colors cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="px-6 pb-6 flex flex-col gap-4">

          <!-- Icon + Name -->
          <div class="flex gap-3">
            <div class="flex flex-col gap-1.5 w-16">
              <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Icon</label>
              <input v-model="form.icon" maxlength="4" placeholder="👻"
                     class="w-full px-2 py-2 text-center bg-surface2 border border-border rounded-lg
                            text-ink text-sm font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
                Name <span class="text-accent">*</span>
              </label>
              <input v-model="form.name" required placeholder="My Project"
                     class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                            font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            </div>
          </div>

          <!-- Slug -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">
              Slug <span class="text-accent">*</span>
            </label>
            <input v-model="form.slug" required placeholder="my-project"
                   pattern="[a-z0-9\-]+" title="Lowercase letters, numbers, and hyphens only"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-mono placeholder:text-muted outline-none focus:border-accent transition-colors" />
          </div>

          <!-- Tagline -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Tagline</label>
            <input v-model="form.tagline" placeholder="One-liner for cards"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Longer description…"
                      class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                             font-sans placeholder:text-muted outline-none focus:border-accent transition-colors resize-none" />
          </div>

          <!-- URL -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">URL</label>
            <input v-model="form.url" type="url" placeholder="https://example.com"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
          </div>

          <!-- Status + Sort order -->
          <div class="flex gap-3">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Status</label>
              <select v-model="form.status"
                      class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                             font-sans outline-none focus:border-accent transition-colors cursor-pointer">
                <option value="live">Live</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="wip">WIP</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5 w-24">
              <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Sort</label>
              <input v-model.number="form.sort_order" type="number" min="0"
                     class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                            font-mono outline-none focus:border-accent transition-colors" />
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[10px] uppercase tracking-widest text-ink2">Tags</label>
            <input v-model="tagsInput" placeholder="nuxt, postgres, ai"
                   class="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-ink text-sm
                          font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
            <p class="font-mono text-[10px] text-muted">Comma-separated.</p>
          </div>

          <!-- Featured toggle -->
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] uppercase tracking-widest text-ink2">Featured</span>
            <button type="button" @click="form.featured = !form.featured"
                    class="relative w-10 h-5 rounded-full border transition-all cursor-pointer"
                    :class="form.featured ? 'bg-accent border-accent' : 'bg-surface2 border-border'">
              <span class="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                    :class="form.featured ? 'left-[calc(100%-18px)] bg-bg' : 'left-0.5 bg-muted'" />
            </button>
          </div>

          <!-- Error message -->
          <p v-if="errorMsg"
             class="font-mono text-xs text-red-400 bg-red-400/10 border border-red-400/25 rounded-md px-3 py-2">
            {{ errorMsg }}
          </p>

          <!-- Actions -->
          <div class="flex justify-end gap-2.5 pt-1">
            <button type="button" @click="$emit('close')"
                    class="px-4 py-2 text-sm text-ink2 border border-border rounded-lg
                           hover:border-ink2 hover:text-ink transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="loading"
                    class="px-5 py-2 bg-accent text-bg font-head font-bold text-sm rounded-lg
                           flex items-center gap-2 hover:opacity-85 transition-opacity
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <span v-if="loading"
                    class="w-3.5 h-3.5 border-2 border-bg/25 border-t-bg rounded-full animate-spin" />
              <span v-else>{{ isEdit ? 'Save Changes' : 'Create Project' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ProjectRow } from '../../server/db/schema'

type FormShape = {
  slug:        string
  name:        string
  tagline:     string | null
  description: string | null
  url:         string | null
  icon:        string | null
  tags:        string[]
  status:      'live' | 'coming_soon' | 'wip' | 'archived'
  featured:    boolean
  sort_order:  number
}

const props = defineProps<{ project: ProjectRow | null }>()
const emit  = defineEmits<{ close: []; saved: [] }>()

const isEdit = computed(() => !!props.project)

function makeDefault(): FormShape {
  return {
    slug: '', name: '', tagline: null, description: null,
    url: null, icon: null, tags: [], status: 'live',
    featured: false, sort_order: 0,
  }
}

const form = reactive<FormShape>(
  props.project
    ? {
        slug:        props.project.slug,
        name:        props.project.name,
        tagline:     props.project.tagline     ?? null,
        description: props.project.description ?? null,
        url:         props.project.url         ?? null,
        icon:        props.project.icon        ?? null,
        tags:        Array.isArray(props.project.tags) ? [...props.project.tags] : [],
        status:      props.project.status,
        featured:    props.project.featured,
        sort_order:  props.project.sort_order,
      }
    : makeDefault()
)

const tagsInput = ref((props.project?.tags ?? []).join(', '))
const loading   = ref(false)
const errorMsg  = ref('')

async function handleSubmit() {
  loading.value  = true
  errorMsg.value = ''

  form.tags = tagsInput.value
    .split(',')
    .map((t: string) => t.trim().toLowerCase())
    .filter(Boolean)

  try {
    if (isEdit.value && props.project) {
      // Edit — PATCH /api/projects/:slug
      await $fetch(`/api/projects/${props.project.slug}`, {
        method: 'PATCH',
        body: { ...form },
      })
    } else {
      // Create — POST /api/projects
      // Note: we avoid $fetch('/api/projects') which can hit the cached GET handler.
      // The explicit index.post.ts file handles POST to /api/projects correctly.
      await $fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
    }
    loading.value = false
    emit('saved')
  } catch (err: any) {
    errorMsg.value =
      err?.data?.statusMessage ??
      err?.statusMessage ??
      err?.message ??
      'Something went wrong.'
    loading.value = false
  }
}

// Auto-generate slug from name when creating
watch(() => form.name, (name: string) => {
  if (isEdit.value) return
  form.slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60)
})
</script>