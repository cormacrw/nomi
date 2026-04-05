<script setup lang="ts">
import type { FriendProfile, PendingByRequest } from '~/composables/useFriendsList'

const supabase = useSupabaseClient()
const {
  friends,
  incomingPending,
  outgoingPending,
  loading,
  error,
  refresh,
} = useFriendsList()

const myAvatarUrl = ref<string | null>(null)
const myDisplayName = ref<string | null>(null)
/** Request row being updated (accept / decline / cancel) */
const actionRequestId = ref<string | null>(null)

function initialsFromName (name: string | null | undefined) {
  const n = (name || 'Friend').trim()
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return n.slice(0, 2).toUpperCase()
}

function friendInitials (f: FriendProfile | PendingByRequest) {
  return initialsFromName(f.displayName)
}

async function loadMe () {
  const { data: { user } } = await supabase.auth.getUser()
  const uid = user?.id
  if (!uid) return
  const { data } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('profile_id', uid)
    .maybeSingle()
  if (data) {
    myDisplayName.value = data.display_name
    myAvatarUrl.value = data.avatar_url
  }
}

onMounted(() => {
  refresh()
  loadMe()
})

async function signOut () {
  await supabase.auth.signOut()
  await navigateTo('/')
}

const myInitials = computed(() => initialsFromName(myDisplayName.value))

const hasNoConnections =
  computed(() =>
    friends.value.length === 0
    && incomingPending.value.length === 0
    && outgoingPending.value.length === 0,
  )

async function acceptIncoming (friendRequestId: string) {
  actionRequestId.value = friendRequestId
  try {
    const { error: upErr } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('friend_request_id', friendRequestId)
    if (upErr) {
      console.error(upErr)
      return
    }
    await refresh()
  } finally {
    actionRequestId.value = null
  }
}

async function declineIncoming (friendRequestId: string) {
  actionRequestId.value = friendRequestId
  try {
    const { error: upErr } = await supabase
      .from('friend_requests')
      .update({ status: 'declined' })
      .eq('friend_request_id', friendRequestId)
    if (upErr) {
      console.error(upErr)
      return
    }
    await refresh()
  } finally {
    actionRequestId.value = null
  }
}

async function cancelOutgoing (friendRequestId: string) {
  actionRequestId.value = friendRequestId
  try {
    const { error: upErr } = await supabase
      .from('friend_requests')
      .update({ status: 'cancelled' })
      .eq('friend_request_id', friendRequestId)
    if (upErr) {
      console.error(upErr)
      return
    }
    await refresh()
  } finally {
    actionRequestId.value = null
  }
}
</script>

<template>
  <!-- FRND-07 People — Stitch: clean header, list v3 / empty canonical -->
  <div class="relative flex min-h-dvh w-full flex-col">
    <header
      class="fixed top-0 z-50 flex h-16 w-full max-w-md items-center justify-between self-center bg-transparent px-6"
    >
      <NuxtLink
        to="/home"
        class="flex h-10 w-10 shrink-0 items-center justify-center text-nomi-mint/90 transition hover:opacity-80 active:scale-95"
        aria-label="Back to home"
      >
        <span class="material-symbols-outlined text-[1.5rem]">arrow_back</span>
      </NuxtLink>
      <h1 class="font-headline text-[1.375rem] font-bold tracking-tighter text-white">
        People
      </h1>
      <div
        class="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-white/10"
      >
        <img
          v-if="myAvatarUrl"
          :src="myAvatarUrl"
          alt=""
          class="h-full w-full object-cover"
        >
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-nomi-mint/90 font-headline text-sm font-bold text-nomi-ink"
        >
          {{ myInitials }}
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-md flex-1 px-6 pb-[max(6rem,env(safe-area-inset-bottom))] pt-24">
      <template v-if="loading">
        <div class="mb-6">
          <div class="h-5 w-40 rounded-md bg-nomi-mint/15" />
        </div>
        <div class="flex flex-col gap-4">
          <div
            v-for="n in 5"
            :key="n"
            class="flex h-[60px] items-center gap-4 px-2"
          >
            <div class="h-12 w-12 shrink-0 rounded-full bg-nomi-mint/12" />
            <div class="flex flex-1 flex-col gap-2">
              <div class="h-4 w-36 rounded-md bg-nomi-mint/15" />
              <div class="h-3 w-20 rounded-md bg-nomi-mint/10" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="error">
        <p class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-nomi-error">
          {{ error }}
        </p>
        <button
          type="button"
          class="mt-4 w-full rounded-full border border-white/25 py-2.5 text-sm font-semibold text-nomi-mint/90"
          @click="refresh"
        >
          Try again
        </button>
      </template>

      <template v-else>
        <!-- Incoming: pending friend requests -->
        <section
          v-if="incomingPending.length"
          class="mb-8"
        >
          <h2 class="mb-3 font-headline text-[15px] font-medium tracking-wide text-white/80">
            Friend requests
          </h2>
          <ul class="flex flex-col gap-2">
            <li
              v-for="r in incomingPending"
              :key="r.friendRequestId"
              class="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nomi-mint/90"
                >
                  <img
                    v-if="r.avatarUrl"
                    :src="r.avatarUrl"
                    alt=""
                    class="h-full w-full object-cover"
                  >
                  <span
                    v-else
                    class="font-headline text-[18px] font-bold text-nomi-ink"
                  >{{ friendInitials(r) }}</span>
                </div>
                <div class="min-w-0 flex-1 text-left">
                  <p class="truncate font-headline text-[17px] font-semibold text-white">
                    {{ r.displayName?.trim() || 'Someone' }}
                  </p>
                  <p class="text-[13px] text-nomi-mint/65">
                    Wants to connect
                  </p>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button
                  type="button"
                  class="min-h-[2.75rem] flex-1 rounded-full bg-white px-4 font-headline text-[0.9375rem] font-bold text-nomi-ink transition hover:brightness-[1.02] disabled:opacity-50"
                  :disabled="actionRequestId === r.friendRequestId"
                  @click="acceptIncoming(r.friendRequestId)"
                >
                  Accept
                </button>
                <button
                  type="button"
                  class="min-h-[2.75rem] flex-1 rounded-full border border-white/35 bg-transparent px-4 font-headline text-[0.9375rem] font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  :disabled="actionRequestId === r.friendRequestId"
                  @click="declineIncoming(r.friendRequestId)"
                >
                  Decline
                </button>
              </div>
            </li>
          </ul>
        </section>

        <!-- Outgoing: invitations you sent (pending) -->
        <section
          v-if="outgoingPending.length"
          class="mb-8"
        >
          <h2 class="mb-3 font-headline text-[15px] font-medium tracking-wide text-white/80">
            Pending invitations
          </h2>
          <ul class="flex flex-col gap-1">
            <li
              v-for="r in outgoingPending"
              :key="r.friendRequestId"
              class="flex min-h-[60px] items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-white/5"
            >
              <div
                class="mr-2 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nomi-mint/90"
              >
                <img
                  v-if="r.avatarUrl"
                  :src="r.avatarUrl"
                  alt=""
                  class="h-full w-full object-cover"
                >
                <span
                  v-else
                  class="font-headline text-[18px] font-bold text-nomi-ink"
                >{{ friendInitials(r) }}</span>
              </div>
              <div class="min-w-0 flex-1 text-left">
                <p class="truncate font-headline text-[17px] font-semibold leading-tight text-white">
                  {{ r.displayName?.trim() || 'Friend' }}
                </p>
                <p class="text-[14px] font-medium text-nomi-mint/70">
                  Invited
                </p>
              </div>
              <button
                type="button"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-nomi-mint/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                :disabled="actionRequestId === r.friendRequestId"
                aria-label="Cancel invitation"
                @click="cancelOutgoing(r.friendRequestId)"
              >
                <span class="material-symbols-outlined text-[1.35rem]">delete</span>
              </button>
            </li>
          </ul>
        </section>

        <!-- Friends list -->
        <template v-if="friends.length > 0">
          <div class="mb-6">
            <h2 class="font-headline text-[15px] font-medium tracking-wide text-white/80">
              People you know
            </h2>
          </div>

          <div class="flex flex-col gap-1">
            <div
              v-for="f in friends"
              :key="f.profileId"
              class="group flex h-[60px] cursor-pointer items-center rounded-xl px-2 transition-colors hover:bg-white/5"
            >
              <div
                class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nomi-mint/90"
              >
                <img
                  v-if="f.avatarUrl"
                  :src="f.avatarUrl"
                  alt=""
                  class="h-full w-full object-cover"
                >
                <span
                  v-else
                  class="font-headline text-[18px] font-bold text-nomi-ink"
                >{{ friendInitials(f) }}</span>
              </div>
              <div class="flex min-w-0 flex-col text-left">
                <span class="truncate text-[17px] font-semibold leading-tight text-white">
                  {{ f.displayName?.trim() || 'Friend' }}
                </span>
                <span class="text-[14px] font-medium text-nomi-mint/70">
                  Friend
                </span>
              </div>
            </div>
          </div>

          <div
            class="relative mt-12 overflow-hidden rounded-xl bg-[#002517]/40 p-8 backdrop-blur-sm"
          >
            <div class="relative z-10">
              <h3 class="mb-2 font-headline text-2xl text-white">
                Connect globally
              </h3>
              <p class="max-w-[200px] text-sm text-nomi-mint/70">
                Expand your emerald circle with people across the network.
              </p>
            </div>
            <div
              class="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-nomi-mint/20 blur-3xl"
              aria-hidden="true"
            />
          </div>
        </template>

        <!-- Empty: no friends and no pending -->
        <div
          v-else-if="hasNoConnections"
          class="flex min-h-[min(50dvh,24rem)] flex-col items-center justify-center px-2 text-center"
        >
          <div class="max-w-sm space-y-4">
            <h2 class="font-headline text-[clamp(1.75rem,6vw,2rem)] font-extrabold leading-none tracking-tight text-white">
              No friends yet
            </h2>
            <p class="text-[1.0625rem] font-medium leading-relaxed text-white/75">
              Add people you know by email — the same one they use to sign in.
            </p>
            <div class="pt-6">
              <NuxtLink
                to="/home/friends/add"
                class="inline-flex min-h-[3.25rem] w-full max-w-sm items-center justify-center rounded-full bg-white px-8 font-headline text-[1rem] font-extrabold uppercase tracking-wide text-nomi-ink shadow-none transition active:scale-[0.98]"
              >
                Add someone by email
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Pending activity but no accepted friends yet -->
        <p
          v-else
          class="mt-2 text-center text-[1.0625rem] leading-relaxed text-nomi-mint/80"
        >
          When someone accepts, they’ll appear under “People you know.”
        </p>
      </template>

      <div
        v-if="!loading && !error && friends.length > 0"
        class="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-8"
      >
        <NuxtLink
          to="/home/friends/add"
          class="inline-flex min-h-[3rem] w-full max-w-xs items-center justify-center rounded-full bg-white/95 px-6 font-headline text-[1rem] font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02]"
        >
          Add someone by email
        </NuxtLink>
        <button
          type="button"
          class="rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
          @click="signOut"
        >
          Sign out
        </button>
      </div>

      <div
        v-else-if="!loading && !error && friends.length === 0"
        class="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-8"
      >
        <NuxtLink
          to="/home/friends/add"
          class="inline-flex min-h-[3rem] w-full max-w-xs items-center justify-center rounded-full bg-white/95 px-6 font-headline text-[1rem] font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02]"
        >
          Add someone by email
        </NuxtLink>
        <button
          type="button"
          class="rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
          @click="signOut"
        >
          Sign out
        </button>
      </div>
    </main>
  </div>
</template>
