<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {
  posts,
  loadingInitial,
  loadingMore,
  error,
  hasMore,
  refresh,
  loadMore,
  refreshSignedUrlForPath,
} = useHomeFeed()

const sentinelRef = ref(null)

async function signOut () {
  await supabase.auth.signOut()
  await navigateTo('/')
}

onMounted(() => {
  refresh()
})

let loadMoreObserver = null

watch(
  () => [posts.value.length, loadingInitial.value],
  async () => {
    await nextTick()
    if (typeof IntersectionObserver === 'undefined') return
    if (loadMoreObserver) {
      loadMoreObserver.disconnect()
      loadMoreObserver = null
    }
    if (posts.value.length === 0 || loadingInitial.value) return
    const el = sentinelRef.value
    if (!el) return
    loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    )
    loadMoreObserver.observe(el)
  },
  { flush: 'post' },
)

onUnmounted(() => {
  loadMoreObserver?.disconnect()
})

function onImageError (path) {
  refreshSignedUrlForPath(path)
}
</script>

<template>
  <main
    class="mx-auto w-full max-w-md px-5 py-[max(1rem,env(safe-area-inset-top))] pb-[max(5rem,env(safe-area-inset-bottom))] text-left"
  >
    <header class="mb-4 flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-nomi-mint/75">
          Home
        </p>
        <h1 class="font-headline text-[clamp(1.5rem,4vw,1.75rem)] font-extrabold tracking-tight text-white">
          Nomi
        </h1>
      </div>
    </header>

    <div
      v-if="loadingInitial"
      class="space-y-6 pt-2"
      aria-busy="true"
      aria-label="Loading feed"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="space-y-3 border-b border-white/10 pb-6"
      >
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 shrink-0 rounded-full bg-nomi-mint/15" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-28 rounded-md bg-nomi-mint/20" />
            <div class="h-3 w-16 rounded-md bg-nomi-mint/12" />
          </div>
        </div>
        <div class="aspect-[4/5] w-full rounded-2xl bg-nomi-mint/12" />
        <div class="space-y-2 pt-1">
          <div class="h-3 w-full rounded-md bg-nomi-mint/10" />
          <div class="h-3 w-4/5 rounded-md bg-nomi-mint/10" />
        </div>
      </div>
    </div>

    <div
      v-else-if="error && posts.length === 0"
      class="space-y-4"
    >
      <p class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-nomi-error">
        {{ error }}
      </p>
      <div class="flex justify-center">
        <button
          type="button"
          class="rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
          @click="signOut"
        >
          Sign out
        </button>
      </div>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="flex flex-col items-center py-10 text-center"
    >
      <p class="mb-6 max-w-[22ch] text-[1.0625rem] leading-relaxed text-nomi-mint/90">
        Nothing here yet — posts from you and your friends show up in order.
      </p>
      <div class="flex w-full max-w-xs flex-col gap-3">
        <NuxtLink
          to="/home/post"
          class="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full bg-white px-6 font-headline text-[1.0625rem] font-black tracking-tight text-nomi-ink shadow-lg shadow-black/10 transition hover:brightness-[1.02]"
        >
          New post
        </NuxtLink>
        <NuxtLink
          to="/home/friends"
          class="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full border-2 border-white/90 bg-transparent px-6 font-headline text-[1.0625rem] font-bold tracking-tight text-white transition hover:bg-white/10"
        >
          People
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <FeedPostCard
        v-for="p in posts"
        :key="p.postId"
        :post="p"
        :is-self="user?.id === p.authorProfileId"
        @image-error="onImageError"
      />

      <div
        ref="sentinelRef"
        class="h-4 w-full"
        aria-hidden="true"
      />

      <p
        v-if="loadingMore"
        class="py-4 text-center text-sm text-nomi-mint/70"
      >
        Loading…
      </p>
      <p
        v-else-if="!hasMore && posts.length > 0"
        class="py-4 text-center text-xs text-nomi-mint/45"
      >
        You’re caught up
      </p>

      <p
        v-if="error && posts.length > 0"
        class="mt-2 text-center text-sm text-nomi-error"
      >
        {{ error }}
      </p>
    </div>

    <div
      v-if="!loadingInitial && !(error && posts.length === 0)"
      class="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-8"
    >
      <NuxtLink
        v-if="posts.length > 0"
        to="/home/post"
        class="inline-flex min-h-[3rem] w-full max-w-xs items-center justify-center rounded-full bg-white/95 px-6 font-headline text-[1rem] font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02]"
      >
        New post
      </NuxtLink>
      <NuxtLink
        v-if="posts.length > 0"
        to="/home/friends"
        class="inline-flex min-h-[3rem] w-full max-w-xs items-center justify-center rounded-full border-2 border-white/90 bg-transparent px-6 font-headline text-[1rem] font-bold tracking-tight text-white transition hover:bg-white/10"
      >
        People
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
</template>
