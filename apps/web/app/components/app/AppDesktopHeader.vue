<script setup lang="ts">
import { appPath } from '~/utils/appBase'

const route = useRoute()

const feed = appPath('/home')
const friends = appPath('/home/friends')
const me = appPath('/home/me')
const post = appPath('/home/post')

function isNavActive (path: string) {
  const p = route.path
  const exact = p === path || p === `${path}/`
  const child = path !== feed && p.startsWith(`${path}/`)
  return exact || child
}

function navClass (path: string) {
  const active = isNavActive(path)
  return [
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    active ? 'bg-white/15 text-white' : 'text-nomi-mint/90 hover:bg-white/10 hover:text-white',
  ]
}
</script>

<template>
  <header
    class="sticky top-0 z-50 hidden w-full shrink-0 border-b border-white/10 bg-nomi-emerald md:flex md:justify-center"
  >
    <div
      class="flex h-[3.75rem] w-full max-w-6xl items-center justify-between gap-4 px-4 pt-[max(0.25rem,env(safe-area-inset-top))] pb-2"
    >
      <NuxtLink
        :to="feed"
        class="flex min-w-0 items-center gap-2 text-white transition hover:opacity-90"
        aria-label="Nomi home"
      >
        <span
          class="material-symbols-outlined shrink-0 text-[1.75rem] text-white/90"
          style="font-variation-settings: 'wght' 100"
          aria-hidden="true"
        >bubble_chart</span>
        <span class="font-headline text-lg font-extrabold tracking-tight">Nomi</span>
      </NuxtLink>

      <nav
        class="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2"
        aria-label="Main"
      >
        <NuxtLink
          :to="feed"
          class="font-headline"
          :class="navClass(feed)"
          :aria-current="isNavActive(feed) ? 'page' : undefined"
        >
          Feed
        </NuxtLink>
        <NuxtLink
          :to="friends"
          class="font-headline"
          :class="navClass(friends)"
          :aria-current="isNavActive(friends) ? 'page' : undefined"
        >
          People
        </NuxtLink>
        <NuxtLink
          :to="me"
          class="font-headline"
          :class="navClass(me)"
          :aria-current="isNavActive(me) ? 'page' : undefined"
        >
          You
        </NuxtLink>
        <NuxtLink
          :to="post"
          class="ml-1 inline-flex min-h-[2.5rem] shrink-0 items-center justify-center rounded-full bg-white px-4 font-headline text-sm font-black tracking-tight text-nomi-ink shadow-md shadow-black/10 transition hover:brightness-[1.02]"
        >
          New post
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
