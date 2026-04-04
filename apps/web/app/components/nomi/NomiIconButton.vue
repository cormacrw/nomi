<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-white transition hover:bg-white/10 active:scale-[0.96] sm:h-12 sm:w-12"
    :aria-label="label"
    @click="$emit('click')"
  >
    <span class="material-symbols-outlined text-[clamp(1.5rem,5vw,1.875rem)]">
      <slot />
    </span>
  </button>
</template>
