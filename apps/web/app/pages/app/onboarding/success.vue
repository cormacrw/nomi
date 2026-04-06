<script setup>
const supabase = useSupabaseClient()

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const uid = session?.user?.id
  if (uid) {
    const complete = await getProfileSetupComplete(supabase, uid)
    if (!complete) {
      await navigateTo(appPath('/onboarding/profile'))
      return
    }
    await syncWelcomeToProfile(supabase, uid)
  }
  await new Promise((r) => setTimeout(r, 900))
  await navigateTo(appPath('/home'))
})

function goHome () {
  navigateTo(appPath('/home'))
}

function goBack () {
  navigateTo(appPath('/onboarding/profile'))
}
</script>

<template>
  <OnboardingShell header-variant="brand" @back="goBack">
    <div class="flex w-full flex-1 flex-col items-center px-0 pb-8 pt-[clamp(0.5rem,3vw,2rem)] text-center">
      <header class="mb-[clamp(1.75rem,6vw,4rem)] w-full">
        <h1
          class="mb-3 font-headline text-[clamp(2rem,5vw,2.875rem)] font-extrabold leading-[1.08] tracking-tight text-white sm:mb-6"
        >
          Welcome home.
        </h1>
        <p class="mx-auto max-w-md text-[clamp(1rem,3.2vw,1.375rem)] font-medium leading-relaxed text-nomi-mint/80">
          Your account is ready. Let’s connect with people you know.
        </p>
      </header>

      <div class="mb-[clamp(1.75rem,6vw,3rem)] flex w-full flex-col gap-[clamp(0.85rem,2.5vw,1.25rem)]">
        <NomiGlassCard icon="verified_user" title="Identity verified" :filled-icon="true">
          Your email is confirmed — you’re signed in on this device.
        </NomiGlassCard>
        <NomiGlassCard icon="group" title="Find your friends" :filled-icon="true">
          Add people you know — no public directory.
        </NomiGlassCard>
      </div>

      <div class="mt-auto flex w-full flex-col items-center gap-4">
        <NomiPrimaryButton @click="goHome">
          Continue
        </NomiPrimaryButton>
        <p class="flex items-center gap-2 text-[clamp(0.8125rem,2.5vw,0.9375rem)] font-semibold text-white/55">
          <span
            class="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
            aria-hidden="true"
          />
          Taking you to Nomi…
        </p>
      </div>

      <nav
        class="mt-6 flex justify-center gap-[clamp(2.5rem,12vw,5rem)] pb-2"
        aria-label="Support"
      >
        <a class="text-nomi-mint/55 transition hover:text-white" href="#" @click.prevent>
          <span class="material-symbols-outlined text-[clamp(1.75rem,5vw,2.25rem)]">info</span>
        </a>
        <a class="text-nomi-mint/55 transition hover:text-white" href="#" @click.prevent>
          <span class="material-symbols-outlined text-[clamp(1.75rem,5vw,2.25rem)]">support_agent</span>
        </a>
      </nav>
    </div>
  </OnboardingShell>
</template>
