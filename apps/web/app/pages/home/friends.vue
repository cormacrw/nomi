<script setup>
const supabase = useSupabaseClient()

async function signOut () {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <main
    class="mx-auto w-full max-w-md px-6 py-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center"
  >
    <p class="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-nomi-mint/75">
      Friends
    </p>
    <h1 class="mb-4 font-headline text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-tight text-white">
      Find friends
    </h1>
    <p class="mb-8 text-[1.0625rem] leading-relaxed text-nomi-mint/85">
      Friend search and invites will live here.
    </p>
    <NuxtLink
      to="/home"
      class="mb-6 inline-flex min-h-[3rem] w-full max-w-xs items-center justify-center rounded-full border border-white/25 bg-transparent px-6 font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
    >
      Back to home
    </NuxtLink>
    <button
      type="button"
      class="rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
      @click="signOut"
    >
      Sign out
    </button>
  </main>
</template>
