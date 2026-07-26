<script setup lang="ts">
import { FolderSearch } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-dashed">
    <div class="bg-muted p-4 rounded-full mb-4">
      <FolderSearch class="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-muted-foreground max-w-sm mt-1">{{ description }}</p>
    <slot name="action" />
  </div>
</template>