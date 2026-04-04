<script setup>
defineEmits(['terms-click', 'privacy-click'])

defineProps({
  termsHref: {
    type: String,
    default: '#',
  },
  privacyHref: {
    type: String,
    default: '#',
  },
})
</script>

<template>
  <footer class="mt-auto flex w-full flex-col items-center gap-[clamp(1.25rem,4vw,2.5rem)] pt-[clamp(2rem,8vw,4rem)]">
    <div
      class="flex flex-wrap justify-center gap-x-[clamp(1.5rem,8vw,4rem)] gap-y-2 text-[clamp(0.8125rem,2.5vw,1rem)] font-semibold uppercase tracking-[0.14em]"
    >
      <a
        class="text-white/70 transition hover:text-white"
        :href="termsHref"
        @click.prevent="$emit('terms-click')"
      >Terms</a>
      <a
        class="text-white/70 transition hover:text-white"
        :href="privacyHref"
        @click.prevent="$emit('privacy-click')"
      >Privacy</a>
    </div>
    <p
      class="flex items-center gap-1.5 text-[clamp(0.625rem,2vw,0.75rem)] uppercase tracking-wide text-white/45"
    >
      <span class="material-symbols-outlined text-base opacity-85" aria-hidden="true">verified_user</span>
      <span>Identity verified platform</span>
    </p>
  </footer>
</template>
