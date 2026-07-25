<script setup lang="ts">
const infoItems = [
  {
    title: 'Pendaftaran Online',
    description: 'Daftar dari mana saja dan kapan saja melalui portal online kami.',
    icon: 'Globe',
  },
  {
    title: 'Proses Cepat',
    description: 'Verifikasi data dilakukan secara real-time oleh tim admin kami.',
    icon: 'Zap',
  },
  {
    title: 'Transparan',
    description: 'Seluruh proses pendaftaran dapat dipantau melalui dashboard Anda.',
    icon: 'Eye',
  },
]
</script>

<template>
  <section id="informasi" class="py-20 bg-background">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Informasi PPDB</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Kenali lebih jauh tentang sistem penerimaan peserta didik baru kami
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="(item, index) in infoItems"
          :key="item.title"
          class="p-6 rounded-3xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <svg v-if="item.icon === 'Globe'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <svg v-else-if="item.icon === 'Zap'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
