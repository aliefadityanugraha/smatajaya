<script setup>
const siteUrl = 'https://smatarunakediri.sch.id'

useSeoMeta({
  title: 'Taruna Brawijaya | SMAN 5 Taruna Brawijaya Jawa Timur',
  description: 'Kehidupan berasrama taruna SMAN 5 Taruna Brawijaya - Rutinitas harian, kedisiplinan, dan pembentukan karakter.',
  ogTitle: 'Taruna Brawijaya | SMAN 5 Taruna Brawijaya Jawa Timur',
  ogDescription: 'Kehidupan berasrama taruna SMAN 5 Taruna Brawijaya - Rutinitas harian, kedisiplinan, dan pembentukan karakter.',
  ogImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
  ogUrl: `${siteUrl}/taruna`,
  twitterTitle: 'Taruna Brawijaya | SMAN 5 Taruna Brawijaya Jawa Timur',
  twitterDescription: 'Kehidupan berasrama taruna SMAN 5 Taruna Brawijaya - Rutinitas harian, kedisiplinan, dan pembentukan karakter.',
  twitterImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/taruna` }],
})

definePageMeta({ title: 'Taruna Brawijaya' })

const schedule = ref([
  { time: '04.30 WIB', activity: 'Ibadah Pagi & Olahraga Kesamaptaan Pagi' },
  { time: '06.30 WIB', activity: 'Apel Pagi & Pemeriksaan Kerapihan Seragam Taruna' },
  { time: '07.00 WIB', activity: 'Kegiatan Belajar Mengajar (KBM) Akademik di Kelas' },
  { time: '19.00 WIB', activity: 'Study Hall (Belajar Mandiri Terbimbing Malam)' },
])
</script>

<template>
  <div>
    <PageBanner
      badge="Kehidupan Berasrama"
      title="Taruna Brawijaya"
      description="Pembentukan fisik, mental, dan kedisiplinan tinggi melalui sistem pengasuhan Kodam V/Brawijaya."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Rutinitas Harian Taruna</h2>
          <div class="space-y-4">
            <div
              v-for="(item, i) in schedule"
              :key="item.time"
              class="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span class="text-green-800 font-black text-sm w-20 shrink-0">{{ item.time }}</span>
              <p class="text-xs text-gray-700 font-semibold">{{ item.activity }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
