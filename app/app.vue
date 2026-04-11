<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import DeadFuse from "@surelle-ha/dead-fuse";

DeadFuse.activate({
  projectId: "b156216c8e98008f",
  token: "a8c41a725b74f1c426e1af245bc3755c4d7b7395aea512bc",
  fallbackMode: "readonly",
  onActive:   () => console.log("Active"),
  onWarning:  (msg) => alert(msg),
  onReadonly: () => console.warn("Read-only mode"),
  onLocked:   (msg) => { console.error(msg); },
});
</script>