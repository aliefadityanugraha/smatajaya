<script setup>
useSeoMeta({
  title: '404 - Halaman Tidak Ditemukan | SMAN 5 Taruna Brawijaya Jawa Timur',
  description: 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
  robots: 'noindex, nofollow',
})

definePageMeta({ title: '404 - Halaman Tidak Ditemukan' })
</script>

<template>
  <div>
    <PageBanner
      badge="404"
      title="Halaman Tidak Ditemukan"
      description="Sepertinya halaman yang Anda cari sudah dipindahkan atau tidak tersedia."
    />

    <main class="py-16 bg-[#f4f6f4] flex-1 flex items-center justify-center">
      <div class="container mx-auto px-5 text-center">
        <div v-scroll-reveal="{ animation: 'fade-in-up' }" class="max-w-lg mx-auto">
          <div class="mb-8">
            <span class="text-[120px] md:text-[160px] font-black text-forest-800/10 leading-none select-none">404</span>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">Oops! Halaman hilang</h2>
          <p class="text-gray-500 text-sm mb-8 leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau tidak pernah ada. Silakan kembali ke beranda untuk melanjutkan.
          </p>

          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
            Kembali ke Beranda
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
