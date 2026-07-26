<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRegistrationStore } from '~/stores/registration'
import { REGISTRATION_STEPS } from '~/types'
import { getStepStatus } from '~/utils/helpers'
import StepPath from '~/components/registration/StepPath.vue'
import StepBiodata from '~/components/registration/StepBiodata.vue'
import StepDocuments from '~/components/registration/StepDocuments.vue'
import StepGrades from '~/components/registration/StepGrades.vue'
import StepReview from '~/components/registration/StepReview.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Pendaftaran - PPDB',
})

const registrationStore = useRegistrationStore()
const showSubmitDialog = ref(false)
const submitting = ref(false)

onMounted(async () => {
  await registrationStore.initParticipant()
})

const hasPath = computed(() => registrationStore.hasPath)
const currentStep = computed(() => registrationStore.currentStep)

function nextStep() {
  if (currentStep.value < 4) {
    registrationStore.updateStep(currentStep.value + 1)
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    registrationStore.updateStep(currentStep.value - 1)
  }
}

function onPathSelected() {
  registrationStore.updateStep(1)
}

async function handleSubmit() {
  submitting.value = true
  await registrationStore.submitRegistration()
  showSubmitDialog.value = false
  submitting.value = false
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">Pendaftaran</h1>
      <p class="text-muted-foreground">Lengkapi seluruh langkah pendaftaran di bawah ini</p>
    </div>

    <!-- Step Progress (only after path selected) -->
    <div v-if="hasPath" class="bg-card rounded-3xl border p-6">
      <div class="flex items-center justify-between">
        <template v-for="(step, index) in REGISTRATION_STEPS" :key="step.id">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold shrink-0',
                getStepStatus(currentStep, step.id) === 'completed'
                  ? 'bg-primary text-white'
                  : getStepStatus(currentStep, step.id) === 'current'
                    ? 'bg-primary/10 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground border',
              ]"
            >
              <svg v-if="getStepStatus(currentStep, step.id) === 'completed'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ step.id }}</span>
            </div>
            <span
              :class="[
                'text-sm font-medium hidden sm:inline',
                getStepStatus(currentStep, step.id) === 'current' ? 'text-foreground' : 'text-muted-foreground',
              ]"
            >
              {{ step.label }}
            </span>
          </div>

          <!-- Connector line -->
          <div
            v-if="index < REGISTRATION_STEPS.length - 1"
            :class="[
              'flex-1 h-0.5 mx-4',
              step.id < currentStep ? 'bg-primary' : 'bg-border',
            ]"
          />
        </template>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-card rounded-3xl border p-6">
      <!-- Loading: Hanya tampilkan jika belum ada data peserta sama sekali -->
      <div v-if="registrationStore.loading && !registrationStore.participant" class="space-y-4 animate-pulse">
        <div class="h-6 w-48 bg-muted rounded" />
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 6" :key="i" class="space-y-2">
            <div class="h-3 w-24 bg-muted rounded" />
            <div class="h-10 w-full bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Step 0: Choose Path -->
      <StepPath v-else-if="!hasPath" @next="onPathSelected" />

      <!-- Step 1-4: Registration Steps -->
      <template v-else>
        <StepBiodata v-if="currentStep === 1" @next="nextStep" />
        <StepDocuments v-if="currentStep === 2" @next="nextStep" @prev="prevStep" />
        <StepGrades v-if="currentStep === 3" @next="nextStep" @prev="prevStep" />
        <StepReview
          v-if="currentStep === 4"
          @prev="prevStep"
          @submit="showSubmitDialog = true"
        />
      </template>
    </div>

    <!-- Submit Dialog -->
    <div
      v-if="showSubmitDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showSubmitDialog = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-2">Kirim Pendaftaran?</h3>
        <p class="text-sm text-muted-foreground mb-6">
          Pastikan seluruh data sudah benar. Setelah dikirim, Anda tidak dapat mengubah data.
        </p>
        <div class="flex gap-3 justify-end">
          <UiButton variant="outline" @click="showSubmitDialog = false">Batal</UiButton>
          <UiButton :disabled="submitting" @click="handleSubmit">
            {{ submitting ? 'Mengirim...' : 'Kirim Pendaftaran' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
