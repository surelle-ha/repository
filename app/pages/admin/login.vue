<template>
  <div class="relative min-h-screen flex items-center justify-center bg-bg px-4 overflow-hidden">

    <!-- Dot grid bg -->
    <div class="pointer-events-none absolute inset-0"
         style="background-image:radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:28px 28px" />

    <div class="relative z-10 w-full max-w-sm bg-surface border border-border rounded-2xl p-10">

      <div class="flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest mb-6">
        <span class="text-accent text-base">⬡</span>
        Admin Access
      </div>

      <h1 class="font-head font-extrabold text-ink text-3xl tracking-tighter mb-1">Sign in</h1>
      <p class="text-ink2 text-sm mb-8">Access the repository CMS.</p>

      <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[10px] uppercase tracking-widest text-ink2">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email"
                 placeholder="you@example.com"
                 class="w-full px-3 py-2.5 bg-surface2 border border-border rounded-lg text-ink text-sm
                        font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[10px] uppercase tracking-widest text-ink2">Password</label>
          <input id="password" v-model="password" type="password" required autocomplete="current-password"
                 placeholder="••••••••"
                 class="w-full px-3 py-2.5 bg-surface2 border border-border rounded-lg text-ink text-sm
                        font-sans placeholder:text-muted outline-none focus:border-accent transition-colors" />
        </div>

        <p v-if="errorMsg"
           class="font-mono text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-md px-3 py-2">
          {{ errorMsg }}
        </p>

        <button type="submit" :disabled="loading"
                class="w-full py-2.5 bg-accent text-bg font-head font-bold text-base rounded-lg
                       flex items-center justify-center gap-2 transition-opacity hover:opacity-85
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          <span v-if="loading"
                class="w-4 h-4 border-2 border-bg/25 border-t-bg rounded-full animate-spin" />
          <span v-else>Continue →</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { user, login } = useAuth()
if (user.value) navigateTo('/admin')

const email    = ref('')
const password = ref('')
const errorMsg = ref('')
const loading  = ref(false)

async function handleLogin() {
  loading.value  = true
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    navigateTo('/admin')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage ?? 'Invalid credentials.'
    loading.value  = false
  }
}
</script>