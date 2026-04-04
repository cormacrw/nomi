<script setup>
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()

const status = ref<'working' | 'done' | 'error'>('working')
const errMsg = ref('')

let finished = false

async function goSuccess () {
  if (finished) {
    return
  }
  finished = true
  status.value = 'done'
  await navigateTo('/onboarding/success', { replace: true })
}

async function finishSignIn () {
  try {
    if (import.meta.client && window.location.search.includes('code=')) {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        errMsg.value = error.message
        status.value = 'error'
        return
      }
    }

    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      await new Promise((r) => setTimeout(r, 50))
      ;({ data: { session } } = await supabase.auth.getSession())
    }
    if (!session) {
      await new Promise((r) => setTimeout(r, 250))
      ;({ data: { session } } = await supabase.auth.getSession())
    }

    if (session) {
      await goSuccess()
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN' && s) {
        subscription.unsubscribe()
        goSuccess()
      }
    })

    await new Promise((r) => setTimeout(r, 2000))
    subscription.unsubscribe()

    if (finished) {
      return
    }

    ;({ data: { session: s2 } } = await supabase.auth.getSession())
    if (s2) {
      await goSuccess()
      return
    }

    errMsg.value = 'Could not complete sign-in. Try the link again or request a new email from the app.'
    status.value = 'error'
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : 'Something went wrong.'
    status.value = 'error'
  }
}

onMounted(() => {
  finishSignIn()
})
</script>

<template>
  <div
    class="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] px-6 font-sans text-nomi-mint"
  >
    <template v-if="status === 'working'">
      <p class="text-center text-lg font-semibold text-white">
        Signing you in…
      </p>
    </template>
    <template v-else-if="status === 'error'">
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
