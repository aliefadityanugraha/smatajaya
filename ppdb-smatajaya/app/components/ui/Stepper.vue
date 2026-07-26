<script setup lang="ts">
interface StepperProps {
  steps: string[];
  currentStep: number;
}

defineProps<StepperProps>();
</script>

<template>
  <div class="w-full py-6">
    <div class="flex justify-between items-center relative">
      <!-- Line Background -->
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />

      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex flex-col items-center gap-2"
      >
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300',
            index <= currentStep
              ? 'bg-forest-600 text-yellow-400 border-2 border-forest-800'
              : 'bg-gray-200 text-gray-500',
          ]"
        >
          {{ index + 1 }}
        </div>
        <span
          :class="[
            'text-xs font-medium',
            index <= currentStep ? 'text-forest-800' : 'text-gray-400',
          ]"
        >
          {{ step }}
        </span>
      </div>
    </div>
  </div>
</template>
