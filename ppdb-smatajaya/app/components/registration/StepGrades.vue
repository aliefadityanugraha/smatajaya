<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { useRegistrationStore } from '~/stores/registration'
import { SUBJECT_LABELS, type Semester, type Subject } from '~/types'

const emit = defineEmits<{
  next: []
  prev: []
}>()

const registrationStore = useRegistrationStore()

const subjects: Subject[] = ['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips']
const semesters: Semester[] = [1, 2, 3, 4]

const grades = ref<Record<string, string>>({})
const gradeErrors = ref<Record<string, string>>({})
const showErrors = ref(false)

onMounted(() => {
  for (const sem of semesters) {
    for (const sub of subjects) {
      const key = `${sem}-${sub}`
      const existing = registrationStore.grades.find(
        g => g.semester === sem && g.subject === sub,
      )
      grades.value[key] = existing?.score?.toString() || ''
    }
  }
})

const filledCount = computed(() => {
  return Object.values(grades.value).filter(v => v.trim() !== '').length
})

const hasAnyGrade = computed(() => filledCount.value > 0)

function validate(): boolean {
  const e: Record<string, string> = {}

  for (const sem of semesters) {
    for (const sub of subjects) {
      const key = `${sem}-${sub}`
      const val = grades.value[key]
      if (val.trim() !== '') {
        const num = parseFloat(val)
        if (isNaN(num) || num < 0 || num > 100) {
          e[key] = 'Nilai harus 0-100'
        }
      }
    }
  }

  if (!hasAnyGrade.value) {
    e._general = 'Minimal masukkan 1 nilai rapor'
  }

  gradeErrors.value = e
  return Object.keys(e).length === 0
}

const isValid = computed(() => {
  if (!hasAnyGrade.value) return false
  for (const sem of semesters) {
    for (const sub of subjects) {
      const key = `${sem}-${sub}`
      const val = grades.value[key]
      if (val.trim() !== '') {
        const num = parseFloat(val)
        if (isNaN(num) || num < 0 || num > 100) return false
      }
    }
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

const debouncedSave = useDebounceFn(async () => {
  const gradesData = []
  for (const sem of semesters) {
    for (const sub of subjects) {
      const key = `${sem}-${sub}`
      const val = grades.value[key]
      gradesData.push({
        semester: sem,
        subject: sub,
        score: val ? parseFloat(val) : null,
      })
    }
  }
  await registrationStore.saveGrades(gradesData)
}, 1000)

watch(grades, () => {
  debouncedSave()
}, { deep: true })
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Input Nilai Rapor</h2>
      <p class="text-sm text-muted-foreground">Masukkan nilai rapor semester 1, 2, 3, dan 4 (minimal 1 nilai terisi)</p>
    </div>

    <div class="space-y-6">
      <div v-for="semester in semesters" :key="semester" class="space-y-3">
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Semester {{ semester }}
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="subject in subjects"
            :key="`${semester}-${subject}`"
            class="space-y-2"
          >
            <UiLabel :for="`grade-${semester}-${subject}`" class="text-xs">
              {{ SUBJECT_LABELS[subject] }}
            </UiLabel>
            <UiInput
              :id="`grade-${semester}-${subject}`"
              v-model="grades[`${semester}-${subject}`]"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0 - 100"
              :class="showErrors && gradeErrors[`${semester}-${subject}`] ? 'border-red-500 focus-visible:ring-red-500' : ''"
            />
            <p v-if="showErrors && gradeErrors[`${semester}-${subject}`]" class="text-xs text-destructive">
              {{ gradeErrors[`${semester}-${subject}`] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filled count -->
    <div class="text-sm text-muted-foreground">
      Terisi: <span class="font-semibold" :class="hasAnyGrade ? 'text-green-600' : 'text-red-600'">{{ filledCount }}</span> / 24 kolom
    </div>

    <!-- Validation Warning -->
    <div v-if="showErrors && !hasAnyGrade" class="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        <p class="text-sm text-red-700"><strong>Minimal masukkan 1 nilai rapor</strong> untuk melanjutkan.</p>
      </div>
    </div>

    <!-- Note -->
    <div class="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p class="text-sm text-yellow-800">
          <strong>Catatan:</strong> Rapor asli semester 1, 2, 3, dan 4 harus dibawa pada saat verifikasi berkas di sekolah.
        </p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4">
      <UiButton variant="outline" @click="emit('prev')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Sebelumnya
      </UiButton>
      <UiButton @click="handleNext">
        Selanjutnya
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </UiButton>
    </div>
  </div>
</template>
