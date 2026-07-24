<script setup>
defineProps({
  variant: {
    type: String,
    default: 'card',
    validator: (v) => ['card', 'text', 'image'].includes(v),
  },
  count: {
    type: Number,
    default: 1,
  },
})
</script>

<template>
  <div class="animate-pulse">
    <div v-if="variant === 'card'" class="space-y-4">
      <div v-for="n in count" :key="n" class="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div class="rounded-2xl h-52 bg-gray-200"></div>
        <div class="p-3 space-y-3">
          <div class="h-4 bg-gray-200 rounded-full w-24 mt-3"></div>
          <div class="h-5 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mt-4"></div>
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'text'" class="space-y-3">
      <div v-for="n in count" :key="n" class="h-4 bg-gray-200 rounded" :style="{ width: `${60 + Math.random() * 40}%` }"></div>
    </div>

    <div v-else-if="variant === 'image'" class="space-y-4">
      <div v-for="n in count" :key="n" class="rounded-3xl bg-gray-200" style="aspect-ratio: 16/9;"></div>
    </div>
  </div>
</template>
