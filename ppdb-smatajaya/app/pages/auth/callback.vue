<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()

// Fetch profil dulu, baru redirect berdasarkan role
await authStore.fetchProfile()

if (authStore.isAdmin) {
  await navigateTo('/admin', { replace: true })
}
else {
  await navigateTo('/dashboard', { replace: true })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-muted-foreground">Mengalihkan...</p>
  </div>
</template>
