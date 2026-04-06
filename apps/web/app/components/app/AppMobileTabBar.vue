<script setup lang="ts">
import { appPath } from '~/utils/appBase'

const route = useRoute()

const feed = appPath('/home')
const friends = appPath('/home/friends')
const post = appPath('/home/post')
const me = appPath('/home/me')

function isFeedActive () {
  return route.path === feed || route.path === `${feed}/`
}

function isPeopleActive () {
  return route.path === friends || route.path.startsWith(`${friends}/`)
}

function isCreateActive () {
  return route.path.startsWith(post)
}

function isYouActive () {
  return route.path === me
}

function tabClass (active: boolean) {
  return [
    'flex min-h-[3.25rem] min-w-[3.25rem] flex-col items-center justify-center rounded-2xl px-2 transition-colors',
    active ? 'bg-white/15 text-white' : 'text-nomi-mint/80 hover:bg-white/10',
  ]
}
</script>

<template>
  <nav
    class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    aria-label="Main"
  >
    <div
      class="pointer-events-auto mx-4 flex max-w-md items-end justify-around gap-1 rounded-[2rem] border border-white/15 bg-black/20 px-2 py-2 shadow-lg shadow-black/20 backdrop-blur-md"
    >
      <NuxtLink
        :to="feed"
        :class="tabClass(isFeedActive())"
        :aria-current="isFeedActive() ? 'page' : undefined"
      >
        <span
          class="material-symbols-outlined text-[1.75rem]"
          aria-hidden="true"
        >home</span>
        <span class="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/85">Feed</span>
      </NuxtLink>

      <NuxtLink
        :to="friends"
        :class="tabClass(isPeopleActive())"
        :aria-current="isPeopleActive() ? 'page' : undefined"
      >
        <span
          class="material-symbols-outlined text-[1.75rem]"
          aria-hidden="true"
        >group</span>
        <span class="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/85">People</span>
      </NuxtLink>

      <NuxtLink
        :to="post"
        class="-mt-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-nomi-ink shadow-lg shadow-black/25 ring-4 ring-black/10 transition hover:brightness-[1.02] active:scale-[0.98]"
        :class="isCreateActive() ? 'ring-white/30' : ''"
        aria-label="New post"
        :aria-current="isCreateActive() ? 'page' : undefined"
      >
        <span
          class="material-symbols-outlined text-[2rem]"
          aria-hidden="true"
        >add</span>
      </NuxtLink>

      <NuxtLink
        :to="me"
        :class="tabClass(isYouActive())"
        :aria-current="isYouActive() ? 'page' : undefined"
      >
        <span
          class="material-symbols-outlined text-[1.75rem]"
          aria-hidden="true"
        >person</span>
        <span class="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/85">You</span>
      </NuxtLink>
    </div>
  </nav>
</template>
