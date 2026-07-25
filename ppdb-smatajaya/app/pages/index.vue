<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'PPDB - SMAN 5 Taruna Brawijaya',
  ogTitle: 'PPDB - SMAN 5 Taruna Brawijaya',
  description: 'Penerimaan Peserta Didik Baru SMAN 5 Taruna Brawijaya Jawa Timur',
  ogDescription: 'Penerimaan Peserta Didik Baru SMAN 5 Taruna Brawijaya Jawa Timur',
})
</script>

<template>
  <div>
    <SharedNavbar />

    <main>
      <LandingHero />
      <LandingInfo />
      <LandingTimeline />
      <LandingRequirements />
      <LandingFAQ />
      <LandingCTA />
    </main>

    <SharedFooter />
  </div>
</template>
