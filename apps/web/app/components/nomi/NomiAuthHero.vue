<script setup>
defineProps({
  align: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center'].includes(v),
  },
})
</script>

<template>
  <header
    class="w-full"
    :class="align === 'center' ? 'text-center' : 'text-left'"
  >
    <h1
      class="mb-3 font-headline font-extrabold leading-[1.08] tracking-tight text-white sm:mb-5"
    >
      <slot name="title" />
    </h1>
    <p
      :class="align === 'center' ? 'mx-auto max-w-[26rem]' : 'max-w-xl'"
      class="text-[clamp(1rem,3.2vw,1.375rem)] font-medium leading-relaxed text-nomi-mint/90"
    >
      <slot name="description" />
    </p>
  </header>
</template>
