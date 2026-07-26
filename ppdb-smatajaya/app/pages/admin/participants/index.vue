<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAdminStore } from '~/stores/admin'
import { STATUS_CONFIG, FINAL_STATUS_CONFIG, type ParticipantStatus, type FinalStatus } from '~/types'
import { formatDate } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: 'Peserta - Admin PPDB',
})

const adminStore = useAdminStore()
const searchQuery = ref('')
const statusFilter = ref<ParticipantStatus | 'all'>('all')
const phaseFilter = ref<'all' | 'registration' | 'test' | 'announced'>('all')
const currentPage = ref(1)
const perPage = ref(20)

onMounted(async () => {
  if (adminStore.participants.length === 0) {
    await adminStore.fetchParticipants()
  }
})

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({
    value: key,
    label: val.label,
  })),
]

const phaseOptions = [
  { value: 'all', label: 'Semua Fase' },
  { value: 'registration', label: 'Pendaftaran' },
  { value: 'test', label: 'Fase Tes' },
  { value: 'announced', label: 'Sudah Diumumkan' },
]

const perPageOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]

function getPhase(p: { status: string }) {
  if (['accepted'].includes(p.status)) return 'test'
  if (['submitted', 'waiting_verification', 'needs_revision', 'verified', 'draft'].includes(p.status)) return 'registration'
  return 'registration'
}

const filteredParticipants = computed(() => {
  return adminStore.participants.filter((p) => {
    const matchesSearch =
      !searchQuery.value ||
      p.profiles?.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.profiles?.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.biodata?.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      statusFilter.value === 'all' || p.status === statusFilter.value

    const matchesPhase =
      phaseFilter.value === 'all' || getPhase(p) === phaseFilter.value

    return matchesSearch && matchesStatus && matchesPhase
  })
})

const totalPages = computed(() => Math.ceil(filteredParticipants.value.length / perPage.value))

const paginatedParticipants = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredParticipants.value.slice(start, start + perPage.value)
})

const showingRange = computed(() => {
  const total = filteredParticipants.value.length
  if (total === 0) return '0'
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(currentPage.value * perPage.value, total)
  return `${start}-${end} dari ${total}`
})

const visiblePages = computed(() => {
  const pages: (number | '...')[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  }
  else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function resetPage() {
  currentPage.value = 1
}

watch([searchQuery, statusFilter, phaseFilter, perPage], () => {
  currentPage.value = 1
})

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
}

function exportCSV() {
  // Menyiapkan header untuk semua kolom yang diinginkan
  const headers = [
    'No', 'Nama Lengkap', 'Email', 'NIK', 'NISN', 'Tempat Lahir', 'Tgl Lahir', 
    'JK', 'Agama', 'Alamat', 'No HP', 'Ayah', 'Ibu', 'Sekolah Asal', 'NPSN', 
    'Status', 'Fase', 'Tanggal Daftar', 'Dokumen KK', 'Dokumen Akta', 'Dokumen Ijazah', 'Dokumen Rapor'
  ]

  const rows = filteredParticipants.value.map((p, i) => {
    // Helper untuk mencari link dokumen
    const getDocUrl = (type: string) => p.documents?.find(d => d.doc_type === type)?.file_url || '-'

    return [
      i + 1,
      p.biodata?.full_name || p.profiles?.full_name || '-',
      p.profiles?.email || '-',
      p.biodata?.nik || '-',
      p.biodata?.nisn || '-',
      p.biodata?.place_of_birth || '-',
      p.biodata?.date_of_birth || '-',
      p.biodata?.gender || '-',
      p.biodata?.religion || '-',
      p.biodata?.address || '-',
      p.biodata?.phone_number || '-',
      p.parent_information?.father_name || '-',
      p.parent_information?.mother_name || '-',
      p.schools?.school_name || '-',
      p.schools?.npsn || '-',
      getStatusConfig(p.status).label,
      p.status === 'accepted' ? (p.final_status === 'lulus' ? 'Lulus' : p.final_status === 'tidak_lulus' ? 'Tidak Lulus' : 'Fase Tes') : '-',
      formatDate(p.submitted_at || p.created_at),
      getDocUrl('kk'),
      getDocUrl('akta'),
      getDocUrl('skl_ijazah'),
      getDocUrl('rapor')
    ]
  })

  // Membuat string CSV dengan quote untuk keamanan
  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `data-lengkap-peserta-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function exportPDF() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const rows = filteredParticipants.value.map((p, i) => `
    <tr>
      <td style="padding:6px 8px;border:1px solid #ddd">${i + 1}</td>
      <td style="padding:6px 8px;border:1px solid #ddd">${p.biodata?.full_name || p.profiles?.full_name || '-'}</td>
      <td style="padding:6px 8px;border:1px solid #ddd">${p.profiles?.email || '-'}</td>
      <td style="padding:6px 8px;border:1px solid #ddd">${getStatusConfig(p.status).label}</td>
      <td style="padding:6px 8px;border:1px solid #ddd">${p.status === 'accepted' ? (p.final_status === 'lulus' ? 'Lulus' : p.final_status === 'tidak_lulus' ? 'Tidak Lulus' : 'Fase Tes') : '-'}</td>
      <td style="padding:6px 8px;border:1px solid #ddd">${formatDate(p.submitted_at || p.created_at)}</td>
    </tr>
  `).join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Data Peserta PPDB</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p { font-size: 12px; color: #666; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #042f1d; color: white; padding: 8px; text-align: left; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>Data Peserta PPDB SMAN 5 Taruna Brawijaya</h1>
      <p>Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} | Total: ${filteredParticipants.value.length} peserta</p>
      <table>
        <thead>
          <tr>
            <th>No</th><th>Nama</th><th>Email</th><th>Status</th><th>Fase</th><th>Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.onload=function(){window.print();window.close()}<\/script>
    </body>
    </html>
  `)
  printWindow.document.close()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Daftar Peserta</h1>
        <p class="text-muted-foreground text-sm">Kelola data pendaftaran peserta didik baru</p>
      </div>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          @click="exportCSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export CSV
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          @click="exportPDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
          Export PDF
        </button>
        <NuxtLink
          to="/admin"
          class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground rounded-xl border border-input bg-background px-4 py-2.5 font-medium hover:bg-muted transition-colors"
        >
          &larr; Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-card rounded-3xl border p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau email..."
            class="flex w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div class="sm:w-48">
          <select
            v-model="phaseFilter"
            class="flex w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option
              v-for="opt in phaseOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="sm:w-48">
          <select
            v-model="statusFilter"
            class="flex w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option
              v-for="opt in statusOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-card rounded-3xl border overflow-hidden">
      <div v-if="adminStore.loading" class="p-6 space-y-3">
        <div v-for="i in 10" :key="i" class="flex items-center gap-4 animate-pulse">
          <div class="h-4 w-8 bg-muted rounded" />
          <div class="h-4 w-40 bg-muted rounded" />
          <div class="h-4 flex-1 bg-muted rounded" />
          <div class="h-5 w-20 bg-muted rounded-full" />
          <div class="h-5 w-16 bg-muted rounded-full" />
          <div class="h-4 w-28 bg-muted rounded" />
          <div class="h-4 w-14 bg-muted rounded" />
        </div>
      </div>

      <div v-else-if="filteredParticipants.length === 0" class="p-6">
        <UiEmptyState
          title="Tidak ada peserta ditemukan"
          description="Coba ubah filter atau kriteria pencarian Anda untuk menampilkan lebih banyak data."
        />
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted">
              <tr>
                <th class="text-left px-6 py-3 font-medium">No</th>
                <th class="text-left px-6 py-3 font-medium">Nama</th>
                <th class="text-left px-6 py-3 font-medium">Email</th>
                <th class="text-left px-6 py-3 font-medium">Status</th>
                <th class="text-left px-6 py-3 font-medium">Fase</th>
                <th class="text-left px-6 py-3 font-medium">Tanggal Daftar</th>
                <th class="text-left px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr
                v-for="(participant, index) in paginatedParticipants"
                :key="participant.id"
                class="hover:bg-muted/50"
              >
                <td class="px-6 py-4">{{ (currentPage - 1) * perPage + index + 1 }}</td>
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
                <td class="px-6 py-4">
                  <span v-if="participant.status === 'accepted' && participant.final_status !== 'pending'" class="text-xs text-muted-foreground">
                    {{ participant.final_status === 'lulus' ? 'Lulus' : 'Tidak Lulus' }}
                  </span>
                  <span v-else-if="participant.status === 'accepted'" class="text-xs text-blue-600 font-medium">Fase Tes</span>
                  <span v-else class="text-xs text-muted-foreground">-</span>
                </td>
                <td class="px-6 py-4 text-muted-foreground">
                  {{ formatDate(participant.submitted_at || participant.created_at) }}
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

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan {{ showingRange }}</span>
            <select
              v-model="perPage"
              class="rounded-lg border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option v-for="opt in perPageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <span>per halaman</span>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              &laquo;
            </button>
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === '...'" class="px-2 py-1.5 text-sm text-muted-foreground">...</span>
              <button
                v-else
                :class="[
                  'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                  page === currentPage
                    ? 'bg-forest-800 text-white border-forest-800'
                    : 'border-input hover:bg-muted',
                ]"
                @click="goToPage(page as number)"
              >
                {{ page }}
              </button>
            </template>
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              &raquo;
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
