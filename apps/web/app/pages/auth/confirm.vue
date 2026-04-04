<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()

const signInPhase = ref<'working' | 'done' | 'error'>('working')
const errMsg = ref('')

let finished = false

async function readSession () {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return null
  }
  return data?.session ?? null
}

async function goSuccess () {
  if (finished) {
    return
  }
  finished = true
  signInPhase.value = 'done'
  await navigateTo('/onboarding/success', { replace: true })
}

/** If anything failed after tokens were stored, still complete sign-in */
async function recoverSessionOrError (fallbackMessage: string) {
  const s = await readSession()
  if (s) {
    await goSuccess()
    return
  }
  errMsg.value = fallbackMessage
  signInPhase.value = 'error'
}

async function finishSignIn () {
  try {
    if (import.meta.client && window.location.search.includes('code=')) {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        await recoverSessionOrError(error.message)
        return
      }
    }

    // Session can lag briefly after PKCE exchange
    for (let i = 0; i < 30; i++) {
      const session = await readSession()
      if (session) {
        await goSuccess()
        return
      }
      await new Promise((r) => setTimeout(r, 100))
    }

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        return
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        sub?.unsubscribe()
        void goSuccess()
      }
    })
    const sub = authListener.data.subscription
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        sub?.unsubscribe()
        resolve()
      }, 2500)
    })

    if (finished) {
      return
    }

    const late = await readSession()
    if (late) {
      await goSuccess()
      return
    }

    await recoverSessionOrError(
      'Could not complete sign-in. Try the link again or request a new email from the app.',
    )
  } catch (e) {
    await recoverSessionOrError(
      e instanceof Error ? e.message : 'Something went wrong.',
    )
  }
}

onMounted(() => {
  void finishSignIn()
})
</script>

<template>
  <div
    class="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] px-6 font-sans text-nomi-mint"
  >
    <template v-if="signInPhase === 'working'">
      <p class="text-center text-lg font-semibold text-white">
        Signing you in…
      </p>
    </template>
    <template v-else-if="signInPhase === 'error'">
      <p class="max-w-md text-center text-white">
        {{ errMsg }}
      </p>
      <NuxtLink
        to="/onboarding/email"
        class="mt-6 font-semibold text-white underline"
      >
        Back to email sign-in
      </NuxtLink>
    </template>
  </div>
</template>
