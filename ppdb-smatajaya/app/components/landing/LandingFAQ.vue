<script setup lang="ts">
import { ref } from 'vue'

const faqs = [
  {
    question: 'Bagaimana cara mendaftar PPDB?',
    answer: 'Klik tombol "Daftar Sekarang", isi form registrasi dengan email aktif, lalu lengkapi data pendaftaran di dashboard.',
  },
  {
    question: 'Apakah bisa mendaftar dari HP?',
    answer: 'Ya, website kami responsive dan dapat diakses dari HP, tablet, maupun komputer.',
  },
  {
    question: 'Dokumen apa saja yang perlu diupload?',
    answer: 'Pas foto 4x6, Kartu Keluarga, Ijazah, Surat Keterangan Sehat dari Dokter, Surat Kelakuan Baik (SKB) dari sekolah asal, dan Sertifikat/Piagam Penghargaan (jika ada). Rapor asli dibawa saat verifikasi berkas.',
  },
  {
    question: 'Bagaimana jika data saya salah?',
    answer: 'Admin akan memberikan catatan revisi jika terdapat kesalahan data. Anda dapat memperbaikinya melalui dashboard.',
  },
]

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="py-20 bg-muted">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">FAQ</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Pertanyaan yang sering ditanyakan
        </p>
      </div>

      <div class="max-w-2xl mx-auto space-y-3">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-card rounded-2xl border overflow-hidden"
        >
          <button
            class="flex items-center justify-between w-full px-6 py-4 text-left"
            @click="toggle(index)"
          >
            <span class="text-sm font-medium">{{ faq.question }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="shrink-0 ml-4 transition-transform"
              :class="openIndex === index ? 'rotate-180' : ''"
            ><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <div
            v-show="openIndex === index"
            class="px-6 pb-4"
          >
            <p class="text-sm text-muted-foreground">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
