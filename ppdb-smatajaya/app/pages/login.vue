<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Login - PPDB',
})

const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
})
const error = ref('')
const loading = ref(false)
const showErrors = ref(false)
const errors = ref<Record<string, string>>({})

const isValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
    && form.value.password.length > 0
})

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.email.trim()) {
    e.email = 'Email wajib diisi'
  }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Format email tidak valid'
  }
  if (!form.value.password) {
    e.password = 'Password wajib diisi'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleLogin() {
  error.value = ''
  showErrors.value = true

  if (!validate()) return

  loading.value = true

  const result = await authStore.login(form.value.email, form.value.password)

  if (result.error) {
    error.value = (result.error as any).message || 'Email atau password salah'
  }
  else {
    await authStore.fetchProfile()
    const redirect = authStore.isAdmin ? '/admin' : '/dashboard'
    await navigateTo(redirect, { replace: true })
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
        <h1 class="text-3xl font-bold text-forest-900">Selamat Datang Kembali</h1>
        <p class="text-sm text-muted-foreground mt-2">Silakan masuk untuk melanjutkan pendaftaran PPDB</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
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
          <div class="flex items-center justify-between">
            <UiLabel for="password">Password <span class="text-destructive">*</span></UiLabel>
            <NuxtLink to="/forgot-password" class="text-xs text-primary hover:text-primary/80">
              Lupa password?
            </NuxtLink>
          </div>
          <UiInput
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
          />
          <p v-if="showErrors && errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
        </div>

        <UiButton type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Memproses...</span>
          <span v-else>Login</span>
        </UiButton>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        Belum punya akun?
        <NuxtLink to="/register" class="text-primary font-medium hover:text-primary/80">
          Daftar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
