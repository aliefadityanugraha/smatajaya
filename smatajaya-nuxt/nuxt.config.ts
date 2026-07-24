import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'SMAN 5 Taruna Brawijaya Jawa Timur',
      meta: [
        { name: 'description', content: 'Website unofficial SMAN 5 Taruna Brawijaya Jawa Timur - Berkarakter, Berprestasi, Mengabdi untuk Negeri' },
        { name: 'theme-color', content: '#042f1d' },
        { property: 'og:title', content: 'SMAN 5 Taruna Brawijaya Jawa Timur' },
        { property: 'og:description', content: 'Website unofficial SMAN 5 Taruna Brawijaya Jawa Timur - Berkarakter, Berprestasi, Mengabdi untuk Negeri' },
        { property: 'og:image', content: 'https://smatarunakediri.sch.id/Smata-Jaya-Foto-Utama-2.png' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SMAN 5 Taruna Brawijaya Jawa Timur' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'SMAN 5 Taruna Brawijaya Jawa Timur' },
        { name: 'twitter:description', content: 'Website unofficial SMAN 5 Taruna Brawijaya Jawa Timur - Berkarakter, Berprestasi, Mengabdi untuk Negeri' },
        { name: 'twitter:image', content: 'https://smatarunakediri.sch.id/Smata-Jaya-Foto-Utama-2.png' },
        { name: 'google-site-verification', content: 'IYptGYPuWvBTcb7HTYihKlu9TkHFjsqj3NEp3c2mHX0' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-smata.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {},
})
