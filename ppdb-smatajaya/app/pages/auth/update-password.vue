<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Atur Password Baru - PPDB',
})

const authStore = useAuthStore()
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

async function handleUpdatePassword() {
  error.value = ''

  if (newPassword.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Konfirmasi password tidak cocok'
    return
  }

  loading.value = true

  const result = await authStore.updatePassword(newPassword.value)

  if (result.error) {
    error.value = (result.error as any).message || 'Gagal mengupdate password. Link reset mungkin sudah kedaluwarsa.'
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
        <h1 class="text-2xl font-bold">Atur Password Baru</h1>
        <p class="text-sm text-muted-foreground mt-1">Masukkan password baru Anda</p>
      </div>

      <!-- Success -->
      <div v-if="success" class="text-center py-4">
        <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Password Berhasil Diubah!</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Silakan login dengan password baru Anda.
        </p>
        <NuxtLink to="/login" class="text-sm font-medium text-primary hover:text-primary/80">
          Login Sekarang
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleUpdatePassword" class="space-y-4">
        <div v-if="error" class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {{ error }}
        </div>

        <div class="space-y-2">
          <UiLabel for="newPassword">Password Baru</UiLabel>
          <UiInputPassword
            id="newPassword"
            v-model="newPassword"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>

        <div class="space-y-2">
          <UiLabel for="confirmPassword">Konfirmasi Password</UiLabel>
          <UiInputPassword
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Ulangi password baru"
            required
          />
        </div>

        <UiButton type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Menyimpan...</span>
          <span v-else>Simpan Password Baru</span>
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
