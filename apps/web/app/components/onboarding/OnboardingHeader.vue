<script setup>
defineProps({
  variant: {
    type: String,
    default: 'auth',
    validator: (v) => ['welcome', 'auth', 'brand', 'profile'].includes(v),
  },
})

const emit = defineEmits(['back', 'help'])
</script>

<template>
  <header
    class="z-[2] mx-auto grid w-full max-w-3xl grid-cols-[minmax(2.75rem,auto)_1fr_minmax(2.75rem,auto)] items-center gap-2 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
  >
    <div class="flex items-center justify-self-start">
      <NomiIconButton
        v-if="variant !== 'welcome' && variant !== 'profile'"
        label="Back"
        @click="emit('back')"
      >
        arrow_back
      </NomiIconButton>
    </div>

    <div
      v-if="variant === 'welcome'"
      class="flex min-w-0 items-center justify-center justify-self-center gap-1.5"
    >
      <span
        class="material-symbols-outlined shrink-0 text-[clamp(1.5rem,4.5vw,1.75rem)] text-white"
        style="font-variation-settings: 'FILL' 1"
        aria-hidden="true"
      >bubble_chart</span>
      <span class="truncate font-headline text-[clamp(1.25rem,4vw,1.5rem)] font-black tracking-tight text-white">Nomi</span>
    </div>

    <h2
      v-else-if="variant === 'auth'"
      class="m-0 min-w-0 justify-self-center text-center font-headline text-[clamp(1rem,3.5vw,1.5rem)] font-extrabold leading-tight tracking-tight text-white"
    >
      Authentication
    </h2>

    <h2
      v-else-if="variant === 'profile'"
      class="m-0 min-w-0 justify-self-center text-center font-headline text-[clamp(1rem,3.5vw,1.5rem)] font-extrabold leading-tight tracking-tight text-white"
    >
      Your profile
    </h2>

    <div
      v-else
      class="min-w-0 justify-self-center truncate font-headline text-[clamp(1.5rem,5vw,2.25rem)] font-black tracking-tight text-white"
    >
      Nomi
    </div>

    <div class="flex items-center justify-self-end">
      <NomiIconButton label="Help" @click="emit('help')">
        help
      </NomiIconButton>
    </div>
  </header>
</template>
