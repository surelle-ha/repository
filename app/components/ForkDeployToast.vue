<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="visible"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-3 flex-wrap
               bg-surface border border-border rounded-xl px-4 py-3
               shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md
               max-w-xs sm:max-w-sm"
      >
        <!-- Close button -->
        <button
          @click="dismiss"
          class="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center
                 rounded-full bg-surface2 border border-border text-muted
                 hover:text-ink transition-colors text-[10px] cursor-pointer"
          aria-label="Dismiss"
        >✕</button>

        <p class="font-mono text-[10px] text-muted w-full">Want your own project repository?</p>

        <div class="flex items-center gap-2 flex-wrap">
          <a
            :href="vercelDeployUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-black border border-white/20 font-mono text-[10px] text-white
                   hover:border-white/50 transition-all no-underline"
          >
            <svg width="10" height="9" viewBox="0 0 76 65" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
            </svg>
            Deploy to Vercel
          </a>
          <a
            :href="forkUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   border border-border font-mono text-[10px] text-ink2 bg-surface
                   hover:border-ink2 hover:text-ink transition-all no-underline"
          >
            <span>⑂</span> Fork
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  forkUrl: string
  vercelDeployUrl: string
}>()

const STORAGE_KEY = 'repo_cta_dismissed'

const visible = ref(false)

onMounted(() => {
  // Show only if not previously dismissed (dismissed state resets on page refresh)
  const dismissed = sessionStorage.getItem(STORAGE_KEY)
  if (!dismissed) {
    // Small delay so it doesn't pop instantly
    setTimeout(() => { visible.value = true }, 800)
  }
})

function dismiss() {
  visible.value = false
  // Use sessionStorage so it returns on full page refresh (new tab/session)
  sessionStorage.setItem(STORAGE_KEY, '1')
}
</script>