<script setup>
import PageBanner from "@/components/PageBanner.vue";
</script>

<template>
  <div>
    <PageBanner
      badge="Tentang Sekolah"
      title="Profil SMAN 5 Taruna Brawijaya"
      description="Mengenal lebih dekat sekolah berasrama berbasis kedisiplinan dan keunggulan akademik kerjasama Pemerintah Provinsi Jawa Timur dengan Kodam V/Brawijaya."
    />

    <main class="py-16 bg-[#f4f6f4] flex-1">
      <div class="container mx-auto px-5">
        <!-- Sejarah Section -->
        <div
          v-scroll-reveal="{ animation: 'fade-in-up' }"
          class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div
              v-scroll-reveal="{ animation: 'fade-in-left', delay: 0.1 }"
              class="lg:col-span-6"
            >
              <img
                src="/Smata-Jaya-Foto-Utama-2.png"
                alt="Kepala Sekolah & Taruna"
                class="rounded-2xl shadow-lg w-full object-cover max-h-96"
              />
            </div>
            <div
              v-scroll-reveal="{ animation: 'fade-in-right', delay: 0.2 }"
              class="lg:col-span-6"
            >
              <h2 class="text-3xl font-extrabold text-gray-900 mb-4">
                Sejarah &amp; Pendirian
              </h2>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Generasi yang berkarakter merupakan tujuan utama dalam
                pendidikan, sekolah diharapkan menjadi tempat untuk mencetak
                generasi yang beriman kepada Tuhan Yang maha esa, berakhlak
                mulia, sehat, berilmu, cakap, kreatif, mandiri, dan menjadi
                warga negara yang demokratis serta bertanggung jawab. Dari waktu
                ke waktu SMAN 5 Kediri yang berdiri sejak 9 Oktober 1982 terus
                melakukan inovasi dan memunculkan stimulant-stimulan yang
                berarti untuk kemajuan kualitas lulusan. Lingkungan geografis
                dan administratif sekolah yang di perkotaan dengan kemudahan
                akses, Didukung fenomena topografi sekolah yang terletak di
                kawasan perbukitan menjadikan keistimewaan tersendiri dalam
                menciptakan suasana pendidikan yang nyaman dan tenang.
              </p>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Berdasarkan kesepakatan bersama antara pemerintah provinsi Jawa
                Timur yang diwakili gubernur provinsi Jawa Timur dengan TNI
                angkatan darat yang diwakili oleh pangdam V Brawijaya
                ditandatanganilah kesepakatan bersama (KBS) Nomor : 120.
                23/207/KSB/033.4/ dan SPK /02/V/2019 tentang peningkatan
                kualitas sumber daya manusia bidang pendidikan menengah di Jawa
                Timur dengan disaksikan kepala staf TNI angkatan darat, SMA 5
                Kediri berubah menjadi SMAN 5 taruna Brawijaya Jawa Timur.
              </p>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                SMAN 5 taruna Brawijaya Jawa Timur adalah sekolah unggulan
                berasrama yang dikelola oleh pemerintah provinsi Jawa Timur dan
                dibentuk untuk menjawab tantangan masa depan di era global yang
                menumbuhkan pemimpin yang unggul di bidang akademik dan non
                akademik memiliki kemandirian dan berkarakter kebangsaan yang
                kuat.
              </p>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                SMAN 5 taruna Brawijaya Jawa Timur menggunakan kurikulum
                Nasional 2013 dan mengembangkan pendidikan berasrama yang wajib
                diikuti oleh peserta didik selama menjalani pendidikan di SMAN 5
                taruna Brawijaya Jawa Timur. Sistem pendidikan ini memberikan
                penguatan nilai-nilai religius, kemandirian, tanggung jawab,
                tangguh, toleransi, berjiwa sosial, berbudi luhur, berjiwa
                kepemimpinan, dan jujur serta memiliki karakter kebangsaan yang
                kuat. peserta didik juga mendapatkan kurikulum khusus bela
                negara dan kesamaptaan yang di ampu oleh TNI angkatan darat
                titik kurikulum khusus bela negara dan kesamaptaan.
              </p>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Pada tahun ajaran 2021/2022 SMAN 5 taruna Brawijaya Jawa Timur
                terpilih sebagai sekolah penggerak dimana kurikulum sekolah
                penggerak adalah program Merdeka Belajar yang diluncurkan
                Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi. (*)
              </p>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span class="block text-2xl font-black text-green-800"
                    >2019</span
                  >
                  <span class="text-xs text-gray-500 font-medium"
                    >Tahun Peningkatan Khusus</span
                  >
                </div>
                <div>
                  <span class="block text-2xl font-black text-green-800"
                    >Kodam V</span
                  >
                  <span class="text-xs text-gray-500 font-medium"
                    >Mitra Pembinaan Karakter</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visi & Misi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            v-scroll-reveal="{ animation: 'fade-in-left', delay: 0.1 }"
            class="bg-forest-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden"
          >
            <div
              class="absolute right-4 top-4 text-yellow-400/20 font-black text-6xl select-none"
            >
              VISI
            </div>
            <h3 class="text-2xl font-extrabold text-yellow-400 mb-4">
              Visi Sekolah
            </h3>
            <p class="text-green-100 text-base font-medium leading-relaxed">
              "Terwujudnya Kader Pemimpin Bangsa Yang Berkarakter Mulia, Cerdas,
              Unggul, dan Berintegritas Tinggi."
            </p>
          </div>

          <div
            v-scroll-reveal="{ animation: 'fade-in-right', delay: 0.2 }"
            class="bg-white text-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h3 class="text-2xl font-extrabold text-green-800 mb-4">
              Misi Utama
            </h3>
            <ul class="space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Menguatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Mengukuhkan nasionalisme, rela berkorban, dan cinta tanah air.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Meningkatkan kemampuan bahasa asing dan literasi digital siswa.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Menumbuhkan keteladanan dalam pikiran, perkataan, dan perbuatan.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Membangun jiwa kemandirian, kewirausahaan, dan inovasi.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Mentradisikan cara berpikir ilmiah dan akademik.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Mengembangkan kecakapan komunikasi efektif dan daya saing
                global.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Menumbuhkan keunggulan, kompetisi, dan kreativitas dalam
                berbagai bidang.
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="p-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mt-0.5"
                  >&#10003;</span
                >
                Menguatkan kepedulian terhadap alam dan lingkungan.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
