<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { TestSchedule } from '~/types/database'

const testSchedules = ref<TestSchedule[]>([])

onMounted(async () => {
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('test_schedules')
    .select('*')
    .order('test_number', { ascending: true })

  if (data) {
    testSchedules.value = data as TestSchedule[]
  }
})

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <section id="timeline" class="py-20 bg-muted">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Timeline Seleksi</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Ikuti tahapan pendaftaran dan seleksi dari awal hingga selesai
        </p>
      </div>

      <!-- Registration Timeline -->
      <div class="max-w-3xl mx-auto mb-16">
        <h3 class="text-lg font-semibold mb-6 text-center">Tahap Pendaftaran</h3>
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div class="relative flex gap-6 pb-10 last:pb-0">
            <div class="relative z-10 flex items-center justify-center h-12 w-12 rounded-full border-2 bg-primary border-primary text-white shrink-0">
              <span class="text-sm font-bold">1</span>
            </div>
            <div class="pt-2">
              <h3 class="text-lg font-semibold mb-1">Pendaftaran</h3>
              <p class="text-sm text-muted-foreground mb-2">Daftar akun dan lengkapi data pendaftaran</p>
              <span class="text-xs font-medium text-primary">Juli - Agustus 2026</span>
            </div>
          </div>

          <div class="relative flex gap-6 pb-10 last:pb-0">
            <div class="relative z-10 flex items-center justify-center h-12 w-12 rounded-full border-2 bg-background border-border text-muted-foreground shrink-0">
              <span class="text-sm font-bold">2</span>
            </div>
            <div class="pt-2">
              <h3 class="text-lg font-semibold mb-1">Verifikasi Berkas</h3>
              <p class="text-sm text-muted-foreground mb-2">Tim admin memverifikasi data yang dikirim</p>
              <span class="text-xs font-medium text-primary">Agustus 2026</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Timeline (from DB) -->
      <div v-if="testSchedules.length > 0" class="max-w-3xl mx-auto">
        <h3 class="text-lg font-semibold mb-6 text-center">Tahap Seleksi</h3>
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div
            v-for="(test, index) in testSchedules"
            :key="test.id"
            class="relative flex gap-6 pb-10 last:pb-0"
          >
            <!-- Step indicator -->
            <div
              :class="[
                'relative z-10 flex items-center justify-center h-12 w-12 rounded-full border-2 shrink-0',
                index === 0
                  ? 'bg-primary border-primary text-white'
                  : 'bg-background border-border text-muted-foreground',
              ]"
            >
              <span class="text-sm font-bold">{{ test.test_number }}</span>
            </div>

            <!-- Content -->
            <div class="pt-2">
              <h3 class="text-lg font-semibold mb-1">{{ test.name }}</h3>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  {{ formatDate(test.date) }}
                </span>
                <span v-if="test.time" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ test.time?.slice(0, 5) }}
                </span>
                <span v-if="test.location" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ test.location }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
