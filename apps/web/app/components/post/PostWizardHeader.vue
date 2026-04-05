<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})

defineEmits(['back'])
</script>

<template>
  <header
    class="flex w-full max-w-md shrink-0 items-center gap-1 px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3"
  >
    <NomiIconButton label="Back" @click="$emit('back')">
      arrow_back
    </NomiIconButton>
    <h1
      class="pointer-events-none flex-1 text-center font-headline text-[1.125rem] font-semibold tracking-tight text-white"
    >
      {{ title }}
    </h1>
    <div class="h-11 w-11 shrink-0 sm:h-12 sm:w-12" aria-hidden="true" />
  </header>
</template>
