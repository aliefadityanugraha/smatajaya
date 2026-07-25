<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
  class?: string
}>(), {
  count: 1,
  class: '',
})
</script>

<template>
  <div :class="['space-y-3', $props.class]">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse rounded-2xl bg-muted"
      :style="{ height: '16px', width: `${60 + Math.random() * 40}%` }"
    />
  </div>
</template>
