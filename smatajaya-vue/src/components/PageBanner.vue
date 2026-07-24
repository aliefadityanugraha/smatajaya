<script setup>
defineProps({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <section class="bg-forest-800 text-white py-16 relative overflow-hidden">
    <div class="container mx-auto px-5 relative z-10 text-center">
      <span
        class="inline-block bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider mb-3"
      >
        {{ badge }}
      </span>
      <h1 class="text-4xl md:text-5xl font-black mb-4">{{ title }}</h1>
      <p v-if="description" class="text-green-100 max-w-2xl mx-auto text-sm leading-relaxed">
        {{ description }}
      </p>
    </div>
  </section>
</template>
