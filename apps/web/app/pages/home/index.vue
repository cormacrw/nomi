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
      Home
    </p>
    <h1 class="mb-3 font-headline text-[clamp(2rem,5vw,2.5rem)] font-extrabold tracking-tight text-white lg:text-4xl">
      Nomi
    </h1>
    <p class="mb-7 text-[1.0625rem] leading-relaxed text-nomi-mint/85">
      Feed and friends will show up here. You’re signed in.
    </p>
    <button
      type="button"
      class="rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
      @click="signOut"
    >
      Sign out
    </button>
  </main>
</template>
