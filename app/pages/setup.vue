<!-- PATH: app/pages/setup.vue -->
<!-- Shown automatically when required env vars are missing.    -->
<!-- Users cannot bypass this page — the global middleware      -->
<!-- redirects here until the app is correctly configured.      -->

<template>
  <div class="min-h-screen bg-bg text-ink font-sans antialiased flex items-center justify-center px-4">
    <div class="w-full max-w-lg">

      <!-- Header -->
      <div class="flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest mb-8">
        <span class="text-accent text-lg">⬡</span>
        First-time Setup
      </div>

      <h1 class="font-head font-extrabold text-ink text-4xl tracking-tighter mb-2">
        Almost there.
      </h1>
      <p class="text-ink2 text-sm leading-relaxed mb-10">
        Repository needs a few environment variables to start. Set them in your
        hosting platform (Vercel dashboard, <code class="text-accent font-mono text-xs">.env</code> file, etc.)
        and then redeploy or restart the server.
      </p>

      <!-- Missing vars -->
      <div class="bg-surface border border-border rounded-2xl overflow-hidden mb-8">
        <div class="px-5 py-3 border-b border-border bg-surface2">
          <p class="font-mono text-[10px] uppercase tracking-widest text-muted">
            {{ allReady ? 'All variables detected ✓' : 'Missing environment variables' }}
          </p>
        </div>

        <div class="divide-y divide-border">
          <div v-for="v in vars" :key="v.key"
               class="flex items-start gap-4 px-5 py-4">
            <!-- Status dot -->
            <span class="mt-0.5 w-2 h-2 rounded-full shrink-0"
                  :class="v.present ? 'bg-green-400' : 'bg-red-400 animate-pulse'" />
            <div class="flex flex-col gap-0.5 flex-1">
              <code class="font-mono text-xs"
                    :class="v.present ? 'text-green-400' : 'text-red-400'">{{ v.key }}</code>
              <p class="font-mono text-[10px] text-muted">{{ v.desc }}</p>
            </div>
            <span class="font-mono text-[10px] shrink-0"
                  :class="v.present ? 'text-green-400' : 'text-muted'">
              {{ v.present ? 'Set ✓' : 'Missing' }}
            </span>
          </div>
        </div>
      </div>

      <!-- DB error -->
      <div v-if="dbError"
           class="bg-red-400/10 border border-red-400/30 rounded-xl px-5 py-4 mb-8">
        <p class="font-mono text-[10px] uppercase tracking-widest text-red-400 mb-1">Database Error</p>
        <p class="font-mono text-xs text-red-300">{{ dbError }}</p>
      </div>

      <!-- Ready state -->
      <div v-if="allReady"
           class="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
        <span class="text-green-400 text-lg">✓</span>
        <p class="font-mono text-xs text-green-400">
          All variables are set. Navigating to the app…
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 flex-wrap">
        <button @click="recheck" :disabled="checking"
                class="px-5 py-2.5 bg-accent text-bg font-head font-bold text-sm rounded-lg
                       flex items-center gap-2 hover:opacity-85 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          <span v-if="checking"
                class="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
          <span v-else>{{ allReady ? 'Continue →' : 'Re-check' }}</span>
        </button>

        <a href="https://github.com/surelle-ha/repository#environment-variables"
           target="_blank" rel="noopener"
           class="font-mono text-xs text-muted hover:text-ink2 transition-colors">
          View setup docs ↗
        </a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const checking = ref(false)
const missing  = ref<string[]>([])
const dbError  = ref<string | null>(null)

// Variable metadata for display
const VAR_META: Record<string, string> = {
  DATABASE_URL:   'Neon Postgres connection string',
  JWT_SECRET:     'Secret for signing session cookies (openssl rand -hex 32)',
  ADMIN_EMAIL:    'Email address for the admin login',
  ADMIN_PASSWORD: 'Password for the admin login',
}

const vars = computed(() =>
  Object.entries(VAR_META).map(([key, desc]) => ({
    key,
    desc,
    present: !missing.value.includes(key),
  }))
)

const allReady = computed(() => missing.value.length === 0 && !dbError.value)

async function recheck() {
  checking.value = true
  dbError.value  = null
  try {
    const status = await $fetch<{ ready: boolean; missing: string[]; error?: string }>(
      '/api/setup/status'
    )
    missing.value = status.missing ?? []
    dbError.value = status.error   ?? null

    if (status.ready) {
      await navigateTo('/')
    }
  } catch {
    missing.value = ['DATABASE_URL']
    dbError.value = 'Could not reach the server. Check your environment and restart.'
  } finally {
    checking.value = false
  }
}

// Run check immediately on mount
onMounted(recheck)
</script>