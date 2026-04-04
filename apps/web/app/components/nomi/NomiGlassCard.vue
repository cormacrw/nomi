<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  filledIcon: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 text-left sm:gap-5 sm:rounded-3xl sm:p-6 md:p-8"
  >
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-14 sm:w-14 md:h-16 md:w-16"
    >
      <span
        class="material-symbols-outlined text-[clamp(1.5rem,5vw,2.25rem)] text-white"
        :style="filledIcon ? { fontVariationSettings: '\'FILL\' 1' } : {}"
        aria-hidden="true"
      >{{ icon }}</span>
    </div>
    <div class="min-w-0 flex-1">
      <h3 class="text-[clamp(1.0625rem,3vw,1.25rem)] font-extrabold text-white">
        {{ title }}
      </h3>
      <p class="mt-0.5 text-[clamp(0.875rem,2.5vw,1.0625rem)] font-medium leading-snug text-nomi-mint/65">
        <slot />
      </p>
    </div>
  </div>
</template>
