<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Pentab - SMAN 5 Taruna Brawijaya",
  ogTitle: "Pentab - SMAN 5 Taruna Brawijaya",
  description: "Penerimaan Taruna Baru SMAN 5 Taruna Brawijaya Jawa Timur",
  ogDescription: "Penerimaan Taruna Baru SMAN 5 Taruna Brawijaya Jawa Timur",
});
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
