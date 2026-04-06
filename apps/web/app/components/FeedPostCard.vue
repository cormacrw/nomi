<script setup lang="ts">
import type { FeedPost } from '~/composables/useHomeFeed'
import { avatarSrc } from '~/utils/avatarSrc'

const props = defineProps<{
  post: FeedPost
  isSelf?: boolean
}>()

const emit = defineEmits<{
  imageError: [storagePath: string]
}>()

const postRef = computed(() => props.post)

const activeIndex = ref(0)

function onCarouselScroll (e) {
  const el = e.target
  if (!(el instanceof HTMLElement) || !el.clientWidth) return
  const i = Math.round(el.scrollLeft / el.clientWidth)
  activeIndex.value = Math.min(Math.max(0, i), postRef.value.media.length - 1)
}

function formatTime (iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const displayName = computed(() => {
  if (props.isSelf) return 'You'
  return postRef.value.authorDisplayName?.trim() || 'Friend'
})

const initials = computed(() => {
  const n = displayName.value
  if (n === 'You') return 'Y'
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return n.slice(0, 2).toUpperCase()
})

const authorAvatarDisplay = computed(() =>
  avatarSrc(postRef.value.authorAvatarUrl, postRef.value.authorAvatarUpdatedAt ?? null),
)
</script>

<template>
  <article class="border-b border-white/10 pb-6 pt-2 last:border-b-0 last:pb-0">
    <div class="mb-3 flex items-center gap-3">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-bold text-white"
      >
        <img
          v-if="authorAvatarDisplay"
          :src="authorAvatarDisplay"
          alt=""
          class="h-full w-full object-cover"
        >
        <span v-else>{{ initials }}</span>
      </div>
      <div class="min-w-0 flex-1 text-left">
        <p class="truncate font-headline font-bold text-white">
          {{ displayName }}
        </p>
        <p class="text-sm text-nomi-mint/70">
          {{ formatTime(post.createdAt) }}
        </p>
      </div>
    </div>

    <div v-if="post.media.length" class="-mx-1">
      <div
        class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll="onCarouselScroll"
      >
        <div
          v-for="m in post.media"
          :key="m.postMediaId"
          class="w-full shrink-0 snap-center px-1"
        >
          <div class="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/5">
            <img
              v-if="m.signedUrl"
              :src="m.signedUrl"
              :alt="''"
              class="h-full w-full object-cover"
              loading="lazy"
              @error="emit('imageError', m.storagePath)"
            >
          </div>
        </div>
      </div>
      <div
        v-if="post.media.length > 1"
        class="mt-2 flex justify-center gap-1.5"
      >
        <span
          v-for="(_, i) in post.media"
          :key="i"
          class="h-1.5 w-1.5 rounded-full transition-colors"
          :class="i === activeIndex ? 'bg-white' : 'bg-white/30'"
        />
      </div>
    </div>

    <p
      v-if="post.caption?.trim()"
      class="mt-3 text-left text-[1.0625rem] leading-relaxed text-nomi-mint/95"
    >
      {{ post.caption }}
    </p>

    <div class="mt-4 flex justify-start">
      <span
        class="material-symbols-outlined text-[1.5rem] text-white/50"
        aria-hidden="true"
      >favorite</span>
    </div>
  </article>
</template>
