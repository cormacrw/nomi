<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

const supabase = useSupabaseClient()

const displayName = ref<string | null>(null)
const avatarUrl = ref<string | null>(null)

function initialsFromName (name: string | null | undefined) {
  const n = (name || 'You').trim()
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return n.slice(0, 2).toUpperCase()
}

const initials = computed(() => initialsFromName(displayName.value))

async function loadProfile () {
  const { data: { user } } = await supabase.auth.getUser()
  const uid = user?.id
  if (!uid) return
  const { data } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('profile_id', uid)
    .maybeSingle()
  if (data) {
    displayName.value = data.display_name
    avatarUrl.value = data.avatar_url
  }
}

onMounted(() => {
  loadProfile()
})

async function signOut () {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <main
    class="mx-auto w-full max-w-md px-5 py-[max(1rem,env(safe-area-inset-top))] pb-8 text-left md:pt-6"
  >
    <p class="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-nomi-mint/75">
      You
    </p>
    <h1 class="mb-8 font-headline text-[clamp(1.5rem,4vw,1.75rem)] font-extrabold tracking-tight text-white">
      Profile
    </h1>

    <div class="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 text-center">
      <div
        class="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white/25 bg-white/10"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt=""
          class="h-full w-full object-cover"
        >
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-nomi-mint/90 font-headline text-2xl font-bold text-nomi-ink"
        >
          {{ initials }}
        </div>
      </div>
      <p class="font-headline text-xl font-bold text-white">
        {{ displayName?.trim() || 'Your name' }}
      </p>
      <button
        type="button"
        class="mt-2 rounded-full border border-white/25 bg-transparent px-6 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
        @click="signOut"
      >
        Sign out
      </button>
    </div>
  </main>
</template>
