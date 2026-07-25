<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRegistrationStore } from '~/stores/registration'
import { useAuthStore } from '~/stores/auth'
import { TEST_NAMES } from '~/types'
import { formatDate } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Kartu Peserta Tes - PPDB',
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

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Screen-only toolbar -->
    <div class="no-print flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Kartu Peserta Tes</h1>
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
        <p class="text-lg font-bold uppercase tracking-wide">Kartu Peserta Tes</p>
        <p class="text-sm font-semibold mt-1">SMAN 5 Taruna Brawijaya</p>
        <p class="text-xs text-yellow-300 italic">Jawa Timur</p>
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
              <td class="py-1 text-gray-600">Asal Sekolah</td>
              <td class="py-1">: {{ school?.school_name || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Divider -->
      <hr class="border-t-2 border-dashed border-gray-400 mx-6" />

      <!-- Test Schedule -->
      <div class="px-6 py-5">
        <h3 class="text-center text-sm font-bold uppercase mb-4">Jadwal Tes</h3>

        <div class="space-y-2.5">
          <div
            v-for="test in registrationStore.sortedTestSchedules"
            :key="test.id"
            class="flex items-start gap-3"
          >
            <div class="h-6 w-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {{ test.test_number }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ test.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatDate(test.date) }}<span v-if="test.time"> • {{ test.time?.slice(0, 5) }}</span><span v-if="test.location"> • {{ test.location }}</span>
              </p>
            </div>
          </div>
        </div>
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
          <div v-for="i in 5" :key="i" class="flex gap-4">
            <div class="h-4 w-40 bg-muted rounded" />
            <div class="h-4 flex-1 bg-muted rounded" />
          </div>
          <div class="h-px bg-muted my-4" />
          <div v-for="i in 6" :key="`test-${i}`" class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-full bg-muted" />
            <div class="space-y-1 flex-1">
              <div class="h-4 w-48 bg-muted rounded" />
              <div class="h-3 w-32 bg-muted rounded" />
            </div>
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

  * {
    color: #000 !important;
  }
}
</style>
