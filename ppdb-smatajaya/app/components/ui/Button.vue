<script setup lang="ts">
import { cn } from '~/utils/cn'
import { buttonVariants, type ButtonVariants } from './button-variants'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </button>
</template>
