<template>
  <div class="flex flex-col min-h-screen">
    <NuxtLoadingIndicator color="#16a34a" :height="3" />
    <TheNavbar />
    <div class="flex-1">
      <slot />
    </div>
    <TheFooter />
    <TheBackToTop />
  </div>
</template>
