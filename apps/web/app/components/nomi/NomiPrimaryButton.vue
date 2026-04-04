<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'inverse',
    validator: (v) => ['inverse', 'cream'].includes(v),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="group flex w-full min-h-[3.75rem] items-center justify-center gap-3 rounded-full border-0 px-6 font-headline text-[clamp(1.125rem,3.5vw,1.375rem)] font-black tracking-tight transition enabled:hover:-translate-y-px enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65 sm:min-h-[5rem] sm:px-8"
    :class="variant === 'cream'
      ? 'bg-nomi-cream text-nomi-ink shadow-lg shadow-black/10 enabled:hover:brightness-[1.03]'
      : 'bg-white text-nomi-ink enabled:hover:brightness-[1.02]'"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
    <span v-if="$slots.trailing" class="contents">
      <slot name="trailing" />
    </span>
  </button>
</template>
