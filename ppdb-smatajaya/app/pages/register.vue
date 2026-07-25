<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Daftar - PPDB',
})

const authStore = useAuthStore()
const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const error = ref('')
const loading = ref(false)
const success = ref(false)
const showErrors = ref(false)
const errors = ref<Record<string, string>>({})

const isValid = computed(() => {
  return form.value.fullName.trim().length > 0
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
    && form.value.password.length >= 6
    && form.value.password === form.value.confirmPassword
})

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.fullName.trim()) e.fullName = 'Nama wajib diisi'
  if (!form.value.email.trim()) {
    e.email = 'Email wajib diisi'
  }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Format email tidak valid'
  }
  if (!form.value.password) {
    e.password = 'Password wajib diisi'
  }
  else if (form.value.password.length < 6) {
    e.password = 'Password minimal 6 karakter'
  }
  if (!form.value.confirmPassword) {
    e.confirmPassword = 'Konfirmasi password wajib diisi'
  }
  else if (form.value.password !== form.value.confirmPassword) {
    e.confirmPassword = 'Password tidak cocok'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleRegister() {
  error.value = ''
  showErrors.value = true

  if (!validate()) return

  loading.value = true

  const result = await authStore.register(
    form.value.email,
    form.value.password,
    form.value.fullName,
  )

  if (result.error) {
    error.value = (result.error as any).message || 'Gagal mendaftar'
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
        <div class="mx-auto mb-4 flex justify-center">
          <img src="/logo-tiga.png" alt="Logo" class="h-20 w-20 object-contain" />
        </div>
        <h1 class="text-3xl font-bold text-forest-900">Buat Akun Baru</h1>
        <p class="text-sm text-muted-foreground mt-2">Mari bergabung dengan SMAN 5 Taruna Brawijaya</p>
      </div>

      <!-- Success -->
      <div v-if="success" class="text-center py-4">
        <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Pendaftaran Berhasil!</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Silakan cek email Anda untuk verifikasi akun, lalu login.
        </p>
        <NuxtLink to="/login" class="text-sm font-medium text-primary hover:text-primary/80">
          Login Sekarang
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {{ error }}
        </div>

        <div class="space-y-2">
          <UiLabel for="fullName">Nama Lengkap <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="fullName"
            v-model="form.fullName"
            placeholder="Masukkan nama lengkap"
          />
          <p v-if="showErrors && errors.fullName" class="text-xs text-destructive">{{ errors.fullName }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="email">Email <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="email"
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
          />
          <p v-if="showErrors && errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="password">Password <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Minimal 6 karakter"
          />
          <p v-if="showErrors && errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="confirmPassword">Konfirmasi Password <span class="text-destructive">*</span></UiLabel>
          <UiInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Ulangi password"
          />
          <p v-if="showErrors && errors.confirmPassword" class="text-xs text-destructive">{{ errors.confirmPassword }}</p>
        </div>

        <UiButton type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Memproses...</span>
          <span v-else>Daftar</span>
        </UiButton>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        Sudah punya akun?
        <NuxtLink to="/login" class="text-primary font-medium hover:text-primary/80">
          Login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
