<script setup>
/**
 * Local testing only: email + password sign-in (no magic link / SMTP).
 * Create a user in Supabase Dashboard → Authentication → Users → Add user → Email + password.
 * This route is blocked in production builds (see middleware dev-only).
 */
definePageMeta({
  layout: false,
  middleware: ['dev-only'],
})

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const err = ref('')
const busy = ref(false)

async function submit () {
  err.value = ''
  busy.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })
    if (error) {
      err.value = error.message
      return
    }
    await navigateTo('/home')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] px-6 font-sans text-nomi-mint"
  >
    <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-black/20 p-8">
      <p class="mb-1 text-xs font-bold uppercase tracking-wider text-amber-200/90">
        Dev only
      </p>
      <h1 class="mb-2 font-headline text-xl font-extrabold text-white">
        Password sign-in (testing)
      </h1>
      <p class="mb-6 text-sm text-nomi-mint/75">
        Use a user you created in the Supabase dashboard (Auth → Users → Add user). Not available in production builds.
      </p>
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-bold uppercase tracking-wide text-nomi-mint/80">Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="username"
            required
            class="nomi-cream-field text-base"
          >
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-bold uppercase tracking-wide text-nomi-mint/80">Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="nomi-cream-field text-base"
          >
        </label>
        <p v-if="err" class="text-sm font-semibold text-nomi-error" role="alert">
          {{ err }}
        </p>
        <button
          type="submit"
          class="mt-2 rounded-full bg-white px-4 py-3 font-headline font-extrabold text-nomi-ink disabled:opacity-60"
          :disabled="busy"
        >
          {{ busy ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <NuxtLink to="/" class="mt-6 block text-center text-sm text-white/70 underline">
        Back to welcome
      </NuxtLink>
    </div>
  </div>
</template>
