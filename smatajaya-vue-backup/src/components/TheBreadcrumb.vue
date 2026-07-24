<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((r) => r.meta?.title && r.name !== 'home')
  return matched.map((r) => ({
    name: r.meta.title,
    path: r.path,
  }))
})
</script>

<template>
  <nav
    v-if="breadcrumbs.length"
    class="bg-forest-900/5 border-b border-gray-100 py-3"
    aria-label="Breadcrumb"
  >
    <div class="container mx-auto px-5">
      <ol class="flex items-center gap-1.5 text-xs font-medium">
        <li>
          <router-link to="/" class="text-green-800 hover:text-yellow-600 transition-colors">Beranda</router-link>
        </li>
        <template v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
          <li class="text-gray-300 select-none">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </li>
          <li>
            <span v-if="i === breadcrumbs.length - 1" class="text-gray-500">{{ crumb.name }}</span>
            <router-link v-else :to="crumb.path" class="text-green-800 hover:text-yellow-600 transition-colors">{{ crumb.name }}</router-link>
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>
