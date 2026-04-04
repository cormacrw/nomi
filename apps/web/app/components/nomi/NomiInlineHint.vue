<script setup>
defineProps({
  icon: {
    type: String,
    default: 'info',
  },
})
</script>

<template>
  <p
    class="flex items-start gap-2.5 text-left text-[clamp(0.9375rem,2.8vw,1.0625rem)] font-medium leading-snug text-nomi-mint/90"
  >
    <span
      class="material-symbols-outlined mt-0.5 shrink-0 text-xl opacity-90"
      aria-hidden="true"
    >{{ icon }}</span>
    <span><slot /></span>
  </p>
</template>
