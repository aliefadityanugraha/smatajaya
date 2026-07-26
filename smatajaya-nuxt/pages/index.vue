<script setup>
const siteUrl = "https://smatarunakediri.sch.id";
const ogImage = `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`;

useSeoMeta({
  title: "Beranda | SMAN 5 Taruna Brawijaya Jawa Timur",
  description:
    "Website resmi SMAN 5 Taruna Brawijaya Jawa Timur - Sekolah berasrama berbasis kedisiplinan dan keunggulan akademik.",
  ogTitle: "Beranda | SMAN 5 Taruna Brawijaya Jawa Timur",
  ogDescription:
    "Website resmi SMAN 5 Taruna Brawijaya Jawa Timur - Sekolah berasrama berbasis kedisiplinan dan keunggulan akademik.",
  ogImage,
  ogUrl: siteUrl,
  twitterTitle: "Beranda | SMAN 5 Taruna Brawijaya Jawa Timur",
  twitterDescription:
    "Website resmi SMAN 5 Taruna Brawijaya Jawa Timur - Sekolah berasrama berbasis kedisiplinan dan keunggulan akademik.",
  twitterImage: ogImage,
});

useHead({
  link: [{ rel: "canonical", href: siteUrl }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "School",
        name: "SMAN 5 Taruna Brawijaya Jawa Timur",
        alternateName: "Smata Jaya",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description:
          "Sekolah berasrama berbasis kedisiplinan dan keunggulan akademik, kerjasama Pemerintah Provinsi Jawa Timur dengan Kodam V/Brawijaya.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Selomangleng No. 2",
          addressLocality: "Kota Kediri",
          addressRegion: "Jawa Timur",
          postalCode: "64126",
          addressCountry: "ID",
        },
        telephone: "+62-354-XXXXXXX",
        email: "info@smatarunakediri.sch.id",
        sameAs: ["https://www.instagram.com/smatarunakediri/"],
        geo: {
          "@type": "GeoCoordinates",
          latitude: -7.82,
          longitude: 112.0,
        },
        founder: {
          "@type": "Organization",
          name: "Pemerintah Provinsi Jawa Timur & Kodam V/Brawijaya",
        },
      }),
    },
  ],
});

definePageMeta({ title: "Beranda" });

import { animate, stagger } from "animejs";

const heroTitle = ref(null);
const heroDesc = ref(null);
const heroButtons = ref(null);
const heroDots = ref(null);
const heroImage = ref(null);

function animateHero() {
  const targets = [
    heroTitle.value,
    heroDesc.value,
    heroButtons.value,
    heroDots.value,
    heroImage.value,
    heroImage.value,
  ].filter(Boolean);

  animate(targets, {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    ease: "outExpo",
    delay: stagger(120),
  });
  // animate(heroImage.value, {
  //   translateX: [50, 0],
  //   duration: 800,
  //   ease: "outExpo",
  // });
}

const API_URL = "https://smatarunakediri.sch.id/wp-json/wp/v2/posts";
const loading = ref(true);
const newsItems = ref([]);

const stats = [
  {
    value: "450+",
    label: "Taruna Aktif",
    icon: '<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z"/>',
  },
  {
    value: "85%",
    label: "Lulus ke PTN",
    icon: '<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356.257l4 4a1 1 0 001.414 0l4-4a1 1 0 01.356-.257l2.644-1.131a1 1 0 000-1.84l-7-3zM3.172 5.172L10 2.246l6.828 2.926L10 8.102 3.172 5.172zM4 9.2v4.8c0 .884.895 1.6 2 1.6h8c1.105 0 2-.716 2-1.6V9.2l-3.35 1.436a3 3 0 01-2.65 0L4 9.2z"/>',
  },
  {
    value: "20+",
    label: "Prestasi Tahunan",
    icon: '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>',
  },
  {
    value: "100%",
    label: "Semangat Tanpa Batas",
    icon: '<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>',
  },
];

const galleryImages = [
  "/Smata-Jaya-Foto-Utama-2.png",
  "/banner.png",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2dkf6EyIOJHpLzOwC4-Co2LHfREIca8gsoGAlSW71fyaBGsL-SNbom6D9LmNW8Xx9j9XWmtgLTgRvYJMyMBwrHPvh1Sb4rwlCEW3-9At4sJtn9RitVeOivpjNAgCIU1hHSMx_dDIfMBOvLCdNdQbCzqZcqII_LHVhakzilIikXopwPaHhvCtHbIek6v9_a4gSvQr6A4I3cV5JDWfKrkicKAmmZ-x8AN7TeVsV4NH7iX3Sj6D55yFqZM-1oNhZq4s3fm8vdDI5z1s",
  "/Smata-Jaya-Foto-Utama-2.png",
  "/banner.png",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2dkf6EyIOJHpLzOwC4-Co2LHfREIca8gsoGAlSW71fyaBGsL-SNbom6D9LmNW8Xx9j9XWmtgLTgRvYJMyMBwrHPvh1Sb4rwlCEW3-9At4sJtn9RitVeOivpjNAgCIU1hHSMx_dDIfMBOvLCdNdQbCzqZcqII_LHVhakzilIikXopwPaHhvCtHbIek6v9_a4gSvQr6A4I3cV5JDWfKrkicKAmmZ-x8AN7TeVsV4NH7iX3Sj6D55yFqZM-1oNhZq4s3fm8vdDI5z1s",
];

const testimonials = [
  {
    quote:
      "Smata Jaya memberikan saya kesempatan untuk berkembang baik secara akademik maupun karakter. Program boarding school dan fasilitas pendidikan yang baik sangat membantu saya dalam membangun karakter dan kepemimpinan.",
    name: "Reynathan",
    role: "Taruna Smata Jaya",
  },
  {
    quote:
      "Alhamdulillah, setelah melalui proses panjang dan persaingan yang ketat diantara siswa pendaftar dari seluruh Indonesia, diberikan kesempatan Allah SWT untuk putra saya bisa melanjutkan sekolah di SMAN 5 Taruna Brawijaya Jawa Timur. Tidak sia-sia juga bagi kami mempersiapkan fisik dan kemampuan akademik anak kami sedari awal SMP. Harapan saya kedepannya semoga anak saya bisa menjadi pribadi yang lebih baik lagi, lebih mandiri dan tercapai apa yang dicita-citakan bersama Smatajaya.",
    name: "Susan Tri Agustina",
    role: "Orang Tua Taruna Kelas 10 asal Semarang",
  },
  {
    quote:
      "Sebagai pendidik, saya merasa bangga bisa membantu siswa-siswi kami mencapai potensi terbaik mereka. Lingkungan sekolah yang baik dan mendukung sangat memudahkan kami dalam memberikan pendidikan yang berkualitas dan penuh kasih sayang.",
    name: "Bapak Hasanuddin",
    role: "Guru Matematika",
  },
];

function stripHtml(html) {
  if (import.meta.server) return html.replace(/<[^>]*>/g, "");
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

try {
  const data = await $fetch(`${API_URL}?per_page=3&_embed`);
  newsItems.value = data.map((post) => {
    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    return {
      id: post.id,
      title: stripHtml(post.title.rendered),
      excerpt: stripHtml(post.excerpt.rendered),
      date: formatDate(post.date),
      image: media?.source_url || "/banner.png",
      link: post.link,
    };
  });
} catch (err) {
  console.error("Gagal memuat berita:", err);
} finally {
  loading.value = false;
}
</script>

<template>
  <div>
    <IntroSplash @done="animateHero" />

    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-forest-800 via-forest-600 to-forest-700"
      style="padding-bottom: 130px"
    >
      <div
        class="absolute inset-0 pointer-events-none z-0 opacity-25"
        style="
          background-image:
            radial-gradient(
              ellipse at 75% 25%,
              rgba(22, 163, 74, 0.15) 0%,
              transparent 75%
            ),
            radial-gradient(
              ellipse at 10% 80%,
              rgba(4, 47, 29, 0.6) 0%,
              transparent 50%
            ),
            url(&quot;/banner.png&quot;);
          background-size: cover;
          background-position: center, left, center;
          background-repeat: no-repeat;
        "
      ></div>

      <div
        class="absolute left-5 bottom-36 opacity-20 z-10 grid gap-1.5"
        style="grid-template-columns: repeat(3, 8px)"
      >
        <template v-for="i in 9" :key="i">
          <span class="block w-1.5 h-1.5 rounded-full bg-white"></span>
        </template>
      </div>

      <div class="container mx-auto px-5 pt-14 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-4">
          <div class="lg:w-3xl">
            <h1
              ref="heroTitle"
              style="opacity: 0"
              class="text-4xl md:text-5xl xl:text-[3.3rem] font-black leading-tight text-white mb-5"
            >
              Mencetak Generasi<br />
              <span class="text-yellow-400"
                >Tangguh, Cerdas, dan Berintegritas</span
              ><br />
            </h1>
            <p
              ref="heroDesc"
              style="opacity: 0"
              class="text-green-100 text-[15px] mb-8 max-w-xl leading-relaxed"
            >
              SMAN 5 Taruna Brawijaya Jawa Timur berkomitmen mencetak calon
              pemimpin masa depan yang disiplin, tangguh, dan berkarakter kuat.
              Melalui pendidikan berbasis semi-militer, sekolah ini membekali
              siswa dengan integritas tinggi untuk pengabdian terbaik bagi
              bangsa.
            </p>
            <div
              ref="heroButtons"
              style="opacity: 0"
              class="flex flex-wrap gap-4 mb-10"
            >
              <NuxtLink
                to="/profil"
                class="inline-flex items-center gap-2 border border-green-400 text-green-300 hover:bg-green-700 hover:text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                Kenali Kami
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </NuxtLink>
              <NuxtLink
                to="/pentab"
                class="inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                PENTAB 2026/2027
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </NuxtLink>
            </div>
            <div
              ref="heroDots"
              style="opacity: 0"
              class="text-2xl font-black text-white/20 tracking-widest select-none"
            >
              &raquo;&raquo;&raquo;
            </div>
          </div>

          <div
            ref="heroImage"
            style="opacity: 0"
            class="lg:w-1/2 relative flex justify-center lg:justify-end"
          >
            <img
              alt="Foto Utama SMAN 5 Taruna Brawijaya"
              src="/Smata-Jaya-Foto-Utama-2.png"
              class="relative z-10 drop-shadow-2xl object-contain w-full"
              style="max-height: 500px"
            />
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-0 left-0 w-full z-20 leading-none pointer-events-none overflow-hidden"
      >
        <svg
          class="w-full block h-[120px] sm:h-[150px] md:h-[180px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,0L80,37.3C160,75,320,149,480,170.7C640,192,800,160,960,138.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>

    <!-- Feature/Value Cards -->
    <section class="relative z-30 bg-white pt-0 pb-12">
      <div class="container mx-auto px-5">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-0 rounded-2xl p-7 shadow-2xl shadow-green-950/30"
          style="background: linear-gradient(135deg, #042f1d 0%, #064028 100%)"
        >
          <div
            v-scroll-reveal="{ animation: 'fade-in-up', delay: 0 }"
            class="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div class="shrink-0 p-3 rounded-full bg-white/10">
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">Berkarakter</h4>
              <p class="text-xs text-gray-400 mt-0.5 leading-snug">
                Membangun disiplin dan integritas tinggi
              </p>
            </div>
          </div>

          <div
            v-scroll-reveal="{ animation: 'fade-in-up', delay: 0.1 }"
            class="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div class="shrink-0 p-3 rounded-full bg-white/10">
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">Berprestasi</h4>
              <p class="text-xs text-gray-400 mt-0.5 leading-snug">
                Unggul dalam akademik dan non-akademik
              </p>
            </div>
          </div>

          <div
            v-scroll-reveal="{ animation: 'fade-in-up', delay: 0.2 }"
            class="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div class="shrink-0 p-3 rounded-full bg-white/10">
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">Berdampak</h4>
              <p class="text-xs text-gray-400 mt-0.5 leading-snug">
                Siap mengabdi untuk bangsa dan negara
              </p>
            </div>
          </div>

          <NuxtLink
            to="/informasi"
            class="flex flex-col justify-center px-5 py-4 rounded-xl bg-black/25 border border-white/15 cursor-pointer hover:bg-black/35 transition-colors"
          >
            <p
              class="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3"
            >
              Informasi Penting
            </p>
            <div class="flex justify-between items-center">
              <span class="text-yellow-400 font-bold text-sm">Lihat semua</span>
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="bg-[#f3f5f3] py-16">
      <div class="container mx-auto px-5">
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
        >
          <div>
            <div
              class="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 tracking-wider uppercase mb-2"
            >
              <span>Kabar Terbaru</span>
              <span class="text-xs">&#10024;</span>
            </div>
            <h2
              class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
            >
              Update &amp; Informasi Terkini
            </h2>
          </div>
          <NuxtLink
            to="/informasi"
            class="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-600 text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg"
          >
            Lihat Semua
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
          <template v-if="loading">
            <SkeletonLoader variant="card" :count="3" />
          </template>

          <template v-else>
            <a
              v-for="(news, i) in newsItems"
              :key="i"
              :href="news.link"
              target="_blank"
              rel="noopener noreferrer"
              v-scroll-reveal="{ animation: 'fade-in-up', delay: i * 0.15 }"
              class="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div class="overflow-hidden rounded-2xl h-52 relative">
                <img
                  :src="news.image"
                  :alt="news.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span
                    class="inline-block bg-[#e7efe8] text-green-800 text-[11px] font-semibold px-3 py-1 rounded-full mt-3 mb-2"
                  >
                    {{ news.date }}
                  </span>
                  <h3
                    class="font-bold text-base text-gray-900 leading-snug group-hover:text-green-800 transition-colors"
                  >
                    {{ news.title }}
                  </h3>
                </div>
                <span
                  class="inline-flex items-center gap-1.5 text-xs text-green-700 font-bold mt-4 group-hover:gap-2.5 transition-all"
                >
                  Selengkapnya
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </span>
              </div>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-forest-800 text-white py-16 relative overflow-hidden">
      <div
        class="absolute inset-0 pointer-events-none opacity-15"
        style="
          background-image: radial-gradient(
            ellipse at top,
            rgba(34, 197, 94, 0.4),
            transparent 70%
          );
        "
      ></div>
      <div class="container mx-auto px-5 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div
            v-scroll-reveal="{ animation: 'fade-in-left' }"
            class="lg:col-span-5"
          >
            <h2
              class="text-3xl lg:text-4xl font-extrabold leading-tight text-white"
            >
              Mengembangkan Potensi, Membangun Masa Depan
            </h2>
            <p class="text-green-100/80 text-sm mt-4 mb-7 leading-relaxed">
              Kami membina taruna yang tidak hanya unggul akademik, tetapi juga
              tangguh dalam karakter dan siap menghadapi tantangan global.
            </p>
            <NuxtLink
              to="/profil"
              class="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#c29f2e] text-gray-950 font-bold px-6 py-3 rounded-full text-xs transition-all shadow-lg hover:-translate-y-0.5"
            >
              Tentang Kami
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </NuxtLink>
          </div>
          <div class="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              v-scroll-reveal="{ animation: 'fade-in-scale', delay: i * 0.1 }"
              class="bg-forest-600/60 border border-green-600/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-h-[170px] backdrop-blur-sm hover:bg-forest-600 transition-colors"
            >
              <div class="p-3 rounded-full bg-white/10 mb-3">
                <svg
                  class="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  v-html="stat.icon"
                ></svg>
              </div>
              <div class="text-3xl font-black text-white mb-1">
                {{ stat.value }}
              </div>
              <div class="text-xs text-green-200/90 font-medium">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="bg-[#f3f5f3] py-16">
      <div class="container mx-auto px-5">
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
        >
          <div>
            <div
              class="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 tracking-wider uppercase mb-2"
            >
              <span>Galeri Kegiatan</span>
            </div>
            <h2
              class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
            >
              Momen Taruna, Prestasi untuk Negeri
            </h2>
          </div>
          <NuxtLink
            to="/galeri"
            class="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-600 text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg"
          >
            Lihat Galeri
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            v-scroll-reveal="{ animation: 'fade-in-up', delay: i * 0.08 }"
            class="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group h-44"
          >
            <img
              :src="img"
              alt="Galeri"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Testimoni Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-5">
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="text-center mb-10"
        >
          <div
            class="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 tracking-wider uppercase mb-2"
          >
            <span>Testimoni</span>
          </div>
          <h2
            class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Testimoni Orang Tua &amp; Siswa
          </h2>
          <p class="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            Suara mereka yang telah merasakan langsung pengalaman belajar di
            sekolah kami:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div
            v-for="(t, i) in testimonials"
            :key="i"
            v-scroll-reveal="{ animation: 'fade-in-up', delay: i * 0.15 }"
            class="bg-[#f8faf8] rounded-3xl p-7 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <svg
              class="w-8 h-8 text-green-200 mb-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
              />
            </svg>

            <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
              "{{ t.quote }}"
            </p>

            <div class="border-t border-gray-200 pt-4 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm shrink-0"
              >
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900">{{ t.name }}</p>
                <p class="text-xs text-gray-500">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
