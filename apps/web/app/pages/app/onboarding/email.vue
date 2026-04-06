<script setup>
const supabase = useSupabaseClient()

const email = ref('')
const submitting = ref(false)
const formError = ref('')

function normalizeEmail (raw) {
  return raw.trim().toLowerCase()
}

function isValidEmail (s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

async function sendLink () {
  formError.value = ''
  const addr = normalizeEmail(email.value)
  if (!addr || !isValidEmail(addr)) {
    formError.value = 'Enter a valid email address.'
    return
  }

  submitting.value = true
  try {
    const redirectTo = useAuthConfirmUrl()
    const { error } = await supabase.auth.signInWithOtp({
      email: addr,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) {
      formError.value = error.message
      return
    }
    if (import.meta.client) {
      sessionStorage.setItem('nomi_pending_email', addr)
    }
    await navigateTo(appPath('/onboarding/check-email'))
  } finally {
    submitting.value = false
  }
}

function goBack () {
  navigateTo('/')
}
</script>

<template>
  <OnboardingShell header-variant="auth" @back="goBack">
    <div class="flex w-full flex-1 flex-col pt-2 pb-[clamp(1rem,4vw,2rem)] sm:pt-8">
      <NomiAuthHero class="mb-[clamp(1.5rem,5vw,3rem)]">
        <template #title>
          <span class="text-[clamp(2rem,5vw,2.875rem)]">Sign in with email</span>
        </template>
        <template #description>
          We’ll email you a magic link — no password. Use the same device you open this app on.
        </template>
      </NomiAuthHero>

      <form class="flex flex-1 flex-col gap-[clamp(1rem,3vw,1.5rem)]" @submit.prevent="sendLink">
        <label class="flex flex-col gap-1.5 text-left">
          <NomiFieldLabel text="Email" />
          <div class="relative flex min-w-0 items-center">
            <input
              v-model="email"
              type="email"
              class="nomi-cream-field min-w-0 pr-11 text-base sm:pr-12 sm:text-lg"
              autocomplete="email"
              inputmode="email"
              placeholder="you@example.com"
            >
            <span
              class="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[clamp(1.1rem,4vw,1.75rem)] text-nomi-ink/30 sm:right-4"
              aria-hidden="true"
            >mail</span>
          </div>
        </label>

        <NomiInlineHint>
          We’ll open the app in your browser when you tap the link — keep this tab if you’re on desktop.
        </NomiInlineHint>

        <p v-if="formError" class="text-left text-sm font-semibold text-nomi-error" role="alert">
          {{ formError }}
        </p>

        <div class="mt-auto pt-[clamp(1rem,4vw,2rem)] pb-2">
          <NomiPrimaryButton type="submit" :disabled="submitting">
            <span>{{ submitting ? 'Sending…' : 'Email me a link' }}</span>
            <template #trailing>
              <span
                class="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1 sm:text-2xl"
                aria-hidden="true"
              >arrow_forward</span>
            </template>
          </NomiPrimaryButton>
        </div>
      </form>
    </div>
  </OnboardingShell>
</template>
