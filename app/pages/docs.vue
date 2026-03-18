<template>
  <div class="max-w-2xl flex flex-col gap-12 py-4">

    <!-- Header -->
    <section>
      <p class="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">Documentation</p>
      <h1 class="font-head font-extrabold text-ink text-4xl tracking-tighter mb-3">Public API</h1>
      <p class="text-ink2 leading-relaxed">
        This repository exposes a read-only public API so your apps and services can consume
        the project list programmatically — no authentication or API key required.
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
        Returns all projects as a JSON array ordered by
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

      <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">// All projects
fetch('{{ siteUrl }}/api/v1/projects')

// Only live projects
fetch('{{ siteUrl }}/api/v1/projects?status=live')

// Only featured projects
fetch('{{ siteUrl }}/api/v1/projects?featured=true')</pre>

      <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed"><span class="text-muted">// Response envelope</span>
{
  "ok":    true,
  "count": 12,
  "data":  [ ...ProjectObject ]
}</pre>
    </section>

    <!-- GET /api/v1/projects/:slug -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/15 text-green-400 uppercase tracking-widest">GET</span>
        <h2 class="font-head font-bold text-ink text-xl tracking-tight">/api/v1/projects/:slug</h2>
      </div>
      <p class="text-ink2 text-sm leading-relaxed">
        Returns a single project by its unique slug.
        Returns <code class="font-mono text-xs text-accent bg-surface2 px-1.5 py-0.5 rounded">404</code> if not found.
      </p>
      <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">fetch('{{ siteUrl }}/api/v1/projects/my-project')
  .then(r => r.json())
  .then(({ data }) => console.log(data))</pre>
    </section>

    <!-- Project object shape -->
    <section class="flex flex-col gap-4">
      <h2 class="font-head font-bold text-ink text-xl tracking-tight">Project Object</h2>
      <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">{
  "id":          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "slug":        "my-project",
  "name":        "My Project",
  "tagline":     "A short one-liner shown on cards",
  "description": "A longer description of the project",
  "url":         "https://example.com",
  "icon":        "🚀",
  "tags":        ["nuxt", "postgres"],
  "status":      "live",         <span class="text-muted">// live | coming_soon | wip | archived</span>
  "featured":    false,
  "sort_order":  0,
  "created_at":  "2025-01-01T00:00:00.000Z",
  "updated_at":  "2025-06-01T12:00:00.000Z"
}</pre>
    </section>

    <!-- Status reference -->
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

    <!-- Usage example -->
    <section class="flex flex-col gap-4">
      <h2 class="font-head font-bold text-ink text-xl tracking-tight">Usage Example</h2>
      <pre class="bg-surface border border-border rounded-xl p-5 font-mono text-xs text-ink2 overflow-x-auto leading-relaxed">const res  = await fetch('{{ siteUrl }}/api/v1/projects')
const { data } = await res.json()

data.forEach(project => {
  console.log(project.name, project.status, project.url)
})</pre>
    </section>

    <!-- Fork / Deploy CTA -->
    <section v-if="!hideOriginUi"
             class="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center
                    justify-between gap-4">
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
    </section>

  </div>
</template>

<script setup lang="ts">
const config       = useRuntimeConfig()
const siteUrl      = computed(() => (config.public.siteUrl as string) || 'https://your-domain.com')
const hideOriginUi = computed(() => config.public.hideOriginUi)
const forkUrl      = computed(() => (config.public.forkUrl as string) || 'https://github.com/surelle-ha/repository')

const vercelDeployUrl = computed(() =>
  `https://vercel.com/new/clone?repository-url=${encodeURIComponent(forkUrl.value)}&env=DATABASE_URL,ADMIN_EMAIL,ADMIN_PASSWORD,JWT_SECRET,API_SECRET_KEY,NUXT_PUBLIC_SITE_URL,NUXT_PUBLIC_SITE_OWNER&project-name=repository&repository-name=repository`
)

const listParams = [
  { name: 'status',   desc: 'Filter by status:  live | coming_soon | wip | archived' },
  { name: 'featured', desc: 'Show featured only: true' },
]

const statuses = [
  { value: 'live',        cls: 'bg-green-500/15 text-green-400',   desc: 'Publicly available' },
  { value: 'coming_soon', cls: 'bg-yellow-400/10 text-yellow-400', desc: 'Not yet released' },
  { value: 'wip',         cls: 'bg-blue-300/10 text-blue-300',     desc: 'In active development' },
  { value: 'archived',    cls: 'bg-white/5 text-muted',            desc: 'No longer maintained' },
]
</script>