<script setup>
import PageBanner from '@/components/PageBanner.vue'
import TheBreadcrumb from '@/components/TheBreadcrumb.vue'

const images = [
  '/Smata-Jaya-Foto-Utama-2.png',
  '/banner.png',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2dkf6EyIOJHpLzOwC4-Co2LHfREIca8gsoGAlSW71fyaBGsL-SNbom6D9LmNW8Xx9j9XWmtgLTgRvYJMyMBwrHPvh1Sb4rwlCEW3-9At4sJtn9RitVeOivpjNAgCIU1hHSMx_dDIfMBOvLCdNdQbCzqZcqII_LHVhakzilIikXopwPaHhvCtHbIek6v9_a4gSvQr6A4I3cV5JDWfKrkicKAmmZ-x8AN7TeVsV4NH7iX3Sj6D55yFqZM-1oNhZq4s3fm8vdDI5z1s',
]
</script>

<template>
  <div>
    <PageBanner
      badge="Dokumentasi"
      title="Galeri Momen Taruna"
      description="Dokumentasi foto kegiatan kedisiplinan, akademik, dan ekstrakurikuler taruna SMAN 5 Taruna Brawijaya."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div v-auto-animate class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="(img, i) in images"
            :key="i"
            class="overflow-hidden rounded-3xl bg-white shadow-sm h-64 group hover:shadow-md transition-shadow"
          >
            <img :src="img" alt="Foto Galeri" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
