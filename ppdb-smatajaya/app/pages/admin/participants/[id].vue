<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '~/stores/admin'
import { ALL_DOCUMENT_LABELS, SUBJECT_LABELS, STATUS_CONFIG, ORPHAN_STATUS_LABELS } from '~/types'
import { formatDate, formatScore } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const adminStore = useAdminStore()
const showRejectDialog = ref(false)
const rejectNotes = ref('')
const actionLoading = ref(false)
const showLulusDialog = ref(false)
const showTidakLulusDialog = ref(false)
const announcementDate = ref('')

const participantId = route.params.id as string

onMounted(async () => {
  await adminStore.fetchParticipantDetail(participantId)
})

const p = computed(() => adminStore.currentParticipant)

const statusConfig = computed(() => {
  if (!p.value) return STATUS_CONFIG.draft
  return STATUS_CONFIG[p.value.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
})

const pathData = computed(() => {
  const participant = p.value
  if (!participant) return []
  const path = participant.registration_paths
  const items: { label: string; value: string | null }[] = []

  items.push({ label: 'Jalur Pendaftaran', value: path?.name || null })

  const isBeasiswa = path?.slug === 'beasiswa' || path?.slug === 'beasiswa_yatim_piatu'
  const isYatimPiatu = path?.slug === 'beasiswa_yatim_piatu'

  if (isBeasiswa) {
    items.push(
      { label: 'Penghasilan Orang Tua', value: participant.parent_income },
      { label: 'Pekerjaan Ayah', value: participant.parent_occupation_father },
      { label: 'Pekerjaan Ibu', value: participant.parent_occupation_mother },
      { label: 'Jumlah Tanggungan', value: participant.dependents_count?.toString() ?? null },
      { label: 'Prestasi / Ranking', value: participant.achievements },
    )
  }

  if (isYatimPiatu) {
    items.push(
      { label: 'Status Yatim/Piatu', value: ORPHAN_STATUS_LABELS[participant.orphan_status || ''] || participant.orphan_status },
      { label: 'Nama Wali', value: participant.guardian_name },
      { label: 'Hubungan dengan Wali', value: participant.guardian_relation },
    )
  }

  return items
})

const isBeasiswaPath = computed(() => {
  const slug = p.value?.registration_paths?.slug
  return slug === 'beasiswa' || slug === 'beasiswa_yatim_piatu'
})

const isAccepted = computed(() => p.value?.status === 'accepted')
const allTestsPast = computed(() => {
  if (!adminStore.sortedTestSchedules.length) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return adminStore.sortedTestSchedules.every(t => {
    const d = new Date(t.date)
    d.setHours(0, 0, 0, 0)
    return today > d
  })
})

const showDecisionButtons = computed(() =>
  isAccepted.value && allTestsPast.value && !p.value?.admin_decision_at,
)

async function handleAccept() {
  actionLoading.value = true
  await adminStore.updateStatus(participantId, 'verified')
  actionLoading.value = false
}

async function handleReject() {
  actionLoading.value = true
  await adminStore.updateStatus(participantId, 'needs_revision', rejectNotes.value)
  showRejectDialog.value = false
  rejectNotes.value = ''
  actionLoading.value = false
}

function openLulusDialog() {
  announcementDate.value = ''
  showLulusDialog.value = true
}

async function handleLulus() {
  if (!announcementDate.value) return
  actionLoading.value = true
  await adminStore.triggerLulus(participantId, announcementDate.value)
  showLulusDialog.value = false
  actionLoading.value = false
}

function openTidakLulusDialog() {
  announcementDate.value = ''
  showTidakLulusDialog.value = true
}

async function handleTidakLulus() {
  if (!announcementDate.value) return
  actionLoading.value = true
  await adminStore.triggerTidakLulus(participantId, announcementDate.value)
  showTidakLulusDialog.value = false
  actionLoading.value = false
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/admin/participants" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
          &larr; Kembali
        </NuxtLink>
        <h1 class="text-2xl font-bold">Detail Peserta</h1>
      </div>
      <span
        v-if="p"
        :class="[
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
          statusConfig.color,
        ]"
      >
        {{ statusConfig.label }}
      </span>
    </div>

    <div v-if="adminStore.loading" class="space-y-6">
      <div class="animate-pulse space-y-6">
        <div class="space-y-4">
          <div class="h-5 w-48 bg-muted rounded" />
          <div class="bg-card rounded-3xl border p-6 space-y-4">
            <div class="h-5 w-40 bg-muted rounded" />
            <div class="grid grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i" class="space-y-2">
                <div class="h-3 w-20 bg-muted rounded" />
                <div class="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
          <div class="bg-card rounded-3xl border p-6 space-y-4">
            <div class="h-5 w-32 bg-muted rounded" />
            <div class="grid grid-cols-2 gap-4">
              <div v-for="i in 8" :key="i" class="space-y-2">
                <div class="h-3 w-16 bg-muted rounded" />
                <div class="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
          <div class="bg-card rounded-3xl border p-6 space-y-4">
            <div class="h-5 w-32 bg-muted rounded" />
            <div class="h-32 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="p">
      <!-- Jalur Pendaftaran -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Jalur Pendaftaran</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-muted-foreground">Jalur</p>
            <p class="text-sm font-medium">{{ p.registration_paths?.name || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Personal Data -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Data Pribadi</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in [
            { label: 'NIK', value: p.biodata?.nik },
            { label: 'NISN', value: p.biodata?.nisn },
            { label: 'Nama Lengkap', value: p.biodata?.full_name || p.profiles?.full_name },
            { label: 'Tempat Lahir', value: p.biodata?.place_of_birth },
            { label: 'Tanggal Lahir', value: formatDate(p.biodata?.date_of_birth) },
            { label: 'Jenis Kelamin', value: p.biodata?.gender === 'L' ? 'Laki-laki' : p.biodata?.gender === 'P' ? 'Perempuan' : '-' },
            { label: 'Agama', value: p.biodata?.religion },
            { label: 'No. HP', value: p.biodata?.phone_number },
          ]" :key="item.label">
            <div>
              <p class="text-xs text-muted-foreground">{{ item.label }}</p>
              <p class="text-sm font-medium">{{ item.value || '-' }}</p>
            </div>
          </div>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Alamat</p>
          <p class="text-sm font-medium">{{ p.biodata?.address || '-' }}</p>
        </div>
      </div>

      <!-- Parents -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Data Orang Tua</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-muted-foreground">Nama Ayah</p>
            <p class="text-sm font-medium">{{ p.parent_information?.father_name || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Nama Ibu</p>
            <p class="text-sm font-medium">{{ p.parent_information?.mother_name || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- School -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Sekolah Asal</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-muted-foreground">Nama Sekolah</p>
            <p class="text-sm font-medium">{{ p.schools?.school_name || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">NPSN</p>
            <p class="text-sm font-medium">{{ p.schools?.npsn || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Path-Specific Data (Beasiswa) -->
      <div v-if="isBeasiswaPath && pathData.length > 0" class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">
          {{ p.registration_paths?.slug === 'beasiswa_yatim_piatu' ? 'Data Beasiswa & Yatim Piatu' : 'Data Beasiswa' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in pathData.filter(i => i.label !== 'Jalur Pendaftaran' && i.label !== 'Prestasi / Ranking')" :key="item.label">
            <p class="text-xs text-muted-foreground">{{ item.label }}</p>
            <p class="text-sm font-medium">{{ item.value || '-' }}</p>
          </div>
        </div>
        <div v-for="item in pathData.filter(i => i.label === 'Prestasi / Ranking')" :key="item.label">
          <p class="text-xs text-muted-foreground">{{ item.label }}</p>
          <p class="text-sm font-medium whitespace-pre-wrap">{{ item.value || '-' }}</p>
        </div>
      </div>

      <!-- Documents -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Dokumen</h2>
        <div class="space-y-3">
          <div
            v-for="doc in (p.documents || [])"
            :key="doc.id"
            class="flex items-center justify-between py-2 border-b last:border-0"
          >
            <span class="text-sm text-muted-foreground">
              {{ ALL_DOCUMENT_LABELS[doc.doc_type] || doc.doc_type }}
            </span>
            <a
              v-if="doc.file_url"
              :href="doc.file_url"
              target="_blank"
              class="text-sm text-primary hover:underline"
            >
              {{ doc.file_name || 'Lihat Dokumen' }}
            </a>
            <span v-else class="text-sm text-muted-foreground">-</span>
          </div>
        </div>
      </div>

      <!-- Grades -->
      <div class="bg-card rounded-3xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold">Nilai</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted">
              <tr>
                <th class="text-left px-4 py-2 font-medium">Semester</th>
                <th
                  v-for="sub in (['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips'] as const)"
                  :key="sub"
                  class="text-center px-3 py-2 font-medium"
                >
                  {{ SUBJECT_LABELS[sub] }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="sem in [1, 2, 3, 4]" :key="sem">
                <td class="px-4 py-3 font-medium">{{ sem }}</td>
                <td
                  v-for="sub in (['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips'] as const)"
                  :key="`${sem}-${sub}`"
                  class="text-center px-3 py-3"
                >
                  {{ formatScore(p.grades?.find(g => g.semester === sem && g.subject === sub)?.score ?? null) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Admin Notes -->
      <div v-if="p.admin_notes" class="bg-card rounded-3xl border p-6 space-y-2">
        <h2 class="text-lg font-semibold">Catatan Revisi</h2>
        <p class="text-sm text-muted-foreground">{{ p.admin_notes }}</p>
      </div>

      <!-- ==================== ACTIONS ==================== -->

      <!-- Phase 1: Verification Action -->
      <div
        v-if="p.status === 'submitted' || p.status === 'waiting_verification'"
        class="bg-card rounded-3xl border p-6"
      >
        <h2 class="text-lg font-semibold mb-4">Verifikasi</h2>
        <div class="flex gap-3">
          <UiButton
            :disabled="actionLoading"
            class="bg-green-600 hover:bg-green-700 text-white"
            @click="handleAccept"
          >
            Terima
          </UiButton>
          <UiButton
            variant="destructive"
            :disabled="actionLoading"
            @click="showRejectDialog = true"
          >
            Revisi
          </UiButton>
        </div>
      </div>

      <!-- Phase 1→2: Verified — notice batch from dashboard -->
      <div
        v-if="p.status === 'verified'"
        class="bg-blue-50 border border-blue-200 rounded-3xl p-6"
      >
        <h2 class="text-lg font-semibold mb-2">Verifikasi Selesai</h2>
        <p class="text-sm text-blue-700 mb-1">Peserta ini sudah terverifikasi dan siap masuk Fase 2.</p>
        <p class="text-sm text-blue-600">Gunakan tombol <strong>"Masukkan Semua ke Fase 2"</strong> di Dashboard Admin untuk memproses secara batch.</p>
      </div>

      <!-- Phase 2: Decision Buttons (appear when all test dates passed) -->
      <div
        v-if="showDecisionButtons"
        class="bg-card rounded-3xl border p-6"
      >
        <h2 class="text-lg font-semibold mb-2">Keputusan Akhir</h2>
        <p class="text-sm text-muted-foreground mb-4">Semua tanggal tes telah lewat. Tentukan hasil akhir peserta.</p>
        <div class="flex gap-3">
          <UiButton
            class="bg-green-600 hover:bg-green-700 text-white"
            @click="openLulusDialog"
          >
            Lulus
          </UiButton>
          <UiButton
            variant="destructive"
            @click="openTidakLulusDialog"
          >
            Tidak Lulus
          </UiButton>
        </div>
      </div>

      <!-- Phase 2: Decision Made -->
      <div
        v-if="isAccepted && p.admin_decision_at"
        class="bg-card rounded-3xl border p-6"
      >
        <h2 class="text-lg font-semibold mb-2">Keputusan Tercatat</h2>
        <div class="space-y-2 text-sm">
          <p class="text-muted-foreground">
            Keputusan: <span class="font-semibold" :class="p.final_status === 'lulus' ? 'text-green-600' : 'text-red-600'">{{ p.final_status === 'lulus' ? 'Lulus' : p.final_status === 'tidak_lulus' ? 'Tidak Lulus' : 'Menunggu' }}</span>
          </p>
          <p class="text-muted-foreground">
            Tanggal pengumuman: <span class="font-semibold">{{ formatDate(p.announcement_date) }}</span>
          </p>
        </div>
      </div>
    </template>

    <!-- Reject Dialog -->
    <div
      v-if="showRejectDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showRejectDialog = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-2">Revisi Data</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Berikan catatan mengenai data yang perlu diperbaiki.
        </p>
        <textarea
          v-model="rejectNotes"
          rows="4"
          placeholder="Tuliskan catatan revisi..."
          class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mb-4"
        />
        <div class="flex gap-3 justify-end">
          <UiButton variant="outline" @click="showRejectDialog = false">Batal</UiButton>
          <UiButton
            variant="destructive"
            :disabled="actionLoading || !rejectNotes.trim()"
            @click="handleReject"
          >
            {{ actionLoading ? 'Mengirim...' : 'Kirim Revisi' }}
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Lulus Dialog with Announcement Date -->
    <div
      v-if="showLulusDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showLulusDialog = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-2">Tentukan Tanggal Pengumuman</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Peserta akan dinyatakan LULUS. Pilih tanggal pengumuman — hasil tidak akan ditampilkan ke peserta sebelum tanggal tersebut.
        </p>
        <div class="space-y-2 mb-4">
          <UiLabel for="annDate">Tanggal Pengumuman</UiLabel>
          <input
            id="annDate"
            v-model="announcementDate"
            type="date"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div class="flex gap-3 justify-end">
          <UiButton variant="outline" @click="showLulusDialog = false">Batal</UiButton>
          <UiButton
            class="bg-green-600 hover:bg-green-700 text-white"
            :disabled="actionLoading || !announcementDate"
            @click="handleLulus"
          >
            {{ actionLoading ? 'Menyimpan...' : 'Simpan & Luluskan' }}
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Tidak Lulus Dialog with Announcement Date -->
    <div
      v-if="showTidakLulusDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showTidakLulusDialog = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-2">Tentukan Tanggal Pengumuman</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Peserta akan dinyatakan TIDAK LULUS. Pilih tanggal pengumuman — hasil tidak akan ditampilkan ke peserta sebelum tanggal tersebut.
        </p>
        <div class="space-y-2 mb-4">
          <UiLabel for="annDateReject">Tanggal Pengumuman</UiLabel>
          <input
            id="annDateReject"
            v-model="announcementDate"
            type="date"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div class="flex gap-3 justify-end">
          <UiButton variant="outline" @click="showTidakLulusDialog = false">Batal</UiButton>
          <UiButton
            variant="destructive"
            :disabled="actionLoading || !announcementDate"
            @click="handleTidakLulus"
          >
            {{ actionLoading ? 'Menyimpan...' : 'Simpan & Tidak Luluskan' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
