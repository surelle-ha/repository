<!-- PATH: app/pages/docs/index.vue -->

<template>
  <div>

    <!-- Blocked state — shown when hideDocs is 'true' in DB settings -->
    <div v-if="isDocsHidden" class="text-center py-32 font-mono text-sm text-muted">
      <span class="block text-4xl mb-4">⊘</span>
      Documentation is not available on this instance.
    </div>

    <!-- Normal docs page -->
    <div v-else class="max-w-2xl flex flex-col gap-12 py-4">

      <section>
        <p class="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">Documentation</p>
        <h1 class="font-head font-extrabold text-ink text-4xl tracking-tighter mb-3">Public API</h1>
        <p class="text-ink2 leading-relaxed">
          Read-only public API — no authentication required.
        </p>
      </section>

      <!-- Base URL -->
      <section class="flex flex-col gap-3">
        <h2 class="font-head font-bold text-ink text-xl tracking-tight">Base URL</h2>
        <div class="bg-surface border border-border rounded-xl px-5 py-3 font-mono text-sm text-accent select-all">
          {{ siteUrl }}
        </div>
      </section>

      <!-- GET /api/v1/projects -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/15 text-green-400 uppercase tracking-widest">GET</span>
          <h2 class="font-head font-bold text-ink text-xl tracking-tight">/api/v1/projects</h2>
        </div>
        <p class="text-ink2 text-sm leading-relaxed">
          Returns all projects ordered by
          <code class="font-mono text-xs text-accent bg-surface2 px-1.5 py-0.5 rounded">sort_order</code>.
          Supports optional query filters.
        </p>
        <div class="bg-surface border border-border rounded-xl overflow-hidden">
          <div class="px-4 py-2 border-b border-border bg-surface2">
            <span class="font-mono text-[10px] uppercase tracking-widest text-muted">Query Parameters</span>
          </div>
          <table class="w-full">
            <tbody>
              <tr v-for="p in listParams" :key="p.name" class="border-b border-white/[0.04] last:border-0">
                <td class="px-4 py-2.5 w-32">
                  <code class="font-mono text-xs text-accent">{{ p.name }}</code>
                </td>
                <td class="px-4 py-2.5 font-mono text-[10px] text-muted">{{ p.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">fetch('{{ siteUrl }}/api/v1/projects')
fetch('{{ siteUrl }}/api/v1/projects?status=live')
fetch('{{ siteUrl }}/api/v1/projects?featured=true')</pre>
        <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">{ "ok": true, "count": 12, "data": [ ...ProjectObject ] }</pre>
      </section>

      <!-- GET /api/v1/projects/:slug -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/15 text-green-400 uppercase tracking-widest">GET</span>
          <h2 class="font-head font-bold text-ink text-xl tracking-tight">/api/v1/projects/:slug</h2>
        </div>
        <p class="text-ink2 text-sm leading-relaxed">
          Returns a single project. Returns
          <code class="font-mono text-xs text-accent bg-surface2 px-1.5 py-0.5 rounded">404</code> if not found.
        </p>
        <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">fetch('{{ siteUrl }}/api/v1/projects/my-project')
  .then(r => r.json())
  .then(({ data }) => console.log(data))</pre>
      </section>

      <!-- Response shape -->
      <section class="flex flex-col gap-4">
        <h2 class="font-head font-bold text-ink text-xl tracking-tight">Project Object</h2>
        <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">{
  "id":          "uuid",
  "slug":        "my-project",
  "name":        "My Project",
  "tagline":     "Short one-liner",
  "description": "Longer description",
  "url":         "https://example.com",
  "icon":        "🚀",
  "tags":        ["nuxt", "postgres"],
  "status":      "live",
  "featured":    false,
  "sort_order":  0,
  "created_at":  "2025-01-01T00:00:00.000Z",
  "updated_at":  "2025-06-01T12:00:00.000Z"
}</pre>
      </section>

      <!-- Status values -->
      <section class="flex flex-col gap-4">
        <h2 class="font-head font-bold text-ink text-xl tracking-tight">Status Values</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in statuses" :key="s.value"
               class="bg-surface border border-border rounded-xl px-4 py-3 flex flex-col gap-2">
            <span class="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest w-fit"
                  :class="s.cls">{{ s.value }}</span>
            <span class="font-mono text-[10px] text-muted">{{ s.desc }}</span>
          </div>
        </div>
      </section>

      <!-- Fork / Deploy CTA — hidden when isOriginHidden is true in DB -->
      <section v-if="!isOriginHidden"
               class="border-t border-border pt-8 flex flex-col sm:flex-row items-start
                      sm:items-center justify-between gap-4">
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
          <a :href="settings.forkUrl" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border
                    font-mono text-xs text-ink2 bg-surface hover:border-ink2 hover:text-ink
                    transition-all no-underline">
            <span>⑂</span> Fork on GitHub
          </a>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
// PATH: app/pages/docs/index.vue
const { settings, isDocsHidden, isOriginHidden } = useSiteSettings()

const config  = useRuntimeConfig()
const siteUrl = computed(() => config.public.siteUrl || 'https://your-domain.com')

const vercelDeployUrl = computed(() =>
  `https://vercel.com/new/clone?repository-url=${encodeURIComponent(settings.value.forkUrl)}&env=DATABASE_URL,ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,API_SECRET_KEY,NUXT_PUBLIC_SITE_URL&project-name=repository&repository-name=repository`
)

const listParams = [
  { name: 'status',   desc: 'Filter by status: live | coming_soon | wip | archived' },
  { name: 'featured', desc: 'Filter to featured only: true' },
]

const statuses = [
  { value: 'live',        cls: 'bg-green-500/15 text-green-400',   desc: 'Publicly available' },
  { value: 'coming_soon', cls: 'bg-yellow-400/10 text-yellow-400', desc: 'Not yet released' },
  { value: 'wip',         cls: 'bg-blue-300/10 text-blue-300',     desc: 'In active development' },
  { value: 'archived',    cls: 'bg-white/5 text-muted',            desc: 'No longer maintained' },
]
</script>