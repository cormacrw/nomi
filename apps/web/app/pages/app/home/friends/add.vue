<script setup>
import { avatarSrc } from '~/utils/avatarSrc'

definePageMeta({
  layout: 'app',
  appShell: 'none',
})

const supabase = useSupabaseClient()

const emailInput = ref('')
const submitting = ref(false)
const sendingRequest = ref(false)
const formError = ref('')
const infoMessage = ref('')

/** @type {import('vue').Ref<{ profileId: string, displayName: string | null, avatarUrl: string | null, avatarUpdatedAt: string | null } | null>} */
const candidate = ref(null)

/** @type {import('vue').Ref<'accepted' | 'pending_out' | 'pending_in' | 'other' | null>} */
const requestState = ref(null)

function normalizeEmail (raw) {
  return raw.trim().toLowerCase()
}

function isValidEmail (s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function initialsFromName (name) {
  const n = (name || 'Friend').trim()
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return n.slice(0, 2).toUpperCase()
}

/** useSupabaseUser() can lag behind the session cookie; getUser() matches middleware/session. */
async function getCurrentUserId () {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

async function loadRequestState (themId, me) {
  if (!me) {
    requestState.value = null
    return
  }
  const { data: rows, error } = await supabase
    .from('friend_requests')
    .select('status, from_profile_id, to_profile_id')
    .or(`and(from_profile_id.eq.${me},to_profile_id.eq.${themId}),and(from_profile_id.eq.${themId},to_profile_id.eq.${me})`)

  if (error || !rows?.length) {
    requestState.value = null
    return
  }

  const outgoing = rows.find((r) => r.from_profile_id === me && r.to_profile_id === themId)
  const incoming = rows.find((r) => r.from_profile_id === themId && r.to_profile_id === me)

  if (outgoing?.status === 'accepted' || incoming?.status === 'accepted') {
    requestState.value = 'accepted'
    return
  }
  if (incoming?.status === 'pending') {
    requestState.value = 'pending_in'
    return
  }
  if (outgoing?.status === 'pending') {
    requestState.value = 'pending_out'
    return
  }
  // Cancelled / declined rows still exist (unique pair) — you can send again via UPDATE, not INSERT
  if (outgoing && (outgoing.status === 'cancelled' || outgoing.status === 'declined')) {
    requestState.value = null
    return
  }
  if (incoming && (incoming.status === 'cancelled' || incoming.status === 'declined')) {
    requestState.value = null
    return
  }
  requestState.value = 'other'
}

function resetPreview () {
  candidate.value = null
  requestState.value = null
  infoMessage.value = ''
}

async function lookup () {
  formError.value = ''
  infoMessage.value = ''
  resetPreview()

  const addr = normalizeEmail(emailInput.value)
  if (!addr || !isValidEmail(addr)) {
    formError.value = 'Enter a valid email address.'
    return
  }

  const me = await getCurrentUserId()
  if (!me) {
    formError.value = 'Not signed in.'
    return
  }

  submitting.value = true
  try {
    const { data, error } = await supabase.rpc('lookup_friend_candidate_by_email', {
      search_email: addr,
    })

    if (error) {
      formError.value = error.message
      return
    }

    const row = Array.isArray(data) ? data[0] : data
    if (!row?.profile_id) {
      formError.value = 'No one on Nomi with that email yet.'
      return
    }

    if (row.profile_id === me) {
      infoMessage.value = 'That’s the email you use on this account — try adding someone else.'
      return
    }

    candidate.value = {
      profileId: row.profile_id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      avatarUpdatedAt: row.updated_at ?? null,
    }
    await loadRequestState(row.profile_id, me)
  } finally {
    submitting.value = false
  }
}

async function sendRequest () {
  const them = candidate.value?.profileId
  if (!them) return

  formError.value = ''
  sendingRequest.value = true
  try {
    const me = await getCurrentUserId()
    if (!me) {
      formError.value = 'Not signed in.'
      return
    }

    const { data: pairRows, error: pairErr } = await supabase
      .from('friend_requests')
      .select('friend_request_id, from_profile_id, to_profile_id, status')
      .or(`and(from_profile_id.eq.${me},to_profile_id.eq.${them}),and(from_profile_id.eq.${them},to_profile_id.eq.${me})`)

    if (pairErr) {
      formError.value = pairErr.message
      return
    }

    const outgoing = pairRows?.find((r) => r.from_profile_id === me && r.to_profile_id === them)
    const incoming = pairRows?.find((r) => r.from_profile_id === them && r.to_profile_id === me)

    if (incoming?.status === 'pending') {
      formError.value = 'They’ve already sent you a request — accept it under People.'
      await loadRequestState(them, me)
      return
    }

    if (outgoing?.status === 'pending') {
      formError.value = 'You already have a pending invitation to this person.'
      await loadRequestState(them, me)
      return
    }

    if (outgoing?.status === 'accepted' || incoming?.status === 'accepted') {
      formError.value = 'You’re already connected with this person.'
      await loadRequestState(them, me)
      return
    }

    if (outgoing && (outgoing.status === 'cancelled' || outgoing.status === 'declined')) {
      const { error: upErr } = await supabase
        .from('friend_requests')
        .update({ status: 'pending' })
        .eq('friend_request_id', outgoing.friend_request_id)
      if (upErr) {
        formError.value = upErr.message
        return
      }
      infoMessage.value = 'Friend request sent.'
      await loadRequestState(them, me)
      return
    }

    const { error: insErr } = await supabase.from('friend_requests').insert({
      from_profile_id: me,
      to_profile_id: them,
      status: 'pending',
    })

    if (insErr) {
      if (insErr.code === '23505') {
        await loadRequestState(them, me)
        formError.value = 'Could not send — try again in a moment.'
        return
      }
      formError.value = insErr.message
      return
    }

    infoMessage.value = 'Friend request sent.'
    await loadRequestState(them, me)
  } finally {
    sendingRequest.value = false
  }
}

watch(emailInput, () => {
  formError.value = ''
})
</script>

<template>
  <main
    class="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.75rem,env(safe-area-inset-top))] text-left"
  >
    <header class="mb-8 flex items-center gap-3">
      <NuxtLink
        :to="appPath('/home/friends')"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-nomi-mint/90 transition hover:bg-white/10"
        aria-label="Back to People"
      >
        <span class="material-symbols-outlined text-[1.5rem]">arrow_back</span>
      </NuxtLink>
      <h1 class="font-headline text-[1.375rem] font-bold tracking-tight text-white">
        Add someone
      </h1>
    </header>

    <p class="mb-6 text-[1.0625rem] leading-relaxed text-nomi-mint/85">
      Enter the email they use for Nomi — same idea as signing in with email.
    </p>

    <form class="flex flex-col" @submit.prevent="lookup">
      <label class="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-nomi-mint/75">
        Email
      </label>
      <input
        v-model="emailInput"
        type="email"
        autocomplete="email"
        inputmode="email"
        placeholder="friend@example.com"
        class="mb-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-[1.0625rem] text-white placeholder:text-nomi-mint/45"
      >

      <p
        v-if="formError"
        class="mb-4 text-sm font-semibold text-nomi-error"
        role="alert"
      >
        {{ formError }}
      </p>
      <p
        v-if="infoMessage"
        class="mb-4 text-sm font-medium text-nomi-mint/90"
        role="status"
      >
        {{ infoMessage }}
      </p>

      <button
        type="submit"
        class="mb-8 w-full min-h-[3.25rem] rounded-full bg-white px-6 font-headline text-[1rem] font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02] disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-nomi-ink/50"
        :disabled="submitting"
      >
        {{ submitting ? 'Looking up…' : 'Look up' }}
      </button>
    </form>

    <div
      v-if="candidate"
      class="mb-8 rounded-2xl border border-white/15 bg-white/5 p-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nomi-mint/90"
        >
          <img
            v-if="candidate.avatarUrl"
            :src="avatarSrc(candidate.avatarUrl, candidate.avatarUpdatedAt) ?? candidate.avatarUrl"
            alt=""
            class="h-full w-full object-cover"
          >
          <span
            v-else
            class="font-headline text-[18px] font-bold text-nomi-ink"
          >{{ initialsFromName(candidate.displayName) }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-headline text-[17px] font-semibold text-white">
            {{ candidate.displayName?.trim() || 'Friend' }}
          </p>
          <p class="text-sm text-nomi-mint/70">
            On Nomi
          </p>
        </div>
      </div>

      <div class="mt-4">
        <p
          v-if="requestState === 'accepted'"
          class="text-sm font-medium text-nomi-mint/90"
        >
          You’re already connected with this person.
        </p>
        <p
          v-else-if="requestState === 'pending_out'"
          class="text-sm font-medium text-nomi-mint/90"
        >
          Friend request pending — you’ll hear back when they accept.
        </p>
        <p
          v-else-if="requestState === 'pending_in'"
          class="text-sm font-medium text-nomi-mint/90"
        >
          They’ve already sent you a request — accepting from a list is coming next.
        </p>
        <p
          v-else-if="requestState === 'other'"
          class="text-sm font-medium text-nomi-mint/90"
        >
          You can’t send another request to this person right now.
        </p>
        <button
          v-else
          type="button"
          class="w-full min-h-[3rem] rounded-full bg-white/95 px-6 font-headline text-[1rem] font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="sendingRequest"
          @click="sendRequest"
        >
          {{ sendingRequest ? 'Sending…' : 'Send friend request' }}
        </button>
      </div>
    </div>

  </main>
</template>
