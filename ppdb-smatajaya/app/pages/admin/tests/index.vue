<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: 'Jadwal Tes - Admin PPDB',
})

const adminStore = useAdminStore()
const editingTest = ref<string | null>(null)
const actionLoading = ref(false)
const saveError = ref('')

const form = ref({
  name: '',
  date: '',
  time: '',
  location: '',
})

onMounted(async () => {
  await adminStore.fetchTestSchedules()
})

function openEdit(id: string) {
  const test = adminStore.testSchedules.find(t => t.id === id)
  if (!test) return
  form.value = {
    name: test.name,
    date: test.date,
    time: test.time ? test.time.slice(0, 5) : '',
    location: test.location || '',
  }
  editingTest.value = id
  saveError.value = ''
}

async function handleSubmit() {
  if (!editingTest.value) return
  actionLoading.value = true
  saveError.value = ''
  const { error } = await adminStore.updateTestSchedule(editingTest.value, {
    name: form.value.name,
    date: form.value.date,
    time: form.value.time || null,
    location: form.value.location || null,
  })
  actionLoading.value = false
  if (error) {
    saveError.value = error.message || 'Gagal menyimpan jadwal tes'
    return
  }
  editingTest.value = null
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(timeStr: string | null) {
  if (!timeStr) return '-'
  return timeStr.slice(0, 5)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Jadwal Tes</h1>
        <p class="text-muted-foreground">Kelola jadwal tes fase 2 PPDB</p>
      </div>
    </div>

    <div v-if="adminStore.testSchedulesLoading" class="space-y-3">
      <div v-for="i in 6" :key="i" class="bg-card rounded-3xl border p-5 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-muted" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-48 bg-muted rounded" />
            <div class="flex gap-4">
              <div class="h-3 w-32 bg-muted rounded" />
              <div class="h-3 w-16 bg-muted rounded" />
              <div class="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
          <div class="h-8 w-16 bg-muted rounded-lg" />
        </div>
      </div>
    </div>

    <div v-else-if="adminStore.sortedTestSchedules.length === 0" class="text-center py-12 text-muted-foreground">
      Belum ada jadwal tes
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="test in adminStore.sortedTestSchedules"
        :key="test.id"
        class="bg-card rounded-3xl border p-5 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {{ test.test_number }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold mb-1">{{ test.name }}</h3>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                {{ formatDate(test.date) }}
              </span>
              <span v-if="test.time" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ formatTime(test.time) }}
              </span>
              <span v-if="test.location" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ test.location }}
              </span>
            </div>
          </div>
        </div>

        <UiButton
          variant="ghost"
          size="sm"
          class="shrink-0"
          @click="openEdit(test.id)"
        >
          Edit
        </UiButton>
      </div>
    </div>

    <!-- Edit Dialog -->
    <div
      v-if="editingTest"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="editingTest = null"
    >
      <div class="bg-card rounded-3xl p-6 max-w-lg mx-4 shadow-xl w-full">
        <h3 class="text-lg font-semibold mb-4">Edit Jadwal Tes</h3>

        <div class="space-y-4">
          <div class="space-y-2">
            <UiLabel for="testName">Nama Tes</UiLabel>
            <UiInput id="testName" v-model="form.name" />
          </div>

          <div class="space-y-2">
            <UiLabel for="testDate">Tanggal</UiLabel>
            <input
              id="testDate"
              v-model="form.date"
              type="date"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <UiLabel for="testTime">Waktu</UiLabel>
            <input
              id="testTime"
              v-model="form.time"
              type="time"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <UiLabel for="testLocation">Tempat</UiLabel>
            <UiInput id="testLocation" v-model="form.location" placeholder="Lokasi tes" />
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <UiButton variant="outline" @click="editingTest = null">Batal</UiButton>
          <UiButton
            :disabled="actionLoading || !form.name.trim() || !form.date"
            @click="handleSubmit"
          >
            {{ actionLoading ? 'Menyimpan...' : 'Simpan' }}
          </UiButton>
        </div>

        <p v-if="saveError" class="text-sm text-red-600 mt-3 text-center">{{ saveError }}</p>
      </div>
    </div>
  </div>
</template>
