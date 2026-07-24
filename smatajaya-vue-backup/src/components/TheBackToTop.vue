<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <transition name="back-to-top">
    <button
      v-show="visible"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-forest-800 text-white shadow-lg hover:bg-forest-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      aria-label="Kembali ke atas"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
