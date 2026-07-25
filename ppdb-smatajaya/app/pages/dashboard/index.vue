<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRegistrationStore } from '~/stores/registration'
import { STATUS_CONFIG, FINAL_STATUS_CONFIG, REGISTRATION_STEPS } from '~/types'
import { formatDate, getStepStatus } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
})

useSeoMeta({
  title: 'Dashboard - PPDB',
})

const authStore = useAuthStore()
const registrationStore = useRegistrationStore()

onMounted(async () => {
  await authStore.fetchProfile()
  await registrationStore.initParticipant()
  await autoRevealAnnouncement()
})

async function autoRevealAnnouncement() {
  if (!registrationStore.participant) return
  const p = registrationStore.participant
  if (p.status !== 'accepted' || !p.admin_decision_at || !p.announcement_date) return
  if (p.announcement_revealed) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const annDate = new Date(p.announcement_date)
  annDate.setHours(0, 0, 0, 0)

  if (today >= annDate) {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('participants')
      .update({ announcement_revealed: true, updated_at: new Date().toISOString() })
      .eq('id', p.id)

    if (!error) {
      registrationStore.participant = { ...p, announcement_revealed: true }
    }
  }
}

const statusConfig = computed(() => {
  const s = registrationStore.status
  return STATUS_CONFIG[s] || STATUS_CONFIG.draft
})

const completedSteps = computed(() => {
  const step = registrationStore.currentStep
  return REGISTRATION_STEPS.filter(s => s.id < step).length
})

const progressPercent = computed(() => {
  return Math.round((completedSteps.value / REGISTRATION_STEPS.length) * 100)
})

const showResult = computed(() => {
  return registrationStore.announcementRevealed && registrationStore.hasDecision
})
</script>

<template>
  <div class="space-y-6">
    <!-- Loading Skeleton -->
    <template v-if="registrationStore.loading">
      <div>
        <div class="h-7 w-32 bg-muted rounded animate-pulse mb-1" />
        <div class="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
      <div class="bg-card rounded-3xl border p-6 animate-pulse space-y-4">
        <div class="h-5 w-40 bg-muted rounded" />
        <div class="flex gap-3 items-center">
          <div class="h-6 w-24 bg-muted rounded-full" />
          <div class="flex-1 max-w-xs space-y-2">
            <div class="h-3 w-full bg-muted rounded" />
            <div class="h-2 w-full bg-muted rounded-full" />
          </div>
        </div>
      </div>
      <div class="bg-card rounded-3xl border p-6 animate-pulse space-y-4">
        <div class="h-5 w-48 bg-muted rounded" />
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="h-10 w-10 rounded-full bg-muted shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-48 bg-muted rounded" />
            <div class="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Welcome -->
    <template v-else>
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-muted-foreground">Selamat datang, {{ authStore.profile?.full_name || 'Peserta' }}</p>
    </div>

    <!-- ==================== PHASE 2: ACCEPTED (Test Phase) ==================== -->
    <template v-if="registrationStore.isAccepted">
      <!-- Invitation Banner -->
      <div class="bg-forest-800 text-white rounded-3xl p-6 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-sm text-yellow-300 font-semibold mb-2">Undangan Fase Seleksi</p>
          <h2 class="text-xl font-bold mb-2">Selamat! Anda Lolos Verifikasi</h2>
          <p class="text-sm text-white/80 mb-4">
            Silahkan mengikuti tes seleksi sesuai jadwal yang telah ditentukan.
            Cetak kartu peserta tes untuk mengikuti proses seleksi.
          </p>
          <NuxtLink
            to="/dashboard/registration/test-card"
            class="inline-flex items-center gap-2 bg-accent text-forest-800 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Cetak Kartu Peserta Tes
          </NuxtLink>
        </div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div class="absolute bottom-0 right-8 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      <!-- Announcement Waiting (has decision but not revealed yet) -->
      <div
        v-if="registrationStore.hasDecision && !showResult"
        class="bg-accent/10 border-2 border-accent/30 rounded-3xl p-6 text-center"
      >
        <div class="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3 class="text-lg font-semibold mb-1">Menunggu Pengumuman</h3>
        <p class="text-sm text-muted-foreground mb-2">
          Keputusan admin telah diterima. Pengumuman akan ditampilkan pada:
        </p>
        <p class="text-lg font-bold text-accent">
          {{ formatDate(registrationStore.announcementDate) }}
        </p>
      </div>

      <!-- Announcement Day: Show Result -->
      <div
        v-if="showResult"
        class="rounded-3xl p-6 text-center border-2"
        :class="registrationStore.finalStatus === 'lulus'
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300'"
      >
        <div
          class="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="registrationStore.finalStatus === 'lulus'
            ? 'bg-green-100'
            : 'bg-red-100'"
        >
          <svg
            v-if="registrationStore.finalStatus === 'lulus'"
            xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"
          ><polyline points="20 6 9 17 4 12"/></svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"
          ><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </div>
        <h3 class="text-2xl font-bold mb-2">
          {{ registrationStore.finalStatus === 'lulus' ? 'SELAMAT! ANDA LULUS' : 'MAAF, ANDA TIDAK LULUS' }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ registrationStore.finalStatus === 'lulus'
            ? 'Selamat! Anda dinyatakan lulus seleksi PPDB SMAN 5 Taruna Brawijaya.'
            : 'Mohon maaf, Anda belum dapat melanjutkan ke tahap berikutnya. Terima kasih atas partisipasi Anda.'
          }}
        </p>
      </div>

      <!-- Test Timeline -->
      <div class="bg-card rounded-3xl border p-6">
        <h2 class="text-lg font-semibold mb-5">Timeline Tes Seleksi</h2>
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />

          <div class="space-y-5">
            <div
              v-for="test in registrationStore.testStatuses"
              :key="test.id"
              class="flex items-start gap-4 relative"
            >
              <!-- Status circle -->
              <div
                :class="[
                  'flex items-center justify-center h-10 w-10 rounded-full shrink-0 text-sm font-bold z-10',
                  test.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : test.status === 'active'
                      ? 'bg-accent text-forest-800 ring-4 ring-accent/30'
                      : 'bg-muted text-muted-foreground border-2 border-border',
                ]"
              >
                <svg v-if="test.status === 'completed'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-else>{{ test.test_number }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1 pb-2">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p class="text-sm font-semibold">{{ test.name }}</p>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit',
                      test.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : test.status === 'active'
                          ? 'bg-accent/20 text-forest-800'
                          : 'bg-gray-100 text-gray-500',
                    ]"
                  >
                    {{ test.status === 'completed' ? 'Selesai' : test.status === 'active' ? 'Hari Ini' : 'Menunggu' }}
                  </span>
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ formatDate(test.date) }}<span v-if="test.time"> • {{ test.time?.slice(0, 5) }}</span><span v-if="test.location"> • {{ test.location }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Print Proof Button -->
      <NuxtLink
        to="/dashboard/registration/print"
        class="block bg-card rounded-3xl border p-5 hover:border-primary/50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold mb-0.5">Cetak Bukti Pendaftaran</h3>
            <p class="text-xs text-muted-foreground">Cetak bukti pendaftaran dan undangan verifikasi berkas</p>
          </div>
        </div>
      </NuxtLink>
    </template>

    <!-- ==================== PHASE 1: REGISTRATION ==================== -->
    <template v-else>
      <!-- Status Card -->
      <div class="bg-card rounded-3xl border p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-sm text-muted-foreground mb-1">Status Pendaftaran</p>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                  statusConfig.color,
                ]"
              >
                {{ statusConfig.label }}
              </span>
            </div>
          </div>

          <div class="flex-1 max-w-xs">
            <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{{ completedSteps }}/{{ REGISTRATION_STEPS.length }}</span>
            </div>
            <UiProgress :value="progressPercent" />
          </div>
        </div>

        <!-- Admin Notes -->
        <div
          v-if="registrationStore.participant?.admin_notes"
          class="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200"
        >
          <p class="text-sm font-medium text-yellow-800 mb-1">Catatan dari Admin:</p>
          <p class="text-sm text-yellow-700">{{ registrationStore.participant.admin_notes }}</p>
        </div>
      </div>

      <!-- Steps Timeline -->
      <div class="bg-card rounded-3xl border p-6">
        <h2 class="text-lg font-semibold mb-4">Timeline Pendaftaran</h2>
        <div class="space-y-4">
          <div
            v-for="step in REGISTRATION_STEPS"
            :key="step.id"
            class="flex items-center gap-4"
          >
            <div
              :class="[
                'flex items-center justify-center h-10 w-10 rounded-full shrink-0 text-sm font-bold',
                getStepStatus(registrationStore.currentStep, step.id) === 'completed'
                  ? 'bg-primary text-white'
                  : getStepStatus(registrationStore.currentStep, step.id) === 'current'
                    ? 'bg-primary/10 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground border',
              ]"
            >
              <svg v-if="getStepStatus(registrationStore.currentStep, step.id) === 'completed'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ step.id }}</span>
            </div>
            <div>
              <p class="text-sm font-medium">{{ step.label }}</p>
              <p class="text-xs text-muted-foreground">
                {{ getStepStatus(registrationStore.currentStep, step.id) === 'completed'
                  ? 'Selesai'
                  : getStepStatus(registrationStore.currentStep, step.id) === 'current'
                    ? 'Sedang dikerjakan'
                    : 'Belum dikerjakan'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <NuxtLink
        v-if="registrationStore.canEdit"
        to="/dashboard/registration"
        class="block bg-primary text-white rounded-3xl p-6 hover:bg-primary/90 transition-colors"
      >
        <h3 class="text-lg font-semibold mb-1">
          {{ registrationStore.currentStep === 1 ? 'Mulai Pendaftaran' : 'Lanjutkan Pendaftaran' }}
        </h3>
        <p class="text-sm text-white/80">
          {{ registrationStore.currentStep === 1
            ? 'Lengkapi data pendaftaran Anda'
            : `Step ${registrationStore.currentStep} - ${REGISTRATION_STEPS[registrationStore.currentStep - 1]?.label}`
          }}
        </p>
      </NuxtLink>

      <!-- Print Proof Button (after submission) -->
      <NuxtLink
        v-if="!registrationStore.canEdit && !registrationStore.isAccepted"
        to="/dashboard/registration/print"
        class="block bg-forest-800 text-white rounded-3xl p-6 hover:bg-forest-700 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1">Cetak Bukti Pendaftaran</h3>
            <p class="text-sm text-white/70">Cetak bukti pendaftaran dan undangan verifikasi berkas</p>
          </div>
        </div>
      </NuxtLink>
    </template>
    </template>
  </div>
</template>
