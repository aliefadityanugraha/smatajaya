<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAdminStore } from '~/stores/admin'
import { STATUS_CONFIG } from '~/types'
import { formatDate } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
})

useSeoMeta({
  title: 'Admin Dashboard - PPDB',
})

const adminStore = useAdminStore()
const authStore = useAuthStore()

watch(() => authStore.profile, (newProfile) => {
  if (newProfile && newProfile.role !== 'admin') {
    navigateTo('/dashboard')
  }
}, { immediate: true })

const batchLoading = ref(false)
const showBatchConfirm = ref(false)
const batchResult = ref<{ success: boolean; message: string } | null>(null)
const settingsSaving = ref(false)
const settingsSuccess = ref('')

const heroForm = ref({
  registration_open: true,
  registration_message: 'Penerimaan Telah Dibuka',
})

onMounted(async () => {
  if (adminStore.participants.length === 0) {
    await adminStore.fetchParticipants()
  }
  await adminStore.fetchSiteSettings()
  heroForm.value.registration_open = adminStore.siteSettings.registration_open === true || adminStore.siteSettings.registration_open === 'true'
  heroForm.value.registration_message = adminStore.siteSettings.registration_message || 'Penerimaan Telah Dibuka'
})

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
}

const recentParticipants = computed(() => adminStore.participants.slice(0, 5))

async function handleBatchAccept() {
  batchLoading.value = true
  const { error } = await adminStore.batchAcceptToPhase2()
  batchLoading.value = false
  showBatchConfirm.value = false
  if (error) {
    batchResult.value = { success: false, message: error.message || 'Gagal menjalankan batch' }
  }
  else {
    batchResult.value = { success: true, message: `${adminStore.stats.verified + adminStore.stats.accepted} peserta telah dimasukkan ke Fase 2` }
    setTimeout(() => { batchResult.value = null }, 4000)
  }
}

async function saveHeroSettings() {
  settingsSaving.value = true
  settingsSuccess.value = ''
  await adminStore.updateSiteSetting('registration_open', heroForm.value.registration_open)
  await adminStore.updateSiteSetting('registration_message', heroForm.value.registration_message)
  settingsSaving.value = false
  settingsSuccess.value = 'Pengaturan hero berhasil disimpan'
  setTimeout(() => { settingsSuccess.value = '' }, 3000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">Dashboard Admin</h1>
      <p class="text-muted-foreground">Kelola pendaftaran peserta didik baru</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <NuxtLink to="/admin/participants" class="bg-card rounded-3xl border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <p class="text-xs text-muted-foreground mb-1">Total Peserta</p>
        <p class="text-2xl font-bold">{{ adminStore.stats.total }}</p>
      </NuxtLink>
      <div class="bg-card rounded-3xl border p-5">
        <p class="text-xs text-muted-foreground mb-1">Draft</p>
        <p class="text-2xl font-bold text-gray-600">{{ adminStore.stats.draft }}</p>
      </div>
      <div class="bg-card rounded-3xl border p-5">
        <p class="text-xs text-muted-foreground mb-1">Menunggu Verifikasi</p>
        <p class="text-2xl font-bold text-yellow-600">{{ adminStore.stats.submitted }}</p>
      </div>
      <div class="bg-card rounded-3xl border p-5">
        <p class="text-xs text-muted-foreground mb-1">Terverifikasi</p>
        <p class="text-2xl font-bold text-green-600">{{ adminStore.stats.verified }}</p>
      </div>
      <div class="bg-card rounded-3xl border p-5">
        <p class="text-xs text-muted-foreground mb-1">Fase 2 (Tes)</p>
        <p class="text-2xl font-bold text-blue-600">{{ adminStore.stats.accepted }}</p>
      </div>
    </div>

    <!-- Batch Action -->
    <div
      v-if="adminStore.stats.verified > 0"
      class="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-blue-900 mb-1">Aktifkan Fase 2</h2>
          <p class="text-sm text-blue-700">
            {{ adminStore.stats.verified }} peserta sudah terverifikasi dan siap dimasukkan ke Fase 2 secara batch.
          </p>
        </div>
        <button
          :disabled="batchLoading"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
          @click="showBatchConfirm = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          {{ batchLoading ? 'Memproses...' : 'Masukkan Semua ke Fase 2' }}
        </button>
      </div>
    </div>

    <!-- Batch Result Toast -->
    <Transition name="fade">
      <div
        v-if="batchResult"
        :class="[
          'rounded-2xl p-4 text-sm font-medium',
          batchResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200',
        ]"
      >
        {{ batchResult.message }}
      </div>
    </Transition>

    <!-- Site Settings -->
    <div class="bg-card rounded-3xl border p-6">
      <h2 class="text-lg font-semibold mb-4">Pengaturan Landing Page</h2>

      <div v-if="settingsSuccess" class="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
        {{ settingsSuccess }}
      </div>

      <form @submit.prevent="saveHeroSettings" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">Status Pendaftaran</p>
            <p class="text-xs text-muted-foreground">Tampilkan status "Dibuka" atau "Ditutup" di hero landing page</p>
          </div>
          <button
            type="button"
            :class="[
              'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              heroForm.registration_open ? 'bg-green-500' : 'bg-gray-300',
            ]"
            @click="heroForm.registration_open = !heroForm.registration_open"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                heroForm.registration_open ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Pesan Status</label>
          <UiInput
            v-model="heroForm.registration_message"
            placeholder="Contoh: Penerimaan Telah Dibuka"
          />
          <p class="text-xs text-muted-foreground">Pesan yang ditampilkan di badge hero landing page</p>
        </div>

        <UiButton type="submit" :disabled="settingsSaving">
          {{ settingsSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </UiButton>
      </form>
    </div>

    <!-- Recent Participants -->
    <div class="bg-card rounded-3xl border overflow-hidden">
      <div class="p-6 border-b flex items-center justify-between">
        <h2 class="text-lg font-semibold">Peserta Terbaru</h2>
        <NuxtLink
          to="/admin/participants"
          class="text-sm text-primary hover:underline font-medium"
        >
          Lihat Semua
        </NuxtLink>
      </div>

      <div v-if="adminStore.loading" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
          <div class="h-4 w-12 bg-muted rounded" />
          <div class="h-4 w-32 bg-muted rounded" />
          <div class="h-4 flex-1 bg-muted rounded" />
          <div class="h-5 w-20 bg-muted rounded-full" />
          <div class="h-4 w-24 bg-muted rounded" />
        </div>
      </div>

      <div v-else-if="recentParticipants.length === 0" class="p-12 text-center text-muted-foreground">
        Belum ada peserta terdaftar.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted">
            <tr>
              <th class="text-left px-6 py-3 font-medium">No</th>
              <th class="text-left px-6 py-3 font-medium">Nama</th>
              <th class="text-left px-6 py-3 font-medium">Email</th>
              <th class="text-left px-6 py-3 font-medium">Status</th>
              <th class="text-left px-6 py-3 font-medium">Tanggal</th>
              <th class="text-left px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr
              v-for="(participant, index) in recentParticipants"
              :key="participant.id"
              class="hover:bg-muted/50"
            >
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium">
                {{ participant.biodata?.full_name || participant.profiles?.full_name || '-' }}
              </td>
              <td class="px-6 py-4 text-muted-foreground">
                {{ participant.profiles?.email || '-' }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    getStatusConfig(participant.status).color,
                  ]"
                >
                  {{ getStatusConfig(participant.status).label }}
                </span>
              </td>
              <td class="px-6 py-4 text-muted-foreground">
                {{ formatDate(participant.created_at) }}
              </td>
              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/admin/participants/${participant.id}`"
                  class="text-sm text-primary hover:underline font-medium"
                >
                  Detail
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Batch Confirm Dialog -->
    <div
      v-if="showBatchConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showBatchConfirm = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-2">Aktifkan Fase 2</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Semua peserta dengan status <strong>Terverifikasi</strong> akan otomatis masuk ke Fase 2 (Tes Seleksi).
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <p class="text-sm font-medium text-blue-600 mb-4">
          {{ adminStore.stats.verified }} peserta akan diproses.
        </p>
        <div class="flex gap-3 justify-end">
          <UiButton variant="outline" @click="showBatchConfirm = false">Batal</UiButton>
          <UiButton
            class="bg-blue-600 hover:bg-blue-700 text-white"
            :disabled="batchLoading"
            @click="handleBatchAccept"
          >
            {{ batchLoading ? 'Memproses...' : 'Ya, Aktifkan' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
