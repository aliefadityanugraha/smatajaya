<script setup>
const siteUrl = 'https://smatarunakediri.sch.id'

useSeoMeta({
  title: 'Informasi & Pengumuman | SMAN 5 Taruna Brawijaya Jawa Timur',
  description: 'Berita terbaru, pengumuman resmi, dan agenda kegiatan SMAN 5 Taruna Brawijaya Jawa Timur.',
  ogTitle: 'Informasi & Pengumuman | SMAN 5 Taruna Brawijaya Jawa Timur',
  ogDescription: 'Berita terbaru, pengumuman resmi, dan agenda kegiatan SMAN 5 Taruna Brawijaya Jawa Timur.',
  ogImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
  ogUrl: `${siteUrl}/informasi`,
  twitterTitle: 'Informasi & Pengumuman | SMAN 5 Taruna Brawijaya Jawa Timur',
  twitterDescription: 'Berita terbaru, pengumuman resmi, dan agenda kegiatan SMAN 5 Taruna Brawijaya Jawa Timur.',
  twitterImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/informasi` }],
})

definePageMeta({ title: 'Informasi & Pengumuman' })

const items = [
  {
    tag: 'Pengumuman',
    tagColor: 'green',
    title: 'Jadwal Orientasi Taruna Baru 2025',
    desc: 'Pelaksanaan kegiatan orientasi dan penyerahan perlengkapan asrama taruna baru.',
    date: 'Dipublikasikan: 20 Mei 2025',
  },
  {
    tag: 'Agenda',
    tagColor: 'yellow',
    title: 'Pelaksanaan UTBK SNBT & Tes Kedinasan',
    desc: 'Tryout gabungan nasional persiapan kelulusan angkatan 2025.',
    date: 'Dipublikasikan: 18 Mei 2025',
  },
]
</script>

<template>
  <div>
    <PageBanner
      badge="Pusat Berita"
      title="Informasi &amp; Pengumuman"
      description="Berita kegiatan terbaru, agenda sekolah, dan pengumuman resmi bagi taruna dan wali murid."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="(item, i) in items"
            :key="i"
            v-scroll-reveal="{ animation: 'fade-in-up', delay: i * 0.15 }"
            class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <span :class="[
              'text-xs font-bold px-3 py-1 rounded-full',
              item.tagColor === 'green' ? 'bg-green-100 text-green-800' : '',
              item.tagColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : '',
            ]">{{ item.tag }}</span>
            <h3 class="text-lg font-bold text-gray-900 mt-3 mb-2">{{ item.title }}</h3>
            <p class="text-xs text-gray-500 mb-4">{{ item.desc }}</p>
            <span class="text-xs text-gray-400">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
