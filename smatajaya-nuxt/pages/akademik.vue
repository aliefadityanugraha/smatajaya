<script setup>
const siteUrl = 'https://smatarunakediri.sch.id'

useSeoMeta({
  title: 'Akademik | SMAN 5 Taruna Brawijaya Jawa Timur',
  description: 'Program akademik unggulan SMAN 5 Taruna Brawijaya - Kurikulum Merdeka Plus, bimbingan kedinasan, dan language & leadership.',
  ogTitle: 'Akademik | SMAN 5 Taruna Brawijaya Jawa Timur',
  ogDescription: 'Program akademik unggulan SMAN 5 Taruna Brawijaya - Kurikulum Merdeka Plus, bimbingan kedinasan, dan language & leadership.',
  ogImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
  ogUrl: `${siteUrl}/akademik`,
  twitterTitle: 'Akademik | SMAN 5 Taruna Brawijaya Jawa Timur',
  twitterDescription: 'Program akademik unggulan SMAN 5 Taruna Brawijaya - Kurikulum Merdeka Plus, bimbingan kedinasan, dan language & leadership.',
  twitterImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/akademik` }],
})

definePageMeta({ title: 'Akademik' })

const programs = [
  {
    icon: '&#128218;',
    color: 'green',
    title: 'Kurikulum Merdeka Plus',
    desc: 'Pembelajaran berbasis proyek dan riset yang melatih pemikiran kritis serta inovasi siswa di bidang sains dan teknologi.',
  },
  {
    icon: '&#127919;',
    color: 'yellow',
    title: 'Bimbingan Kedinasan & PTN',
    desc: 'Program pengayaan khusus untuk kesiapan lulus seleksi Akmil, Akpol, STAN, IPDN, serta UTBK-SNBT ke PTN Favorit.',
  },
  {
    icon: '&#127760;',
    color: 'blue',
    title: 'Language & Leadership',
    desc: 'Pelatihan intensif Bahasa Inggris (TOEFL), Bahasa Mandarin/Jepang, serta kepemimpinan lapangan.',
  },
]
</script>

<template>
  <div>
    <PageBanner
      badge="Pendidikan &amp; Kurikulum"
      title="Akademik Unggulan"
      description="Integrasi Kurikulum Merdeka dengan pengayaan Olimpiade Sains, Bahasa Asing, dan Persiapan Masuk PTN / Akademi TNI-POLRI."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div
            v-for="(item, i) in programs"
            :key="i"
            v-scroll-reveal="{ animation: 'fade-in-up', delay: i * 0.15 }"
            class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4',
              item.color === 'green' ? 'bg-green-100 text-green-800' : '',
              item.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : '',
              item.color === 'blue' ? 'bg-blue-100 text-blue-800' : '',
            ]" v-html="item.icon"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
