<script setup>
const isDev = import.meta.dev

const { seen, markSeen } = useWelcomeLocal()

onMounted(() => {
  if (seen.value) {
    navigateTo('/onboarding/email')
  }
})

function continueFromWelcome () {
  markSeen()
  navigateTo('/onboarding/email')
}
</script>

<template>
  <OnboardingShell header-variant="welcome" class="flex flex-1 flex-col">
    <div
      class="flex min-h-[min(70dvh,40rem)] flex-1 flex-col items-center justify-center gap-[clamp(1.25rem,4vw,2rem)] pt-4 text-center"
    >
      <div class="mb-[clamp(0.5rem,2vw,1rem)]" aria-hidden="true">
        <span
          class="material-symbols-outlined select-none text-[clamp(4rem,14vw,6rem)] leading-none text-white/10"
          style="font-variation-settings: 'wght' 100"
        >bubble_chart</span>
      </div>

      <h1
        class="max-w-[20ch] font-headline text-[clamp(2rem,5vw,2.875rem)] font-extrabold leading-[1.08] tracking-tight text-white"
      >
        Private social for people you know.
      </h1>
      <p class="max-w-md text-[clamp(1.0625rem,3.8vw,1.375rem)] font-medium leading-relaxed text-nomi-mint/90">
        Connect only with your real-life circle — we’ll confirm it’s you with email.
      </p>

      <NomiPrimaryButton
        variant="cream"
        class="mt-2 max-w-md"
        @click="continueFromWelcome"
      >
        Get started
      </NomiPrimaryButton>

      <NuxtLink
        v-if="isDev"
        to="/dev/login"
        class="text-sm font-semibold text-white/50 underline-offset-2 transition hover:text-white/80"
      >
        Dev: sign in with password
      </NuxtLink>

      <NomiWelcomeFooter />
    </div>
  </OnboardingShell>
</template>
