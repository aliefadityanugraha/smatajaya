import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      include: undefined,
      exclude: ['/', '/login', '/register', '/forgot-password', '/auth/callback', '/auth/update-password'],
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'PPDB - SMAN 5 Taruna Brawijaya',
      meta: [
        { name: 'description', content: 'Penerimaan Peserta Didik Baru SMAN 5 Taruna Brawijaya Jawa Timur' },
        { name: 'theme-color', content: '#042f1d' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-smata.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
