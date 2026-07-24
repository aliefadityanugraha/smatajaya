<script setup>
const siteUrl = 'https://smatarunakediri.sch.id'

useSeoMeta({
  title: 'Kontak & Lokasi | SMAN 5 Taruna Brawijaya Jawa Timur',
  description: 'Hubungi SMAN 5 Taruna Brawijaya - Alamat, telepon, email, dan lokasi sekolah di Kediri, Jawa Timur.',
  ogTitle: 'Kontak & Lokasi | SMAN 5 Taruna Brawijaya Jawa Timur',
  ogDescription: 'Hubungi SMAN 5 Taruna Brawijaya - Alamat, telepon, email, dan lokasi sekolah di Kediri, Jawa Timur.',
  ogImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
  ogUrl: `${siteUrl}/kontak`,
  twitterTitle: 'Kontak & Lokasi | SMAN 5 Taruna Brawijaya Jawa Timur',
  twitterDescription: 'Hubungi SMAN 5 Taruna Brawijaya - Alamat, telepon, email, dan lokasi sekolah di Kediri, Jawa Timur.',
  twitterImage: `${siteUrl}/Smata-Jaya-Foto-Utama-2.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/kontak` }],
})

definePageMeta({ title: 'Kontak & Lokasi' })

const form = ref({ nama: '', kontak: '', pesan: '' })

function submitForm() {
  alert('Pesan berhasil dikirim! Terima kasih telah menghubungi kami.')
  form.value = { nama: '', kontak: '', pesan: '' }
}
</script>

<template>
  <div>
    <PageBanner
      badge="Hubungi Kami"
      title="Kontak &amp; Lokasi Sekolah"
      description="Kirimkan pertanyaan atau informasi seputar pendaftaran dan konsultasi sekolah."
    />
    <TheBreadcrumb />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            v-scroll-reveal="{ animation: 'fade-in-left' }"
            class="lg:col-span-5 bg-forest-800 text-white rounded-3xl p-8"
          >
            <h2 class="text-2xl font-bold mb-6 text-yellow-400">Informasi Sekretariat</h2>
            <div class="space-y-4 text-sm text-green-100">
              <p><strong>Alamat:</strong> Jl. Selomangleng No. 2, Kota Kediri, Jawa Timur</p>
              <p><strong>Telepon:</strong> (0354) 771074</p>
              <p><strong>Email:</strong> sman5tarunabrawijaya@gmail.com</p>
              <p><strong>Jam Layanan:</strong> Senin - Jumat: 07.30 - 15.30 WIB</p>
            </div>
          </div>

          <div
            v-scroll-reveal="{ animation: 'fade-in-right', delay: 0.15 }"
            class="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
            <form class="space-y-4" @submit.prevent="submitForm">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  v-model="form.nama"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  placeholder="Masukkan nama anda"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Email / WhatsApp</label>
                <input
                  v-model="form.kontak"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  placeholder="Masukkan kontak"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Pesan</label>
                <textarea
                  v-model="form.pesan"
                  rows="4"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  placeholder="Tuliskan pertanyaan anda"
                ></textarea>
              </div>
              <button
                type="submit"
                class="bg-forest-800 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-forest-600 transition-colors cursor-pointer"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

        <div
          v-scroll-reveal="{ animation: 'fade-in-up', delay: 0.2 }"
          class="mt-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div class="p-6 pb-0">
            <h3 class="text-lg font-bold text-gray-900 mb-1">Lokasi Sekolah</h3>
            <p class="text-xs text-gray-500 mb-4">Jl. Selomangleng No. 2, Kota Kediri, Jawa Timur</p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1!2d112.0!3d-7.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDknMTIuMCJTIDExMsKwMDAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="350"
            style="border:0; display:block;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Lokasi SMAN 5 Taruna Brawijaya di Google Maps"
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</template>
