<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRegistrationStore } from '~/stores/registration'

const emit = defineEmits<{
  next: []
}>()

const registrationStore = useRegistrationStore()
const selectedPathId = ref<string | null>(null)
const selecting = ref(false)

onMounted(async () => {
  await registrationStore.loadPaths()
  if (registrationStore.registrationPathId) {
    selectedPathId.value = registrationStore.registrationPathId
  }
})

async function handleSelect(pathId: string) {
  if (selecting.value) return
  selectedPathId.value = pathId
}

async function handleConfirm() {
  if (!selectedPathId.value || selecting.value) return
  selecting.value = true
  await registrationStore.selectPath(selectedPathId.value)
  selecting.value = false
  emit('next')
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Pilih Jalur Pendaftaran</h2>
      <p class="text-sm text-muted-foreground">
        Pilih jalur pendaftaran yang sesuai dengan kondisi Anda. Pastikan untuk memilih dengan tepat karena akan menentukan kelengkapan data yang diperlukan.
      </p>
    </div>

    <div v-if="registrationStore.availablePaths.length === 0" class="text-center py-8 text-muted-foreground">
      Memuat jalur pendaftaran...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        v-for="path in registrationStore.availablePaths"
        :key="path.id"
        :class="[
          'text-left p-6 rounded-3xl border-2 transition-all',
          selectedPathId === path.id
            ? 'border-primary bg-primary/5 ring-1 ring-primary'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
        ]"
        @click="handleSelect(path.id)"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            :class="[
              'h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold',
              selectedPathId === path.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
            ]"
          >
            <svg v-if="path.slug === 'umum'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <svg v-else-if="path.slug === 'beasiswa'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div
            v-if="selectedPathId === path.id"
            class="h-5 w-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <h3 class="font-semibold text-sm mb-1">{{ path.name }}</h3>
        <p class="text-xs text-muted-foreground leading-relaxed">{{ path.description }}</p>
      </button>
    </div>

    <!-- Confirm Button -->
    <div v-if="selectedPathId" class="flex justify-end pt-2">
      <UiButton
        :disabled="selecting || !selectedPathId"
        @click="handleConfirm"
      >
        {{ selecting ? 'Menyimpan...' : 'Pilih Jalur Ini' }}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </UiButton>
    </div>
  </div>
</template>
