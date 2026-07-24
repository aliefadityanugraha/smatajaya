<script setup>
import PageBanner from '@/components/PageBanner.vue'
import TheBreadcrumb from '@/components/TheBreadcrumb.vue'
</script>

<template>
  <div>
    <PageBanner
      badge="T.A. 2025/2026"
      title="Penerimaan Peserta Didik Baru (PPDB)"
      description="Bergabunglah menjadi bagian dari Taruna SMAN 5 Taruna Brawijaya Jawa Timur."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 text-center max-w-3xl mx-auto"
        >
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Pendaftaran Online PPDB 2025/2026</h2>
          <p class="text-gray-600 text-sm mb-6">
            Pendaftaran dilaksanakan secara terpusat secara online melalui portal resmi PPDB Jawa Timur.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              class="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-full text-xs transition-all hover:scale-105 active:scale-95 inline-block"
            >
              Daftar Sekarang Online
            </a>
            <a
              href="#"
              class="bg-stone-200 hover:bg-stone-300 text-gray-800 font-bold px-6 py-3 rounded-full text-xs transition-all hover:scale-105 active:scale-95 inline-block"
            >
              Download Brosur (PDF)
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
