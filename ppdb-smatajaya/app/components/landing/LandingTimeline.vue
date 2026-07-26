<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { TestSchedule } from '~/types/database'
import { formatDate } from '~/utils/helpers'
import { Calendar, Clock, MapPin } from 'lucide-vue-next'

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
                  <Calendar :size="14" />
                  {{ formatDate(test.date) }}
                </span>
                <span v-if="test.time" class="flex items-center gap-1">
                  <Clock :size="14" />
                  {{ test.time?.slice(0, 5) }}
                </span>
                <span v-if="test.location" class="flex items-center gap-1">
                  <MapPin :size="14" />
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
