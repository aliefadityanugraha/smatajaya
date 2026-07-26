<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Daftar - Penerimaan Taruna Baru",
});

const authStore = useAuthStore();
const form = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const error = ref("");
const loading = ref(false);
const success = ref(false);
const showErrors = ref(false);
const errors = ref<Record<string, string>>({});

// Langkah pendaftaran saat ini (0: Akun, 1: Verifikasi/Selesai)
const currentStep = ref(0);

function validate(): boolean {
  const e: Record<string, string> = {};
  if (!form.value.fullName.trim()) e.fullName = "Mohon isi nama lengkap Anda dengan benar.";
  if (!form.value.email.trim()) {
    e.email = "Email diperlukan untuk akses pendaftaran.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = "Format email tidak sesuai, mohon periksa kembali.";
  }
  if (!form.value.password) {
    e.password = "Buat password yang kuat.";
  } else if (form.value.password.length < 6) {
    e.password = "Password harus terdiri dari minimal 6 karakter.";
  }
  if (form.value.password !== form.value.confirmPassword) {
    e.confirmPassword = "Password konfirmasi tidak cocok.";
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleRegister() {
  error.value = "";
  showErrors.value = true;

  if (!validate()) return;

  loading.value = true;

  const result = await authStore.register(
    form.value.email,
    form.value.password,
    form.value.fullName,
  );

  if (result.error) {
    error.value = "Terjadi kendala saat mendaftar, mohon coba beberapa saat lagi.";
  } else {
    success.value = true;
    currentStep.value = 1;
  }

  loading.value = false;
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="bg-card rounded-3xl border shadow-2xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-forest-900">Pendaftaran</h1>
        <p class="text-sm text-muted-foreground mt-2">
          Selamat datang di portal PENTAB SMAN 5 Taruna Brawijaya
        </p>
      </div>

      <!-- Stepper -->
      <UiStepper :steps="['Buat Akun', 'Selesai']" :current-step="currentStep" />

      <!-- Success -->
      <div v-if="success" class="text-center py-8">
        <h3 class="text-xl font-bold mb-2">Akun berhasil dibuat!</h3>
        <p class="text-sm text-muted-foreground mb-6">
          Silakan cek inbox email Anda untuk verifikasi dan melanjutkan ke tahap pendaftaran berikutnya.
        </p>
        <NuxtLink
          to="/login"
          class="inline-block bg-forest-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-forest-700"
        >
          Login Sekarang
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
          {{ error }}
        </div>

        <div class="space-y-2">
          <UiLabel for="fullName">Nama Lengkap</UiLabel>
          <UiInput id="fullName" v-model="form.fullName" placeholder="Contoh: Budi Taruna" />
          <p v-if="showErrors && errors.fullName" class="text-xs text-red-500">{{ errors.fullName }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="email">Email</UiLabel>
          <UiInput id="email" v-model="form.email" type="email" placeholder="nama@email.com" />
          <p v-if="showErrors && errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="password">Password</UiLabel>
          <UiInputPassword id="password" v-model="form.password" placeholder="Minimal 6 karakter" />
          <p v-if="showErrors && errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <div class="space-y-2">
          <UiLabel for="confirmPassword">Konfirmasi Password</UiLabel>
          <UiInputPassword id="confirmPassword" v-model="form.confirmPassword" placeholder="Ulangi password" />
          <p v-if="showErrors && errors.confirmPassword" class="text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>

        <UiButton type="submit" :disabled="loading" class="w-full bg-forest-600 hover:bg-forest-700 text-white">
          {{ loading ? "Memproses..." : "Daftar Akun" }}
        </UiButton>
      </form>
    </div>
  </div>
</template>
