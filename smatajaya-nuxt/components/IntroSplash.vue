<script setup>
const emit = defineEmits(["done"]);
const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
    setTimeout(() => emit("done"), 500);
  }, 1000);
});
</script>

<template>
  <transition name="splash">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-forest-800"
    >
      <div class="splash-logo">
        <img
          src="/logo tiga.png"
          alt="Logo SMAN 5 Taruna Brawijaya"
          class="h-24 object-contain mb-3"
          style="max-width: 200px"
        />
      </div>
      <div class="splash-text">
        <h1
          class="text-white text-xl md:text-2xl font-extrabold tracking-wide uppercase text-center"
        >
          SMAN 5 Taruna Brawijaya
        </h1>
        <p
          class="text-green-300 text-xs md:text-sm tracking-[0.3em] uppercase text-center mt-2"
        >
          Jawa Timur
        </p>
      </div>
      <div class="splash-bar mt-8">
        <div class="w-16 h-0.5 bg-yellow-400/60 rounded-full mx-auto"></div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.splash-logo {
  animation: logoScaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.splash-text {
  animation: splashTextIn 0.5s ease 0.3s both;
}

.splash-bar {
  animation: splashTextIn 0.4s ease 0.6s both;
}

.splash-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.splash-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .splash-logo,
  .splash-text,
  .splash-bar {
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
