<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRegistrationStore } from '~/stores/registration'
import { useAuthStore } from '~/stores/auth'
import { formatDate } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Kartu Peserta - PPDB',
})

const registrationStore = useRegistrationStore()
const authStore = useAuthStore()
const loaded = ref(false)

onMounted(async () => {
  await authStore.fetchProfile()
  await registrationStore.initParticipant()
  loaded.value = true
})

const biodata = computed(() => registrationStore.biodata)
const school = computed(() => registrationStore.school)
const participant = computed(() => registrationStore.participant)

const registrationNumber = computed(() => {
  if (!participant.value) return '-'
  const date = new Date(participant.value.created_at)
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const idShort = participant.value.id.slice(0, 6).toUpperCase()
  return `PPDB-${year}${month}-${idShort}`
})

const verificationDate = computed(() => {
  if (!participant.value?.submitted_at) return null
  const date = new Date(participant.value.submitted_at)
  date.setDate(date.getDate() + 3)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const verificationDateRaw = computed(() => {
  if (!participant.value?.submitted_at) return null
  const date = new Date(participant.value.submitted_at)
  date.setDate(date.getDate() + 3)
  return formatDate(date)
})

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Screen-only toolbar -->
    <div class="no-print flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Kartu Peserta</h1>
        <p class="text-muted-foreground">Cetak kartu peserta seleksi masuk</p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="handlePrint"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
        Cetak Kartu
      </button>
    </div>

    <!-- Printable Card -->
    <div v-if="loaded && participant" class="print-document bg-white text-black border rounded-2xl max-w-xl mx-auto overflow-hidden">
      <!-- Header -->
      <div class="bg-forest-800 text-white text-center py-5 px-6">
        <p class="text-lg font-bold uppercase tracking-wide">Kartu Peserta Seleksi Masuk</p>
        <p class="text-sm font-semibold mt-1">SMAN 5 Taruna Brawijaya</p>
        <p class="text-xs text-yellow-300 italic">Jawa Timur</p>
      </div>

      <!-- Alamat -->
      <div class="text-center py-3 border-b-2 border-dashed border-gray-300">
        <p class="text-xs text-gray-600">Jl. Selomangleng No. 2, Kel. Mojokerto, Kec. Mojokerto, Kota Kediri, Jawa Timur</p>
      </div>

      <!-- Participant Info -->
      <div class="px-6 py-5 space-y-2.5">
        <table class="w-full text-sm">
          <tbody>
            <tr>
              <td class="py-1 w-40 text-gray-600">Nomor Peserta</td>
              <td class="py-1 font-bold">: {{ registrationNumber }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Nama</td>
              <td class="py-1 font-bold uppercase">: {{ biodata?.full_name || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Nomor Induk Kependudukan</td>
              <td class="py-1">: {{ biodata?.nik || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Tempat / Tanggal Lahir</td>
              <td class="py-1">: {{ biodata?.place_of_birth || '-' }}, {{ formatDate(biodata?.date_of_birth) }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Asal Daerah</td>
              <td class="py-1">: {{ biodata?.address || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Asal Sekolah</td>
              <td class="py-1">: {{ school?.school_name || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 text-gray-600">Tanggal Pendaftaran</td>
              <td class="py-1">: {{ formatDate(participant?.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Confirmation -->
      <div class="mx-6 mb-5 p-4 border-2 border-forest-800 rounded-xl bg-green-50">
        <p class="text-sm leading-relaxed">
          Selamat, registrasi Anda melalui laman
          <strong>ppdb.sman5tarunabrawijaya.sch.id</strong> telah diterima.
        </p>
        <p class="text-sm leading-relaxed mt-2">
          Silahkan datang membawa berkas asli dan fotokopi yang telah di-upload untuk
          mengikuti verifikasi sesuai tanggal yang ditentukan.
        </p>
      </div>

      <!-- Divider -->
      <hr class="border-t-2 border-dashed border-gray-400 mx-6" />

      <!-- Undangan Verifikasi -->
      <div class="px-6 py-5">
        <h3 class="text-center text-sm font-bold uppercase mb-3">Undangan Verifikasi Berkas</h3>
        <p class="text-sm font-semibold text-center mb-4">{{ verificationDate }}</p>

        <p class="text-sm font-semibold mb-2">Tempat Verifikasi:</p>
        <ol class="text-sm list-decimal list-inside space-y-1 mb-4">
          <li>Kodim setempat di wilayah provinsi Jawa Timur</li>
          <li>Bagi luar wilayah Jawa Timur di SMAN 5 Taruna Brawijaya Jawa Timur</li>
        </ol>
      </div>

      <!-- Tinggi / Berat Badan -->
      <div class="mx-6 mb-6 flex gap-6">
        <div class="flex-1">
          <p class="text-sm font-semibold mb-2">Tinggi Badan</p>
          <div class="border-b border-gray-400 pb-1 min-h-[24px]" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold mb-2">Berat Badan</p>
          <div class="border-b border-gray-400 pb-1 min-h-[24px]" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="!loaded" class="max-w-xl mx-auto space-y-4">
      <div class="bg-card rounded-3xl border overflow-hidden animate-pulse">
        <div class="bg-muted h-20 w-full" />
        <div class="p-6 space-y-4">
          <div v-for="i in 7" :key="i" class="flex gap-4">
            <div class="h-4 w-40 bg-muted rounded" />
            <div class="h-4 flex-1 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
    margin: 0;
    padding: 0;
  }

  .print-document {
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: 2px solid #000 !important;
    border-radius: 0 !important;
  }

  .print-document .bg-forest-800 {
    background: #042f1d !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .print-document .bg-green-50 {
    background: #f0fdf4 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  * {
    color: #000 !important;
  }
}
</style>
