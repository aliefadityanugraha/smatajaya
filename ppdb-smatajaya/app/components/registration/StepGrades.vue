<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { useRegistrationStore } from '~/stores/registration'
import { SUBJECT_LABELS, type Semester, type Subject } from '~/types'

const emit = defineEmits<{
  next: []
  prev: []
}>()

const registrationStore = useRegistrationStore()
const isInitialized = ref(false)

const subjects: Subject[] = ['bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips']
const semesters: Semester[] = [1, 2, 3, 4]
const activeTab = ref<Semester>(1)

const grades = ref<Record<string, string>>({})
const gradeErrors = ref<Record<string, string>>({})
const showErrors = ref(false)

onMounted(async () => {
  for (const sem of semesters) {
    for (const sub of subjects) {
      const key = `${sem}-${sub}`
      const existing = registrationStore.grades.find(
        g => g.semester === sem && g.subject === sub,
      )
      grades.value[key] = existing?.score?.toString() || ''
    }
  }
  await nextTick()
  isInitialized.value = true
})

const filledCount = computed(() => {
  return Object.values(grades.value).filter(v => v.trim() !== '').length
})

const hasAnyGrade = computed(() => filledCount.value > 0)

const semesterFilledCount = computed(() => {
  return (sem: Semester) => {
    return subjects.filter(sub => grades.value[`${sem}-${sub}`]?.trim() !== '').length
  }
})

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
  if (!isInitialized.value) return
  debouncedSave()
}, { deep: true })
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Input Nilai Rapor</h2>
      <p class="text-sm text-muted-foreground">Masukkan nilai rapor semester 1, 2, 3, dan 4 (minimal 1 nilai terisi)</p>
    </div>

    <!-- Semester Tabs -->
    <div class="border-b border-border">
      <div class="flex gap-1 -mb-px overflow-x-auto">
        <button
          v-for="sem in semesters"
          :key="sem"
          :class="[
            'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg',
            activeTab === sem
              ? 'text-primary bg-card border border-border border-b-transparent -mb-px z-10'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activeTab = sem"
        >
          <span>Semester {{ sem }}</span>
          <span
            :class="[
              'ml-1.5 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-semibold',
              semesterFilledCount(sem) === 6
                ? 'bg-green-100 text-green-700'
                : semesterFilledCount(sem) > 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-muted text-muted-foreground',
            ]"
          >
            {{ semesterFilledCount(sem) }}/6
          </span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-card border rounded-2xl p-5">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Semester {{ activeTab }}
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="subject in subjects"
          :key="`${activeTab}-${subject}`"
          class="space-y-2"
        >
          <UiLabel :for="`grade-${activeTab}-${subject}`" class="text-xs">
            {{ SUBJECT_LABELS[subject] }}
          </UiLabel>
          <UiInput
            :id="`grade-${activeTab}-${subject}`"
            v-model="grades[`${activeTab}-${subject}`]"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
            :class="showErrors && gradeErrors[`${activeTab}-${subject}`] ? 'border-red-500 focus-visible:ring-red-500' : ''"
          />
          <p v-if="showErrors && gradeErrors[`${activeTab}-${subject}`]" class="text-xs text-destructive">
            {{ gradeErrors[`${activeTab}-${subject}`] }}
          </p>
        </div>
      </div>

      <!-- Quick Nav -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div class="flex gap-1.5">
          <button
            v-for="sem in semesters"
            :key="sem"
            :class="[
              'h-2 rounded-full transition-all',
              sem === activeTab ? 'w-6 bg-primary' : semesterFilledCount(sem) === 6 ? 'w-2 bg-green-400' : semesterFilledCount(sem) > 0 ? 'w-2 bg-yellow-400' : 'w-2 bg-muted-foreground/30',
            ]"
            @click="activeTab = sem"
          />
        </div>
        <span class="text-xs text-muted-foreground">
          {{ filledCount }}/24 kolom terisi
        </span>
      </div>
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
