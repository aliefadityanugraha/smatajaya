<script setup lang="ts">
const requirements = [
  'Warga Negara Indonesia usia 14 s.d. 17 tahun saat awal tahun pelajaran 2026/2027',
  'Siswa kelas IX tahun pelajaran 2025/2026 atau siswa lulusan tahun sebelumnya',
  'Tinggi badan minimal 155 cm (laki-laki) dan minimal 150 cm (perempuan)',
  'Tidak bertato',
  'Tidak bertindik (untuk siswa laki-laki)',
  'Sehat jasmani dan rohani',
  'Rata-rata nilai rapor mata pelajaran Bahasa Indonesia, Bahasa Inggris, PPKn, Matematika, IPA, dan IPS semester 1, 2, 3, dan 4 minimal 75',
]

const documents = [
  { name: 'Foto 4x6', note: 'Background merah (laki-laki) / biru (perempuan)' },
  { name: 'Kartu Keluarga', note: null },
  { name: 'Ijazah', note: 'Bagi lulusan tahun pelajaran 2024/2025' },
  { name: 'Surat Keterangan Sehat dari Dokter', note: null },
  { name: 'Surat Kelakuan Baik (SKB) dari Sekolah Asal', note: null },
  { name: 'Sertifikat / Piagam Penghargaan', note: 'Jika memiliki' },
  { name: 'Rapor semester 1, 2, 3, dan 4', note: 'Dibawa saat verifikasi berkas' },
]
</script>

<template>
  <section id="persyaratan" class="py-20 bg-background">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Persyaratan & Berkas</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Pastikan Anda memenuhi seluruh persyaratan dan menyiapkan berkas sebelum mendaftar
        </p>
      </div>

      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <!-- Syarat Pendaftaran -->
        <div class="bg-card rounded-3xl border p-8">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Syarat Pendaftaran
          </h3>
          <ul class="space-y-4">
            <li
              v-for="(req, index) in requirements"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span class="text-sm text-muted-foreground leading-relaxed">{{ req }}</span>
            </li>
          </ul>
        </div>

        <!-- Berkas Yang Harus Disiapkan -->
        <div class="bg-card rounded-3xl border p-8">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Berkas Yang Harus Disiapkan
          </h3>
          <ul class="space-y-4">
            <li
              v-for="(doc, index) in documents"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <span class="text-sm text-muted-foreground leading-relaxed">{{ doc.name }}</span>
                <span v-if="doc.note" class="text-xs text-muted-foreground/70 block mt-0.5">{{ doc.note }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
