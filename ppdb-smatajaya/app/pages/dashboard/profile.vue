<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { formatDate } from '~/utils/helpers'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Profil Saya - PPDB',
})

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchProfile()
})

const profileForm = ref({ full_name: '' })
const emailForm = ref({ email: '' })
const passwordForm = ref({ new_password: '', confirm_password: '' })

const profileSaving = ref(false)
const emailSaving = ref(false)
const passwordSaving = ref(false)

const profileSuccess = ref('')
const profileError = ref('')
const emailSuccess = ref('')
const emailError = ref('')
const passwordSuccess = ref('')
const passwordError = ref('')

onMounted(() => {
  if (authStore.profile) {
    profileForm.value.full_name = authStore.profile.full_name || ''
    emailForm.value.email = authStore.profile.email || ''
  }
})

async function handleUpdateProfile() {
  profileError.value = ''
  profileSuccess.value = ''
  if (!profileForm.value.full_name.trim()) {
    profileError.value = 'Nama tidak boleh kosong'
    return
  }
  profileSaving.value = true
  const result = await authStore.updateProfile({ full_name: profileForm.value.full_name.trim() })
  if (result.error) {
    profileError.value = (result.error as any).message || 'Gagal mengupdate profil'
  }
  else {
    profileSuccess.value = 'Profil berhasil diupdate'
  }
  profileSaving.value = false
}

async function handleUpdateEmail() {
  emailError.value = ''
  emailSuccess.value = ''
  if (!emailForm.value.email.trim()) {
    emailError.value = 'Email tidak boleh kosong'
    return
  }
  if (emailForm.value.email === authStore.profile?.email) {
    emailError.value = 'Email baru sama dengan email saat ini'
    return
  }
  emailSaving.value = true
  const result = await authStore.updateEmail(emailForm.value.email.trim())
  if (result.error) {
    emailError.value = (result.error as any).message || 'Gagal mengupdate email'
  }
  else {
    emailSuccess.value = (result as any).message || 'Email konfirmasi telah dikirim'
  }
  emailSaving.value = false
}

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  if (passwordForm.value.new_password.length < 6) {
    passwordError.value = 'Password minimal 6 karakter'
    return
  }
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    passwordError.value = 'Konfirmasi password tidak cocok'
    return
  }
  passwordSaving.value = true
  const result = await authStore.updatePassword(passwordForm.value.new_password)
  if (result.error) {
    passwordError.value = (result.error as any).message || 'Gagal mengubah password'
  }
  else {
    passwordSuccess.value = 'Password berhasil diubah'
    passwordForm.value = { new_password: '', confirm_password: '' }
  }
  passwordSaving.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Profil Saya</h1>
      <p class="text-muted-foreground text-sm">Kelola informasi akun Anda</p>
    </div>

    <!-- Profile Info Card -->
    <div class="bg-card rounded-3xl border p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="h-16 w-16 rounded-full bg-forest-800 flex items-center justify-center text-yellow-400 font-bold text-xl">
          {{ authStore.profile?.full_name?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div>
          <h2 class="text-lg font-semibold">{{ authStore.profile?.full_name || '-' }}</h2>
          <p class="text-sm text-muted-foreground">{{ authStore.profile?.email }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">Bergabung: {{ formatDate(authStore.profile?.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Edit Name -->
    <div class="bg-card rounded-3xl border p-6">
      <h3 class="text-lg font-semibold mb-4">Ubah Nama</h3>

      <div v-if="profileSuccess" class="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
        {{ profileSuccess }}
      </div>
      <div v-if="profileError" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        {{ profileError }}
      </div>

      <form @submit.prevent="handleUpdateProfile" class="flex gap-3">
        <UiInput
          v-model="profileForm.full_name"
          placeholder="Nama lengkap"
          class="flex-1"
        />
        <UiButton type="submit" :disabled="profileSaving">
          {{ profileSaving ? 'Menyimpan...' : 'Simpan' }}
        </UiButton>
      </form>
    </div>

    <!-- Change Email -->
    <div class="bg-card rounded-3xl border p-6">
      <h3 class="text-lg font-semibold mb-1">Ubah Email</h3>
      <p class="text-xs text-muted-foreground mb-4">Email saat ini: {{ authStore.profile?.email }}</p>

      <div v-if="emailSuccess" class="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
        {{ emailSuccess }}
      </div>
      <div v-if="emailError" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        {{ emailError }}
      </div>

      <form @submit.prevent="handleUpdateEmail" class="flex gap-3">
        <UiInput
          v-model="emailForm.email"
          type="email"
          placeholder="Email baru"
          class="flex-1"
        />
        <UiButton type="submit" :disabled="emailSaving">
          {{ emailSaving ? 'Mengirim...' : 'Ubah Email' }}
        </UiButton>
      </form>
    </div>

    <!-- Change Password -->
    <div class="bg-card rounded-3xl border p-6">
      <h3 class="text-lg font-semibold mb-4">Ubah Password</h3>

      <div v-if="passwordSuccess" class="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
        {{ passwordSuccess }}
      </div>
      <div v-if="passwordError" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        {{ passwordError }}
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-3">
        <UiInput
          v-model="passwordForm.new_password"
          type="password"
          placeholder="Password baru (minimal 6 karakter)"
        />
        <UiInput
          v-model="passwordForm.confirm_password"
          type="password"
          placeholder="Ulangi password baru"
        />
        <UiButton type="submit" :disabled="passwordSaving">
          {{ passwordSaving ? 'Menyimpan...' : 'Ubah Password' }}
        </UiButton>
      </form>
    </div>
  </div>
</template>
