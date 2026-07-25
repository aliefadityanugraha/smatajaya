<template>
  <div v-if="loading" class="flex justify-center items-center p-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
</script>
