<template>
  <footer class="bg-forest-800 text-white pt-16 pb-8 border-t border-green-900/50">
    <div class="container mx-auto px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-green-900/60">

        <div class="lg:col-span-4">
          <div class="flex items-center gap-3 mb-4">
            <img src="/logo tiga.png" alt="Logo SMAN 5 Taruna Brawijaya" class="h-12 object-contain" style="max-width:145px;" />
          </div>
          <h3 class="font-extrabold text-sm tracking-wide uppercase text-white mb-3">
            SMAN 5 TARUNA BRAWIJAYA JAWA TIMUR
          </h3>
          <div class="space-y-2 text-xs text-green-200/80 leading-relaxed">
            <p class="flex items-start gap-2">
              <svg class="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
              Jl. Selomangleng No. 2 Kota Kediri, Jawa Timur Indonesia
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
              (0354) 771074
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
              sman5tarunabrawijaya@gmail.com
            </p>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h4 class="font-bold text-sm text-white uppercase tracking-wider mb-4">Navigasi</h4>
          <ul class="space-y-2 text-xs text-green-200/80">
            <li><NuxtLink to="/" class="hover:text-yellow-400 transition-colors">Beranda</NuxtLink></li>
            <li><NuxtLink to="/profil" class="hover:text-yellow-400 transition-colors">Profil</NuxtLink></li>
            <li><NuxtLink to="/akademik" class="hover:text-yellow-400 transition-colors">Akademik</NuxtLink></li>
            <li><NuxtLink to="/taruna" class="hover:text-yellow-400 transition-colors">Taruna Brawijaya</NuxtLink></li>
            <li><NuxtLink to="/informasi" class="hover:text-yellow-400 transition-colors">Informasi</NuxtLink></li>
            <li><NuxtLink to="/galeri" class="hover:text-yellow-400 transition-colors">Galeri</NuxtLink></li>
            <li><NuxtLink to="/kontak" class="hover:text-yellow-400 transition-colors">Kontak</NuxtLink></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h4 class="font-bold text-sm text-white uppercase tracking-wider mb-4">Informasi</h4>
          <ul class="space-y-2 text-xs text-green-200/80">
            <li><NuxtLink to="/ppdb" class="hover:text-yellow-400 transition-colors">PPDB</NuxtLink></li>
            <li><NuxtLink to="/informasi" class="hover:text-yellow-400 transition-colors">Kalender Akademik</NuxtLink></li>
            <li><NuxtLink to="/informasi" class="hover:text-yellow-400 transition-colors">Pengumuman</NuxtLink></li>
            <li><NuxtLink to="/informasi" class="hover:text-yellow-400 transition-colors">Siaran Pers</NuxtLink></li>
          </ul>
        </div>

        <div class="lg:col-span-4 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-sm text-white uppercase tracking-wider mb-4">Media Sosial</h4>
            <div class="flex items-center gap-3 mb-6">
              <a href="#" class="p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-950 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" class="p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-950 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="#" class="p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-950 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525 2.165c3.34 0 3.738.013 5.06.072 1.222.055 1.886.258 2.327.43.585.227 1.002.498 1.44.936.438.438.709.855.936 1.44.172.441.375 1.105.43 2.327.059 1.322.072 1.72.072 5.06s-.013 3.738-.072 5.06c-.055 1.222-.258 1.886-.43 2.327-.227.585-.498 1.002-.936 1.44-.438.438-.855.709-1.44.936-.441.172-1.105.375-2.327.43-1.322.059-1.72.072-5.06.072s-3.738-.013-5.06-.072c-1.222-.055-1.886-.258-2.327-.43-.585-.227-1.002-.498-1.44-.936-.438-.438-.709-.855-.936-1.44-.172-.441-.375-1.105-.43-2.327-.059-1.322-.072-1.72-.072-5.06s.013-3.738.072-5.06c.055-1.222.258-1.886.43-2.327.227-.585.498-1.002.936-1.44.438-.438.855-.709 1.44-.936.441-.172 1.105-.375 2.327-.43 1.322-.059-1.72-.072 5.06-.072z"/></svg>
              </a>
              <a href="#" class="p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-950 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
          <div class="border-l-2 border-yellow-400 pl-4 py-1 mt-4">
            <p class="font-serif italic text-yellow-400 text-lg leading-tight">
              Taruna Brawijaya<br/>Masa Depan Bangsa
            </p>
          </div>
        </div>
      </div>

      <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-green-200/60">
        <p>&copy; 2026 SMAN 5 Taruna Brawijaya Jawa Timur. All Rights Reserved.</p>
        <button
          class="p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-gray-950 text-white transition-all"
          @click="$router?.push?.('/') ?? window.scrollTo({ top: 0, behavior: 'smooth' })"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>
