<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

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
            class="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            @click="toggle(index)"
          >
            <span class="text-sm font-medium">{{ faq.question }}</span>
            <ChevronDown
              class="shrink-0 ml-4 transition-transform duration-300 ease-in-out"
              :class="openIndex === index ? 'rotate-180' : ''"
              :size="16"
            />
          </button>
          <div class="overflow-hidden transition-all duration-300 ease-in-out" :style="{ maxHeight: openIndex === index ? '200px' : '0px' }">
            <div class="px-6 pb-4">
              <p class="text-sm text-muted-foreground">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
