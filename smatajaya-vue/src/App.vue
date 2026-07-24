<script setup>
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import TheBackToTop from './components/TheBackToTop.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheNavbar />
    <div class="flex-1 page-enter" :key="route.path">
      <router-view />
    </div>
    <TheFooter />
    <TheBackToTop />
  </div>
</template>
