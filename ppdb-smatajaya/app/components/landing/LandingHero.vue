<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();

const registrationOpen = ref(true);
const statusMessage = ref("Penerimaan Telah Dibuka");

onMounted(async () => {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["registration_open", "registration_message"]);

  if (data) {
    for (const row of data) {
      if (row.key === "registration_open")
        registrationOpen.value = row.value === true || row.value === "true";
      if (row.key === "registration_message")
        statusMessage.value = row.value || "Penerimaan Telah Dibuka";
    }
  }
});
</script>

<template>
  <section
    class="relative bg-gradient-to-br from-forest-800 via-forest-600 to-forest-700 text-white overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 25% 25%,
            white 1px,
            transparent 1px
          );
          background-size: 50px 50px;
        "
      />
    </div>

    <div class="container mx-auto px-4 py-20 md:py-32 relative">
      <div class="max-w-3xl mx-auto text-center">
        <div
          class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
        >
          <span
            :class="[
              'h-2 w-2 rounded-full',
              registrationOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400',
            ]"
          />
          <span class="text-sm font-medium">{{ statusMessage }}</span>
        </div>

        <h1
          class="text-4xl md:text-5xl font-bold mb-6 leading-tight fade-in-up"
        >
          Penerimaan Taruna Baru <br />Tahun Pelajaran 2026/2027
        </h1>

        <p class="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          SMAN 5 Taruna Brawijaya Jawa Timur
        </p>

        <p class="text-base text-white/60 mb-10 max-w-xl mx-auto">
          Daftarkan diri Anda sekarang untuk menjadi bagian dari sekolah
          unggulan. Proses pendaftaran mudah, cepat, dan transparan.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NuxtLink
            to="/register"
            class="inline-flex items-center justify-center rounded-lg bg-white text-primary px-8 py-3.5 text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Daftar Sekarang
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
