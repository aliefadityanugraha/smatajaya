<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileOpen = ref(false)
const profilOpen = ref(false)

const profilItems = [
  { name: 'Sejarah', to: '/profil#sejarah' },
  { name: 'Visi & Misi', to: '/profil#visi-misi' },
  { name: 'Logo', to: '/profil#logo' },
  { name: 'Mars Smatajaya', to: '/profil#mars' },
]

const navLinks = [
  { name: 'Beranda', to: '/', id: 'home' },
  { name: 'Akademik', to: '/akademik', id: 'akademik' },
  { name: 'Taruna Brawijaya', to: '/taruna', id: 'taruna' },
  { name: 'Informasi', to: '/informasi', id: 'informasi' },
  { name: 'Galeri', to: '/galeri', id: 'galeri' },
  { name: 'Kontak', to: '/kontak', id: 'kontak' },
]

function isProfilActive() {
  return route.path === '/profil'
}
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-forest-800 drop-shadow-2xl shadow-green-900/50"
    style="background-image: url('/header.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: top center;"
  >
    <div class="container mx-auto px-5 py-3 flex items-center justify-between relative z-10">
      <!-- Logo + Nama -->
      <router-link to="/" class="flex items-center gap-3">
        <img
          alt="Logo SMAN 5 Taruna Brawijaya"
          class="h-12 object-contain"
          style="max-width: 130px"
          src="/logo tiga.png"
        />
        <div class="hidden md:block">
          <p class="font-bold text-sm leading-tight tracking-wide uppercase text-white">
            SMAN 5 Taruna Brawijaya
          </p>
          <p class="text-xs text-green-200 font-semibold tracking-widest uppercase">
            Jawa Timur
          </p>
          <p class="text-[10px] text-yellow-400 italic mt-0.5">
            Berkarakter &bull; Berprestasi &bull; Mengabdi untuk Negeri
          </p>
        </div>
      </router-link>

      <!-- Nav Links -->
      <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
        <!-- Profil Dropdown -->
        <div
          class="relative"
          @mouseenter="profilOpen = true"
          @mouseleave="profilOpen = false"
        >
          <router-link
            to="/profil"
            class="flex items-center gap-1 hover:text-yellow-400 transition-colors cursor-pointer"
            :class="isProfilActive() ? 'nav-active text-white' : 'text-green-100'"
          >
            Profil
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': profilOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </router-link>

          <!-- Dropdown -->
          <transition name="dropdown">
            <div
              v-show="profilOpen"
              class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
            >
              <router-link
                v-for="item in profilItems"
                :key="item.name"
                :to="item.to"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
              >
                {{ item.name }}
              </router-link>
            </div>
          </transition>
        </div>

        <router-link
          v-for="link in navLinks"
          :key="link.id"
          :to="link.to"
          class="flex items-center gap-1 hover:text-yellow-400 transition-colors"
          :class="route.path === link.to ? 'nav-active text-white' : 'text-green-100'"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <router-link
          to="/ppdb"
          class="hidden md:inline-block bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all hover:-translate-y-0.5"
        >
          PPDB 2025/2026
        </router-link>
        <button class="p-2 text-white hover:bg-white/10 rounded-full transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
        <button
          class="p-2 text-white hover:bg-white/10 rounded-full transition lg:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16m-7 6h7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileOpen" class="lg:hidden bg-forest-800 border-t border-green-700 px-5 pb-4">
      <!-- Profil (expandable) -->
      <div>
        <button
          class="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors text-green-100 hover:text-yellow-400"
          @click="profilOpen = !profilOpen"
        >
          Profil
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': profilOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
        <div v-if="profilOpen" class="pl-4 pb-1">
          <router-link
            v-for="item in profilItems"
            :key="item.name"
            :to="item.to"
            class="block py-1.5 text-xs text-green-200 hover:text-yellow-400 transition-colors"
            @click="mobileOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>

      <router-link
        v-for="link in navLinks"
        :key="link.id"
        :to="link.to"
        class="block py-2 text-sm font-medium transition-colors"
        :class="route.path === link.to ? 'text-yellow-400' : 'text-green-100 hover:text-yellow-400'"
        @click="mobileOpen = false"
      >
        {{ link.name }}
      </router-link>
      <router-link
        to="/ppdb"
        class="mt-2 block text-center bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all"
        @click="mobileOpen = false"
      >
        PPDB 2025/2026
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
