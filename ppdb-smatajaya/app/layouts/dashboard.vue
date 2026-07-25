<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabaseUser } from '#imports'
import { getInitials } from '~/utils/helpers'
import { useAuthStore } from '~/stores/auth'
import { useRegistrationStore } from '~/stores/registration'
import { ADMIN_SIDEBAR_LINKS } from '~/utils/constants'

const route = useRoute()
const user = useSupabaseUser()
const authStore = useAuthStore()
const registrationStore = useRegistrationStore()

const isAdmin = computed(() => authStore.isAdmin)
const profile = computed(() => authStore.profile)

const navLinks = computed(() => {
  if (isAdmin.value) return ADMIN_SIDEBAR_LINKS
  const links = [
    { label: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard' },
  ]
  const status = registrationStore.status
  if (['draft', 'needs_revision'].includes(status) || !registrationStore.isSubmitted) {
    links.push({ label: 'Pendaftaran', to: '/dashboard/registration', icon: 'FileText' })
  }
  if (status === 'submitted' || status === 'waiting_verification') {
    links.push({ label: 'Bukti Pendaftaran', to: '/dashboard/registration/print', icon: 'Printer' })
  }
  if (status === 'accepted') {
    links.push({ label: 'Kartu Peserta Tes', to: '/dashboard/registration/test-card', icon: 'Printer' })
  }
  return links
})

const showSaveStatus = computed(() => registrationStore.participant !== null)

async function handleLogout() {
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f4] flex flex-col">
    <!-- Top Bar -->
    <header
      class="sticky top-0 z-50 bg-forest-800 drop-shadow-2xl shadow-green-900/50"
      style="background-image: url('/header.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: top center;"
    >
      <div class="container mx-auto px-5 py-3 flex items-center justify-between relative z-10">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            alt="Logo SMAN 5 Taruna Brawijaya"
            class="h-10 object-contain"
            style="max-width: 110px"
            src="/logo-tiga.png"
          />
          <div class="hidden md:block">
            <p class="font-bold text-xs leading-tight tracking-wide uppercase text-white">
              SMAN 5 Taruna Brawijaya
            </p>
            <p class="text-[10px] text-yellow-400 italic mt-0.5">
              {{ isAdmin ? 'Panel Admin' : 'Dashboard PPDB' }}
            </p>
          </div>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              route.path === link.to
                ? 'bg-white/10 text-yellow-400'
                : 'text-green-100 hover:text-yellow-400 hover:bg-white/5',
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- Home link -->
          <NuxtLink
            to="/"
            class="hidden md:flex items-center gap-1.5 text-sm text-green-100 hover:text-yellow-400 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
            Beranda
          </NuxtLink>

          <div class="h-6 w-px bg-white/20 hidden md:block" />

          <!-- Save Status -->
          <Transition name="fade" mode="out-in">
            <div
              v-if="showSaveStatus && registrationStore.saveStatus === 'saving'"
              key="saving"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span class="text-xs text-yellow-400 font-medium">Menyimpan</span>
            </div>
            <div
              v-else-if="showSaveStatus && registrationStore.saveStatus === 'saved'"
              key="saved"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/15 border border-green-400/30"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span class="text-xs text-green-400 font-medium">Tersimpan</span>
            </div>
            <div
              v-else-if="showSaveStatus && registrationStore.saveStatus === 'error'"
              key="error"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-400/15 border border-red-400/30"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span class="text-xs text-red-400 font-medium">Gagal</span>
            </div>
          </Transition>

          <!-- User -->
          <NuxtLink
            to="/dashboard/profile"
            class="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div class="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-xs">
              {{ getInitials(profile?.full_name) }}
            </div>
            <span class="text-sm text-green-100 hidden sm:inline">{{ profile?.full_name }}</span>
          </NuxtLink>

          <!-- Logout -->
          <button
            class="p-2 rounded-full text-green-200/60 hover:text-white hover:bg-white/10 transition-all"
            title="Logout"
            @click="handleLogout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div class="lg:hidden border-t border-white/10 px-5 py-2 flex gap-1 overflow-x-auto">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
            route.path === link.to
              ? 'bg-white/10 text-yellow-400'
              : 'text-green-100 hover:text-yellow-400',
          ]"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 p-4 lg:p-6">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
