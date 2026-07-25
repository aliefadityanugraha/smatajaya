<script setup lang="ts">
import { computed } from 'vue'
import { useRegistrationStore } from '~/stores/registration'
import { ALL_DOCUMENT_LABELS, PATH_DOCUMENTS, SUBJECT_LABELS, ORPHAN_STATUS_LABELS } from '~/types'
import { formatDate, formatScore } from '~/utils/helpers'

const emit = defineEmits<{
  prev: []
  submit: []
}>()

const registrationStore = useRegistrationStore()

const currentPath = computed(() => {
  const pathId = registrationStore.registrationPathId
  if (!pathId) return null
  return registrationStore.availablePaths.find(p => p.id === pathId) || null
})

const isBeasiswa = computed(() => {
  const slug = currentPath.value?.slug
  return slug === 'beasiswa' || slug === 'beasiswa_yatim_piatu'
})

const isYatimPiatu = computed(() => currentPath.value?.slug === 'beasiswa_yatim_piatu')

const personalData = computed(() => {
  const b = registrationStore.biodata
  if (!b) return []
  return [
    { label: 'NIK', value: b.nik },
    { label: 'NISN', value: b.nisn },
    { label: 'Nama Lengkap', value: b.full_name },
    { label: 'Tempat, Tanggal Lahir', value: b.place_of_birth && b.date_of_birth ? `${b.place_of_birth}, ${formatDate(b.date_of_birth)}` : null },
    { label: 'Jenis Kelamin', value: b.gender === 'L' ? 'Laki-laki' : b.gender === 'P' ? 'Perempuan' : null },
    { label: 'Agama', value: b.religion },
    { label: 'Alamat', value: b.address },
    { label: 'No. HP', value: b.phone_number },
  ]
})

const parentData = computed(() => {
  const p = registrationStore.parents
  if (!p) return []
  return [
    { label: 'Nama Ayah', value: p.father_name },
    { label: 'Nama Ibu', value: p.mother_name },
  ]
})

const schoolData = computed(() => {
  const s = registrationStore.school
  if (!s) return []
  return [
    { label: 'Nama Sekolah', value: s.school_name },
    { label: 'NPSN', value: s.npsn },
  ]
})

const pathData = computed(() => {
  const p = registrationStore.participant
  if (!p || !isBeasiswa.value) return []
  const items: { label: string; value: string | null }[] = [
    { label: 'Penghasilan Orang Tua', value: p.parent_income },
    { label: 'Pekerjaan Ayah', value: p.parent_occupation_father },
    { label: 'Pekerjaan Ibu', value: p.parent_occupation_mother },
    { label: 'Jumlah Tanggungan', value: p.dependents_count?.toString() ?? null },
    { label: 'Prestasi / Ranking', value: p.achievements },
  ]
  if (isYatimPiatu.value) {
    items.push(
      { label: 'Status Yatim/Piatu', value: ORPHAN_STATUS_LABELS[p.orphan_status || ''] || p.orphan_status },
      { label: 'Nama Wali', value: p.guardian_name },
      { label: 'Hubungan dengan Wali', value: p.guardian_relation },
    )
  }
  return items
})

const gradeData = computed(() => {
  const grades = registrationStore.grades
  const semesters = [1, 2, 3, 4]
  const subjects: Array<'bahasa_indonesia' | 'bahasa_inggris' | 'ppkn' | 'matematika' | 'ipa' | 'ips'> = ['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips']
  const result: Record<number, Record<string, number | null>> = {}

  for (const sem of semesters) {
    result[sem] = {}
    for (const sub of subjects) {
      const grade = grades.find(g => g.semester === sem && g.subject === sub)
      result[sem][sub] = grade?.score ?? null
    }
  }

  return result
})

const baseDocs = computed(() => {
  const slug = currentPath.value?.slug
  const allBase = ['pas_foto', 'kk', 'skl_ijazah', 'sertifikat_prestasi', 'surat_keterangan_sehat', 'surat_kelakuan_baik']
  const extraTypes = slug ? (PATH_DOCUMENTS[slug as keyof typeof PATH_DOCUMENTS] || []) : []
  const allTypes = [...allBase, ...extraTypes]
  return allTypes.map(dt => ({
    type: dt,
    label: ALL_DOCUMENT_LABELS[dt] || dt,
    url: registrationStore.documents.find(d => d.doc_type === dt)?.file_url || null,
    name: registrationStore.documents.find(d => d.doc_type === dt)?.file_name || null,
  }))
})

const allSubjects = computed(() => ['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips'] as const)
const allSemesters = computed(() => [1, 2, 3, 4])
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Review Data</h2>
      <p class="text-sm text-muted-foreground">Periksa seluruh data sebelum mengirim pendaftaran</p>
    </div>

    <!-- Jalur Pendaftaran -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Jalur Pendaftaran</h3>
      <div class="border rounded-2xl divide-y">
        <div class="flex items-start px-4 py-3">
          <span class="text-sm text-muted-foreground w-40 shrink-0">Jalur</span>
          <span class="text-sm font-medium">{{ currentPath?.name || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Personal Data -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Pribadi</h3>
        <button
          v-if="registrationStore.canEdit"
          class="text-xs text-primary hover:underline"
          @click="registrationStore.updateStep(1)"
        >
          Edit
        </button>
      </div>
      <div class="border rounded-2xl divide-y">
        <div
          v-for="item in personalData"
          :key="item.label"
          class="flex items-start px-4 py-3"
        >
          <span class="text-sm text-muted-foreground w-40 shrink-0">{{ item.label }}</span>
          <span class="text-sm font-medium">{{ item.value || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Parents -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Orang Tua</h3>
      <div class="border rounded-2xl divide-y">
        <div
          v-for="item in parentData"
          :key="item.label"
          class="flex items-start px-4 py-3"
        >
          <span class="text-sm text-muted-foreground w-40 shrink-0">{{ item.label }}</span>
          <span class="text-sm font-medium">{{ item.value || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- School -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sekolah Asal</h3>
      <div class="border rounded-2xl divide-y">
        <div
          v-for="item in schoolData"
          :key="item.label"
          class="flex items-start px-4 py-3"
        >
          <span class="text-sm text-muted-foreground w-40 shrink-0">{{ item.label }}</span>
          <span class="text-sm font-medium">{{ item.value || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Path-Specific Data (Beasiswa) -->
    <div v-if="pathData.length > 0" class="space-y-3">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {{ isYatimPiatu ? 'Data Beasiswa & Yatim Piatu' : 'Data Beasiswa' }}
      </h3>
      <div class="border rounded-2xl divide-y">
        <div
          v-for="item in pathData"
          :key="item.label"
          class="flex items-start px-4 py-3"
        >
          <span class="text-sm text-muted-foreground w-40 shrink-0">{{ item.label }}</span>
          <span class="text-sm font-medium whitespace-pre-wrap">{{ item.value || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dokumen</h3>
        <button
          v-if="registrationStore.canEdit"
          class="text-xs text-primary hover:underline"
          @click="registrationStore.updateStep(2)"
        >
          Edit
        </button>
      </div>
      <div class="border rounded-2xl divide-y">
        <div
          v-for="doc in baseDocs"
          :key="doc.type"
          class="flex items-center justify-between px-4 py-3"
        >
          <span class="text-sm text-muted-foreground">{{ doc.label }}</span>
          <a
            v-if="doc.url"
            :href="doc.url"
            target="_blank"
            class="text-sm text-primary hover:underline"
          >
            {{ doc.name || 'Lihat' }}
          </a>
          <span v-else class="text-sm text-muted-foreground">-</span>
        </div>
      </div>
    </div>

    <!-- Grades -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nilai Rapor</h3>
        <button
          v-if="registrationStore.canEdit"
          class="text-xs text-primary hover:underline"
          @click="registrationStore.updateStep(3)"
        >
          Edit
        </button>
      </div>
      <div class="border rounded-2xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-muted">
            <tr>
              <th class="text-left px-4 py-2 font-medium">Semester</th>
              <th v-for="sub in allSubjects" :key="sub" class="text-center px-3 py-2 font-medium">
                {{ SUBJECT_LABELS[sub] }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="sem in allSemesters" :key="sem">
              <td class="px-4 py-3 font-medium">{{ sem }}</td>
              <td
                v-for="sub in allSubjects"
                :key="`${sem}-${sub}`"
                class="text-center px-3 py-3"
              >
                {{ formatScore(gradeData[sem]?.[sub] ?? null) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-muted-foreground italic">Rapor asli dibawa saat verifikasi berkas</p>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4">
      <UiButton variant="outline" @click="emit('prev')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Sebelumnya
      </UiButton>
      <UiButton
        v-if="registrationStore.canEdit"
        @click="emit('submit')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Kirim Pendaftaran
      </UiButton>
    </div>
  </div>
</template>
