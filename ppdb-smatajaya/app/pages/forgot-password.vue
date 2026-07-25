<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Reset Password - PPDB',
})

const authStore = useAuthStore()
const email = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

async function handleResetPassword() {
  error.value = ''
  loading.value = true

  const result = await authStore.resetPassword(email.value)

  if (result.error) {
    error.value = (result.error as any).message || 'Gagal mengirim email reset password'
  }
  else {
    success.value = true
  }

  loading.value = false
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="bg-card rounded-3xl border shadow-2xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold">PPDB</span>
        </div>
        <h1 class="text-2xl font-bold">Reset Password</h1>
        <p class="text-sm text-muted-foreground mt-1">Masukkan email untuk reset password</p>
      </div>

      <!-- Success -->
      <div v-if="success" class="text-center py-4">
        <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Email Terkirim!</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Silakan cek email Anda untuk link reset password.
        </p>
        <NuxtLink to="/login" class="text-sm font-medium text-primary hover:text-primary/80">
          Kembali ke Login
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleResetPassword" class="space-y-4">
        <div v-if="error" class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {{ error }}
        </div>

        <div class="space-y-2">
          <UiLabel for="email">Email</UiLabel>
          <UiInput
            id="email"
            v-model="email"
            type="email"
            placeholder="email@example.com"
            required
          />
        </div>

        <UiButton type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Memproses...</span>
          <span v-else>Kirim Link Reset</span>
        </UiButton>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        <NuxtLink to="/login" class="text-primary font-medium hover:text-primary/80">
          Kembali ke Login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
