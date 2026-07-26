<script setup lang="ts">
import { ref, computed } from 'vue'
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
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

async function handleLogout() {
  closeMobileMenu()
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
            class="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div class="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-xs">
              {{ getInitials(profile?.full_name) }}
            </div>
            <span class="text-sm text-green-100 hidden md:inline">{{ profile?.full_name }}</span>
          </NuxtLink>

          <!-- Logout (Desktop) -->
          <button
            class="hidden md:flex p-2 rounded-full text-green-200/60 hover:text-white hover:bg-white/10 transition-all"
            title="Logout"
            @click="handleLogout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>

          <!-- Mobile Hamburger -->
          <button
            class="lg:hidden p-2 rounded-lg text-green-100 hover:text-yellow-400 hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
            @click="toggleMobileMenu"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Slide-out Drawer -->
    <Teleport to="body">
      <Transition name="drawer-overlay">
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          @click="closeMobileMenu"
        />
      </Transition>
      <Transition name="drawer-slide">
        <div
          v-if="mobileMenuOpen"
          class="fixed top-0 left-0 h-full w-72 bg-forest-800 z-[70] lg:hidden flex flex-col shadow-2xl"
        >
          <!-- Drawer Header -->
          <div class="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                alt="Logo SMAN 5 Taruna Brawijaya"
                class="h-9 object-contain"
                src="/logo-tiga.png"
              />
              <div>
                <p class="font-bold text-xs leading-tight uppercase text-white">SMAN 5 Taruna</p>
                <p class="text-[10px] text-yellow-400 italic">{{ isAdmin ? 'Panel Admin' : 'Dashboard PPDB' }}</p>
              </div>
            </div>
            <button
              class="p-1.5 rounded-lg text-green-200/60 hover:text-white hover:bg-white/10 transition-all"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Drawer Nav -->
          <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                route.path === link.to
                  ? 'bg-white/10 text-yellow-400'
                  : 'text-green-100 hover:text-yellow-400 hover:bg-white/5',
              ]"
              @click="closeMobileMenu"
            >
              <svg v-if="link.icon === 'LayoutDashboard'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <svg v-else-if="link.icon === 'FileText'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              <svg v-else-if="link.icon === 'Printer'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Drawer Footer -->
          <div class="border-t border-white/10 px-3 py-3 space-y-1">
            <NuxtLink
              to="/dashboard/profile"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-100 hover:text-yellow-400 hover:bg-white/5 transition-all"
              @click="closeMobileMenu"
            >
              <div class="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-xs shrink-0">
                {{ getInitials(profile?.full_name) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-green-100 truncate">{{ profile?.full_name }}</p>
                <p class="text-[10px] text-green-300/60">Lihat Profil</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-green-100 hover:text-yellow-400 hover:bg-white/5 transition-all"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Beranda
            </NuxtLink>

            <button
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
              @click="handleLogout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

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

.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-leave-active {
  transition: transform 0.25s ease-in;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}
</style>
