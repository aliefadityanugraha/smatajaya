<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { useRegistrationStore } from '~/stores/registration'
import { GENDER_OPTIONS, RELIGION_OPTIONS } from '~/types'

const emit = defineEmits<{
  next: []
}>()

const registrationStore = useRegistrationStore()

const form = ref({
  nik: '',
  nisn: '',
  full_name: '',
  place_of_birth: '',
  date_of_birth: '',
  gender: '',
  religion: '',
  address: '',
  phone_number: '',
  father_name: '',
  mother_name: '',
  school_name: '',
  npsn: '',
})

const pathForm = ref({
  parent_income: '',
  parent_occupation_father: '',
  parent_occupation_mother: '',
  dependents_count: '',
  achievements: '',
  orphan_status: '',
  guardian_name: '',
  guardian_relation: '',
})

const errors = ref<Record<string, string>>({})
const showErrors = ref(false)

const currentPathSlug = computed(() => {
  const pathId = registrationStore.registrationPathId
  if (!pathId) return null
  const path = registrationStore.availablePaths.find(p => p.id === pathId)
  return path?.slug || null
})

const isBeasiswa = computed(() =>
  currentPathSlug.value === 'beasiswa' || currentPathSlug.value === 'beasiswa_yatim_piatu',
)

const isYatimPiatu = computed(() => currentPathSlug.value === 'beasiswa_yatim_piatu')

const ORPHAN_STATUS_OPTIONS = [
  { value: 'yatim', label: 'Yatim (Ayah meninggal)' },
  { value: 'piatu', label: 'Piatu (Ibu meninggal)' },
  { value: 'yatim_piatu', label: 'Yatim Piatu (Kedua orang tua meninggal)' },
]

onMounted(() => {
  if (registrationStore.biodata) {
    const b = registrationStore.biodata
    form.value.nik = b.nik || ''
    form.value.nisn = b.nisn || ''
    form.value.full_name = b.full_name || ''
    form.value.place_of_birth = b.place_of_birth || ''
    form.value.date_of_birth = b.date_of_birth || ''
    form.value.gender = b.gender || ''
    form.value.religion = b.religion || ''
    form.value.address = b.address || ''
    form.value.phone_number = b.phone_number || ''
  }
  if (registrationStore.parents) {
    form.value.father_name = registrationStore.parents.father_name || ''
    form.value.mother_name = registrationStore.parents.mother_name || ''
  }
  if (registrationStore.school) {
    form.value.school_name = registrationStore.school.school_name || ''
    form.value.npsn = registrationStore.school.npsn || ''
  }

  const p = registrationStore.participant
  if (p) {
    pathForm.value.parent_income = p.parent_income || ''
    pathForm.value.parent_occupation_father = p.parent_occupation_father || ''
    pathForm.value.parent_occupation_mother = p.parent_occupation_mother || ''
    pathForm.value.dependents_count = p.dependents_count?.toString() || ''
    pathForm.value.achievements = p.achievements || ''
    pathForm.value.orphan_status = p.orphan_status || ''
    pathForm.value.guardian_name = p.guardian_name || ''
    pathForm.value.guardian_relation = p.guardian_relation || ''
  }
})

function validate(): boolean {
  const e: Record<string, string> = {}

  if (!form.value.full_name.trim()) e.full_name = 'Nama lengkap wajib diisi'

  if (!form.value.nik.trim()) {
    e.nik = 'NIK wajib diisi'
  }
  else if (!/^\d{16}$/.test(form.value.nik.trim())) {
    e.nik = 'NIK harus 16 digit angka'
  }

  if (!form.value.nisn.trim()) {
    e.nisn = 'NISN wajib diisi'
  }
  else if (!/^\d{10}$/.test(form.value.nisn.trim())) {
    e.nisn = 'NISN harus 10 digit angka'
  }

  if (!form.value.place_of_birth.trim()) e.place_of_birth = 'Tempat lahir wajib diisi'
  if (!form.value.date_of_birth) e.date_of_birth = 'Tanggal lahir wajib diisi'
  if (!form.value.gender) e.gender = 'Jenis kelamin wajib dipilih'
  if (!form.value.religion) e.religion = 'Agama wajib dipilih'
  if (!form.value.address.trim()) e.address = 'Alamat wajib diisi'

  if (!form.value.phone_number.trim()) {
    e.phone_number = 'Nomor HP wajib diisi'
  }
  else if (!/^\d+$/.test(form.value.phone_number.trim())) {
    e.phone_number = 'Nomor HP harus berupa angka'
  }

  if (!form.value.father_name.trim()) e.father_name = 'Nama ayah wajib diisi'
  if (!form.value.mother_name.trim()) e.mother_name = 'Nama ibu wajib diisi'
  if (!form.value.school_name.trim()) e.school_name = 'Nama sekolah wajib diisi'

  if (!form.value.npsn.trim()) {
    e.npsn = 'NPSN wajib diisi'
  }
  else if (!/^\d+$/.test(form.value.npsn.trim())) {
    e.npsn = 'NPSN harus berupa angka'
  }

  if (isBeasiswa.value) {
    if (!pathForm.value.parent_income.trim()) e.parent_income = 'Penghasilan orang tua wajib diisi'
    if (!pathForm.value.parent_occupation_father.trim()) e.parent_occupation_father = 'Pekerjaan ayah wajib diisi'
    if (!pathForm.value.parent_occupation_mother.trim()) e.parent_occupation_mother = 'Pekerjaan ibu wajib diisi'
    if (!pathForm.value.dependents_count.trim()) e.dependents_count = 'Jumlah tanggungan wajib diisi'
  }

  if (isYatimPiatu.value) {
    if (!pathForm.value.orphan_status) e.orphan_status = 'Status yatim/piatu wajib dipilih'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

const isValid = computed(() => {
  const baseValid = !!form.value.full_name.trim()
    && /^\d{16}$/.test(form.value.nik.trim())
    && /^\d{10}$/.test(form.value.nisn.trim())
    && !!form.value.place_of_birth.trim()
    && !!form.value.date_of_birth
    && !!form.value.gender
    && !!form.value.religion
    && !!form.value.address.trim()
    && /^\d+$/.test(form.value.phone_number.trim())
    && !!form.value.father_name.trim()
    && !!form.value.mother_name.trim()
    && !!form.value.school_name.trim()
    && /^\d+$/.test(form.value.npsn.trim())

  if (!baseValid) return false

  if (isBeasiswa.value) {
    if (!pathForm.value.parent_income.trim()) return false
    if (!pathForm.value.parent_occupation_father.trim()) return false
    if (!pathForm.value.parent_occupation_mother.trim()) return false
    if (!pathForm.value.dependents_count.trim()) return false
  }

  if (isYatimPiatu.value) {
    if (!pathForm.value.orphan_status) return false
  }

  return true
})

function handleNext() {
  if (!validate()) {
    showErrors.value = true
    return
  }
  showErrors.value = true
  emit('next')
}

function filterNumeric(e: KeyboardEvent) {
  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }
}

function onInputNumeric(field: 'nik' | 'nisn' | 'phone_number' | 'npsn', event: Event) {
  const input = event.target as HTMLInputElement
  form.value[field] = input.value.replace(/\D/g, '')
}

const debouncedSaveBiodata = useDebounceFn(async () => {
  await registrationStore.saveAllBiodata(form.value)
}, 1000)

const debouncedSavePathData = useDebounceFn(async () => {
  const data: Record<string, unknown> = {}
  data.parent_income = pathForm.value.parent_income || null
  data.parent_occupation_father = pathForm.value.parent_occupation_father || null
  data.parent_occupation_mother = pathForm.value.parent_occupation_mother || null
  data.dependents_count = pathForm.value.dependents_count ? parseInt(pathForm.value.dependents_count) : null
  data.achievements = pathForm.value.achievements || null
  if (isYatimPiatu.value) {
    data.orphan_status = pathForm.value.orphan_status || null
    data.guardian_name = pathForm.value.guardian_name || null
    data.guardian_relation = pathForm.value.guardian_relation || null
  }
  await registrationStore.savePathData(data)
}, 1000)

watch(form, () => {
  debouncedSaveBiodata()
}, { deep: true })

watch(pathForm, () => {
  if (isBeasiswa.value) {
    debouncedSavePathData()
  }
}, { deep: true })
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Biodata</h2>
      <p class="text-sm text-muted-foreground">Lengkapi data pribadi, orang tua, dan sekolah asal</p>
    </div>

    <!-- Data Pribadi -->
    <div class="space-y-4">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Pribadi</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="nik">NIK <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="nik"
            :model-value="form.nik"
            placeholder="16 digit angka"
            maxlength="16"
            @keydown="filterNumeric"
            @input="onInputNumeric('nik', $event)"
          />
          <p v-if="showErrors && errors.nik" class="text-xs text-destructive">{{ errors.nik }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="nisn">NISN <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="nisn"
            :model-value="form.nisn"
            placeholder="10 digit angka"
            maxlength="10"
            @keydown="filterNumeric"
            @input="onInputNumeric('nisn', $event)"
          />
          <p v-if="showErrors && errors.nisn" class="text-xs text-destructive">{{ errors.nisn }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <UiLabel for="fullName">Nama Lengkap <span class="text-destructive">*</span></UiLabel>
        <UiInput id="fullName" v-model="form.full_name" placeholder="Nama lengkap sesuai ijazah" />
        <p v-if="showErrors && errors.full_name" class="text-xs text-destructive">{{ errors.full_name }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="placeOfBirth">Tempat Lahir <span class="text-destructive">*</span></UiLabel>
          <UiInput id="placeOfBirth" v-model="form.place_of_birth" placeholder="Kota kelahiran" />
          <p v-if="showErrors && errors.place_of_birth" class="text-xs text-destructive">{{ errors.place_of_birth }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="dateOfBirth">Tanggal Lahir <span class="text-destructive">*</span></UiLabel>
          <UiInput id="dateOfBirth" v-model="form.date_of_birth" type="date" />
          <p v-if="showErrors && errors.date_of_birth" class="text-xs text-destructive">{{ errors.date_of_birth }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="gender">Jenis Kelamin <span class="text-destructive">*</span></UiLabel>
          <UiSelect
            id="gender"
            v-model="form.gender"
            :options="GENDER_OPTIONS"
            placeholder="Pilih jenis kelamin"
          />
          <p v-if="showErrors && errors.gender" class="text-xs text-destructive">{{ errors.gender }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="religion">Agama <span class="text-destructive">*</span></UiLabel>
          <UiSelect
            id="religion"
            v-model="form.religion"
            :options="RELIGION_OPTIONS.map(r => ({ value: r, label: r }))"
            placeholder="Pilih agama"
          />
          <p v-if="showErrors && errors.religion" class="text-xs text-destructive">{{ errors.religion }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <UiLabel for="address">Alamat <span class="text-destructive">*</span></UiLabel>
        <textarea
          id="address"
          v-model="form.address"
          placeholder="Alamat lengkap"
          rows="3"
          class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p v-if="showErrors && errors.address" class="text-xs text-destructive">{{ errors.address }}</p>
      </div>

      <div class="space-y-2">
        <UiLabel for="phoneNumber">Nomor HP <span class="text-destructive">*</span></UiLabel>
        <UiInput
          id="phoneNumber"
          :model-value="form.phone_number"
          placeholder="08xxxxxxxxxx"
          @keydown="filterNumeric"
          @input="onInputNumeric('phone_number', $event)"
        />
        <p v-if="showErrors && errors.phone_number" class="text-xs text-destructive">{{ errors.phone_number }}</p>
      </div>
    </div>

    <!-- Data Orang Tua -->
    <div class="space-y-4">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Orang Tua</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="fatherName">Nama Ayah <span class="text-destructive">*</span></UiLabel>
          <UiInput id="fatherName" v-model="form.father_name" placeholder="Nama ayah" />
          <p v-if="showErrors && errors.father_name" class="text-xs text-destructive">{{ errors.father_name }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="motherName">Nama Ibu <span class="text-destructive">*</span></UiLabel>
          <UiInput id="motherName" v-model="form.mother_name" placeholder="Nama ibu" />
          <p v-if="showErrors && errors.mother_name" class="text-xs text-destructive">{{ errors.mother_name }}</p>
        </div>
      </div>
    </div>

    <!-- Sekolah Asal -->
    <div class="space-y-4">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sekolah Asal</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="schoolName">Nama Sekolah <span class="text-destructive">*</span></UiLabel>
          <UiInput id="schoolName" v-model="form.school_name" placeholder="Nama sekolah asal" />
          <p v-if="showErrors && errors.school_name" class="text-xs text-destructive">{{ errors.school_name }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="npsn">NPSN <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="npsn"
            :model-value="form.npsn"
            placeholder="Nomor Pokok Sekolah Nasional"
            @keydown="filterNumeric"
            @input="onInputNumeric('npsn', $event)"
          />
          <p v-if="showErrors && errors.npsn" class="text-xs text-destructive">{{ errors.npsn }}</p>
        </div>
      </div>
    </div>

    <!-- Data Ekonomi Keluarga (Beasiswa & Yatim Piatu) -->
    <div v-if="isBeasiswa" class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Ekonomi Keluarga</h3>
        <p class="text-xs text-muted-foreground mt-1">Wajib diisi untuk jalur beasiswa</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="parentIncome">Penghasilan Orang Tua / Bulan <span class="text-destructive">*</span></UiLabel>
          <UiInput id="parentIncome" v-model="pathForm.parent_income" placeholder="Contoh: Rp 1.500.000" />
          <p v-if="showErrors && errors.parent_income" class="text-xs text-destructive">{{ errors.parent_income }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="dependents">Jumlah Tanggungan <span class="text-destructive">*</span></UiLabel>
          <UiInput id="dependents" v-model="pathForm.dependents_count" type="number" placeholder="Jumlah anak yang ditanggung" />
          <p v-if="showErrors && errors.dependents_count" class="text-xs text-destructive">{{ errors.dependents_count }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="fatherOccupation">Pekerjaan Ayah <span class="text-destructive">*</span></UiLabel>
          <UiInput id="fatherOccupation" v-model="pathForm.parent_occupation_father" placeholder="Contoh: Buruh harian" />
          <p v-if="showErrors && errors.parent_occupation_father" class="text-xs text-destructive">{{ errors.parent_occupation_father }}</p>
        </div>
        <div class="space-y-2">
          <UiLabel for="motherOccupation">Pekerjaan Ibu <span class="text-destructive">*</span></UiLabel>
          <UiInput id="motherOccupation" v-model="pathForm.parent_occupation_mother" placeholder="Contoh: Ibu rumah tangga" />
          <p v-if="showErrors && errors.parent_occupation_mother" class="text-xs text-destructive">{{ errors.parent_occupation_mother }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <UiLabel for="achievements">Prestasi / Ranking</UiLabel>
        <textarea
          id="achievements"
          v-model="pathForm.achievements"
          placeholder="Sebutkan prestasi akademik/non-akademik, ranking di kelas, piagam, dll."
          rows="3"
          class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>

    <!-- Data Yatim Piatu (hanya jalur beasiswa_yatim_piatu) -->
    <div v-if="isYatimPiatu" class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Yatim Piatu</h3>
        <p class="text-xs text-muted-foreground mt-1">Wajib diisi untuk jalur beasiswa yatim piatu</p>
      </div>

      <div class="space-y-2">
        <UiLabel for="orphanStatus">Status Yatim/Piatu <span class="text-destructive">*</span></UiLabel>
        <UiSelect
          id="orphanStatus"
          v-model="pathForm.orphan_status"
          :options="ORPHAN_STATUS_OPTIONS"
          placeholder="Pilih status"
        />
        <p v-if="showErrors && errors.orphan_status" class="text-xs text-destructive">{{ errors.orphan_status }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiLabel for="guardianName">Nama Wali</UiLabel>
          <UiInput id="guardianName" v-model="pathForm.guardian_name" placeholder="Nama wali (jika ada)" />
        </div>
        <div class="space-y-2">
          <UiLabel for="guardianRelation">Hubungan dengan Wali</UiLabel>
          <UiInput id="guardianRelation" v-model="pathForm.guardian_relation" placeholder="Contoh: Paman, Kakek, dll." />
        </div>
      </div>
    </div>

    <!-- Error summary -->
    <div v-if="showErrors && !isValid" class="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        <p class="text-sm text-red-700">Mohon lengkapi semua field yang wajib ditandai (<span class="text-destructive">*</span>)</p>
      </div>
    </div>

    <!-- Next Button -->
    <div class="flex justify-end pt-4">
      <UiButton @click="handleNext">
        Selanjutnya
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </UiButton>
    </div>
  </div>
</template>
