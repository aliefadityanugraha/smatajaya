<script setup lang="ts">
import type { NuxtError } from 'nitropack'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f4] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl border shadow-sm p-8 max-w-md w-full text-center">
      <div class="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <span class="text-3xl font-bold text-primary">
          {{ is404 ? '404' : '500' }}
        </span>
      </div>
      <h1 class="text-2xl font-bold mb-2">
        {{ is404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
      </h1>
      <p class="text-sm text-muted-foreground mb-6">
        {{ is404
          ? 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan.'
          : 'Terjadi kesalahan internal. Silakan coba lagi nanti.'
        }}
      </p>
      <button
        class="inline-flex items-center gap-2 bg-forest-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-700 transition-colors"
        @click="handleError"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>
