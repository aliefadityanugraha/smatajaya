<script setup>
import { ref, computed } from 'vue'
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()
const isAuthenticated = computed(() => !!user.value)
const mobileOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-forest-800 drop-shadow-2xl shadow-green-900/50"
    style="background-image: url('/header.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: top center;"
  >
    <div class="container mx-auto px-5 py-3 flex items-center justify-between relative z-10">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3">
        <img
          alt="Logo SMAN 5 Taruna Brawijaya"
          class="h-12 object-contain"
          style="max-width: 130px"
          src="/logo-tiga.png"
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
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
        <a
          href="/#informasi"
          class="hover:text-yellow-400 transition-colors text-green-100"
        >
          Informasi
        </a>
        <a
          href="/#timeline"
          class="hover:text-yellow-400 transition-colors text-green-100"
        >
          Timeline
        </a>
        <a
          href="/#persyaratan"
          class="hover:text-yellow-400 transition-colors text-green-100"
        >
          Persyaratan
        </a>
        <a
          href="/#faq"
          class="hover:text-yellow-400 transition-colors text-green-100"
        >
          FAQ
        </a>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <template v-if="isAuthenticated">
          <NuxtLink
            to="/dashboard"
            class="hidden md:inline-block bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all hover:-translate-y-0.5"
          >
            Dashboard
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="hidden md:inline-block text-sm font-medium text-green-100 hover:text-yellow-400 transition-colors"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="hidden md:inline-block bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all hover:-translate-y-0.5"
          >
            Daftar
          </NuxtLink>
        </template>

        <!-- Mobile menu button -->
        <button
          class="p-2 text-white hover:bg-white/10 rounded-full transition lg:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" d="M4 6h16M4 12h16m-7 6h7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            <path v-else d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileOpen" class="lg:hidden bg-forest-800 border-t border-green-700 px-5 pb-4">
      <a
        href="/#informasi"
        class="block py-2 text-sm font-medium text-green-100 hover:text-yellow-400 transition-colors"
        @click="mobileOpen = false"
      >
        Informasi
      </a>
      <a
        href="/#timeline"
        class="block py-2 text-sm font-medium text-green-100 hover:text-yellow-400 transition-colors"
        @click="mobileOpen = false"
      >
        Timeline
      </a>
      <a
        href="/#persyaratan"
        class="block py-2 text-sm font-medium text-green-100 hover:text-yellow-400 transition-colors"
        @click="mobileOpen = false"
      >
        Persyaratan
      </a>
      <a
        href="/#faq"
        class="block py-2 text-sm font-medium text-green-100 hover:text-yellow-400 transition-colors"
        @click="mobileOpen = false"
      >
        FAQ
      </a>

      <template v-if="isAuthenticated">
        <NuxtLink
          to="/dashboard"
          class="mt-2 block text-center bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all"
          @click="mobileOpen = false"
        >
          Dashboard
        </NuxtLink>
      </template>
      <template v-else>
        <div class="flex gap-3 mt-2">
          <NuxtLink
            to="/login"
            class="flex-1 text-center text-sm font-medium text-green-100 hover:text-yellow-400 border border-green-600 rounded-lg py-2 transition-colors"
            @click="mobileOpen = false"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="flex-1 text-center bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all"
            @click="mobileOpen = false"
          >
            Daftar
          </NuxtLink>
        </div>
      </template>
    </div>
  </header>
</template>
