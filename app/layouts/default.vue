<template>
  <div class="flex flex-col min-h-screen bg-bg text-ink font-sans antialiased">

    <header class="sticky top-0 z-50 flex items-center justify-between px-6 h-14
                   bg-bg/85 backdrop-blur-md border-b border-border">
      <NuxtLink to="/" class="flex items-center gap-2 font-mono text-sm hover:opacity-70 transition-opacity">
        <span class="text-lg">⬡</span>
        <span>
          {{ settings.topbarTitle
          }}<span v-if="settings.topbarDomain" class="text-muted">{{ settings.topbarDomain }}</span>
        </span>
      </NuxtLink>
      <nav class="flex items-center gap-1">
        <NuxtLink to="/"
          class="px-3 py-1.5 rounded-md font-mono text-xs text-ink2 hover:text-ink hover:bg-surface2 transition-all"
          active-class="!text-accent">
          Index
        </NuxtLink>
        <NuxtLink to="/docs"
          class="px-3 py-1.5 rounded-md font-mono text-xs text-ink2 hover:text-ink hover:bg-surface2 transition-all"
          active-class="!text-accent">
          Docs
        </NuxtLink>
        <NuxtLink v-if="user" to="/admin"
          class="px-3 py-1.5 rounded-md font-mono text-xs text-accent2 hover:bg-surface2 transition-all">
          Admin
        </NuxtLink>
        <button v-if="user" @click="logout"
          class="px-3 py-1.5 rounded-md font-mono text-xs text-muted hover:text-ink hover:bg-surface2 transition-all cursor-pointer">
          Sign out
        </button>
      </nav>
    </header>

    <main class="flex-1 w-full max-w-[1100px] mx-auto px-6 py-12">
      <slot />
    </main>

    <footer class="border-t border-border px-6 py-4 flex items-center gap-3 font-mono text-xs text-muted">
      <span>© {{ new Date().getFullYear() }} {{ settings.siteOwner }}</span>
    </footer>

  </div>
</template>

<script setup lang="ts">
const { user, logout: doLogout } = useAuth()
const { settings } = useSiteSettings()

async function logout() {
  await doLogout()
  navigateTo('/admin/login')
}
</script>