<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  value?: number
  max?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
})
</script>

<template>
  <div
    role="progressbar"
    :aria-valuemax="max"
    :aria-valuemin="0"
    :aria-valuenow="value"
    :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', $props.class)"
  >
    <div
      class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      :style="{ transform: `translateX(-${100 - (value / max) * 100}%)` }"
    />
  </div>
</template>
