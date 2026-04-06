<script setup>
const supabase = useSupabaseClient()

const pending = ref('')
const resending = ref(false)
const resendMsg = ref('')

onMounted(() => {
  if (import.meta.client) {
    pending.value = sessionStorage.getItem('nomi_pending_email') || ''
  }
  if (!pending.value) {
    navigateTo(appPath('/onboarding/email'))
  }
})

async function resend () {
  if (!pending.value) {
    return
  }
  resendMsg.value = ''
  resending.value = true
  try {
    const redirectTo = useAuthConfirmUrl()
    const { error } = await supabase.auth.signInWithOtp({
      email: pending.value,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) {
      resendMsg.value = error.message
      return
    }
    resendMsg.value = 'Sent — check your inbox.'
  } finally {
    resending.value = false
  }
}

function goBack () {
  navigateTo(appPath('/onboarding/email'))
}
</script>

<template>
  <OnboardingShell header-variant="auth" @back="goBack">
    <div class="flex w-full flex-1 flex-col pt-2 pb-8 sm:pt-8">
      <NomiAuthHero align="center" class="mb-8 w-full">
        <template #title>
          <span class="text-[clamp(2rem,5vw,2.875rem)]">Check your email</span>
        </template>
        <template #description>
          We sent a sign-in link to
          <span class="font-extrabold text-white">{{ pending }}</span>.
          Open it on this device to continue — the link expires after a while.
        </template>
      </NomiAuthHero>

      <NomiInlineHint icon="mail">
        If you don’t see it, check spam or promotions. You can send another link below.
      </NomiInlineHint>

      <p v-if="resendMsg" class="mt-4 text-center text-sm font-semibold text-nomi-mint/90">
        {{ resendMsg }}
      </p>

      <div class="mt-auto flex flex-col gap-4 pt-12">
        <NomiPrimaryButton type="button" :disabled="resending" @click="resend">
          {{ resending ? 'Sending…' : 'Resend magic link' }}
        </NomiPrimaryButton>
      </div>
    </div>
  </OnboardingShell>
</template>
