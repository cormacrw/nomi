<script setup>
defineProps({
  headerVariant: {
    type: String,
    default: 'auth',
    validator: (v) => ['welcome', 'auth', 'brand', 'profile'].includes(v),
  },
})

const emit = defineEmits(['back', 'help'])
</script>

<template>
  <div
    class="mx-auto box-border flex min-h-dvh w-full max-w-3xl flex-col px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pr-[max(1.25rem,env(safe-area-inset-right))]"
  >
    <OnboardingHeader
      :variant="headerVariant"
      @back="emit('back')"
      @help="emit('help')"
    />
    <div class="flex min-h-0 w-full flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
