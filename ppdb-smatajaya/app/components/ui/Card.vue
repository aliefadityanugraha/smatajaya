<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
  <div :class="cn('rounded-2xl border bg-card text-card-foreground shadow-sm', $props.class)">
    <slot />
  </div>
</template>
