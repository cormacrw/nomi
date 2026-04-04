<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span
    class="block pl-1 text-[clamp(0.65rem,2vw,0.75rem)] font-bold uppercase tracking-[0.12em] text-nomi-mint/95"
  >
    {{ text }}
  </span>
</template>
