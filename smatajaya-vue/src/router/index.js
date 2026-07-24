import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Beranda',
      description: 'Website resmi SMAN 5 Taruna Brawijaya Jawa Timur - Sekolah berasrama berbasis kedisiplinan dan keunggulan akademik.',
    },
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfilView.vue'),
    meta: {
      title: 'Profil',
      description: 'Mengenal lebih dekat SMAN 5 Taruna Brawijaya Jawa Timur - Sejarah, visi, dan misi sekolah berasrama kerjasama Pemprov Jatim dengan Kodam V/Brawijaya.',
    },
  },
  {
    path: '/akademik',
    name: 'akademik',
    component: () => import('@/views/AkademikView.vue'),
    meta: {
      title: 'Akademik',
      description: 'Program akademik unggulan SMAN 5 Taruna Brawijaya - Kurikulum Merdeka Plus, bimbingan kedinasan, dan language & leadership.',
    },
  },
  {
    path: '/taruna',
    name: 'taruna',
    component: () => import('@/views/TarunaView.vue'),
    meta: {
      title: 'Taruna Brawijaya',
      description: 'Kehidupan berasrama taruna SMAN 5 Taruna Brawijaya - Rutinitas harian, kedisiplinan, dan pembentukan karakter.',
    },
  },
  {
    path: '/informasi',
    name: 'informasi',
    component: () => import('@/views/InformasiView.vue'),
    meta: {
      title: 'Informasi & Pengumuman',
      description: 'Berita terbaru, pengumuman resmi, dan agenda kegiatan SMAN 5 Taruna Brawijaya Jawa Timur.',
    },
  },
  {
    path: '/galeri',
    name: 'galeri',
    component: () => import('@/views/GaleriView.vue'),
    meta: {
      title: 'Galeri',
      description: 'Dokumentasi foto kegiatan kedisiplinan, akademik, dan ekstrakurikuler taruna SMAN 5 Taruna Brawijaya.',
    },
  },
  {
    path: '/kontak',
    name: 'kontak',
    component: () => import('@/views/KontakView.vue'),
    meta: {
      title: 'Kontak & Lokasi',
      description: 'Hubungi SMAN 5 Taruna Brawijaya - Alamat, telepon, email, dan lokasi sekolah di Kediri, Jawa Timur.',
    },
  },
  {
    path: '/ppdb',
    name: 'ppdb',
    component: () => import('@/views/PpdbView.vue'),
    meta: {
      title: 'PPDB 2025/2026',
      description: 'Penerimaan Peserta Didik Baru SMAN 5 Taruna Brawijaya Jawa Timur Tahun Ajaran 2025/2026.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 - Halaman Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

const siteName = 'SMAN 5 Taruna Brawijaya Jawa Timur'
const defaultImage = 'https://smatarunakediri.sch.id/Smata-Jaya-Foto-Utama-2.png'

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    if (name.startsWith('og:')) {
      el.setAttribute('property', name)
    } else {
      el.setAttribute('name', name)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const title = to.meta.title ? `${to.meta.title} | ${siteName}` : siteName
  const description = to.meta.description || ''

  document.title = title
  setMeta('description', description)
  setMeta('og:title', title)
  setMeta('og:description', description)
  setMeta('og:image', defaultImage)
  setMeta('og:url', window.location.href)
  setMeta('og:type', 'website')
  setMeta('og:site_name', siteName)
})

export default router
