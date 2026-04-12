<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import DeadFuse from "@surelle-ha/dead-fuse";

DeadFuse.activate({
  projectId: "21877ed4c36419ca",
  token: "447f0dfa225b8fc89d25b8bb1e4d263e600a118993cf94ef",
  fallbackMode: "readonly",
  onActive:   () => console.log("Active"),
  onWarning:  (msg) => alert(msg),
  onReadonly: () => console.warn("Read-only mode"),
  onLocked:   (msg) => { console.error(msg); },
});
</script>