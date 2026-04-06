<script setup lang="ts">
import type { FeedPost, FeedReaction } from '~/composables/useHomeFeed'
import { sameProfileId, useResolvedAuthUserId } from '~/composables/useResolvedAuthUserId'
import { avatarSrc } from '~/utils/avatarSrc'
import { REACTION_OPTIONS, reactionEmoji, type ReactionTypeKey } from '~/utils/postReactionTypes'

const props = defineProps<{
  post: FeedPost
  isSelf?: boolean
}>()

const emit = defineEmits<{
  imageError: [storagePath: string]
}>()

const { userId: myUserId } = useResolvedAuthUserId()
const { posts, setReaction, clearReaction } = useHomeFeed()

/** Prefer live row from feed state so reactions update when `setReaction` mutates `posts` */
const displayPost = computed(
  () => posts.value.find((p) => p.postId === props.post.postId) ?? props.post,
)

const postRef = computed(() => displayPost.value)

const activeIndex = ref(0)

const pickerOpen = ref(false)
const summaryExpanded = ref(false)
const reactionError = ref('')

function onCarouselScroll (e: Event) {
  const el = e.target
  if (!(el instanceof HTMLElement) || !el.clientWidth) return
  const i = Math.round(el.scrollLeft / el.clientWidth)
  activeIndex.value = Math.min(Math.max(0, i), postRef.value.media.length - 1)
}

function formatTime (iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = +now - +d
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

const myReactionType = computed(() => {
  const uid = myUserId.value
  if (!uid) return null
  const row = postRef.value.reactions.find((r) => sameProfileId(r.profileId, uid))
  return row?.reactionType ?? null
})

function reactorDisplayName (r: FeedReaction) {
  const uid = myUserId.value
  if (uid && sameProfileId(r.profileId, uid)) return 'You'
  return r.reactorDisplayName?.trim() || 'Friend'
}

function reactorInitials (r: FeedReaction) {
  const n = reactorDisplayName(r)
  if (n === 'You') return 'Y'
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return n.slice(0, 2).toUpperCase()
}

function reactorAvatar (r: FeedReaction) {
  return avatarSrc(r.reactorAvatarUrl, r.reactorAvatarUpdatedAt ?? null)
}

const reactionCount = computed(() => postRef.value.reactions.length)

const reactionSummaryLabel = computed(() => {
  const n = reactionCount.value
  if (n === 0) return ''
  if (n === 1) return '1 reaction'
  return `${n} reactions`
})

function togglePicker () {
  reactionError.value = ''
  pickerOpen.value = !pickerOpen.value
}

function toggleSummary () {
  summaryExpanded.value = !summaryExpanded.value
}

async function onPickReaction (key: ReactionTypeKey) {
  reactionError.value = ''
  const r = await setReaction(displayPost.value.postId, key)
  if (!r.ok) {
    reactionError.value = r.message
    return
  }
  pickerOpen.value = false
}

async function onRemoveReaction () {
  reactionError.value = ''
  const r = await clearReaction(displayPost.value.postId)
  if (!r.ok) {
    reactionError.value = r.message
    return
  }
  pickerOpen.value = false
}
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
          {{ formatTime(displayPost.createdAt) }}
        </p>
      </div>
    </div>

    <div v-if="displayPost.media.length" class="-mx-1">
      <div
        class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll="onCarouselScroll"
      >
        <div
          v-for="m in displayPost.media"
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
        v-if="displayPost.media.length > 1"
        class="mt-2 flex justify-center gap-1.5"
      >
        <span
          v-for="(_, i) in displayPost.media"
          :key="i"
          class="h-1.5 w-1.5 rounded-full transition-colors"
          :class="i === activeIndex ? 'bg-white' : 'bg-white/30'"
        />
      </div>
    </div>

    <p
      v-if="displayPost.caption?.trim()"
      class="mt-3 text-left text-[1.0625rem] leading-relaxed text-nomi-mint/95"
    >
      {{ displayPost.caption }}
    </p>

    <!-- Author-only: reaction summary -->
    <div v-if="isSelf" class="mt-4">
      <p
        v-if="reactionCount === 0"
        class="text-sm text-nomi-mint/55"
      >
        No reactions yet
      </p>
      <div v-else>
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-semibold text-nomi-mint/90 transition hover:bg-white/10"
          :aria-expanded="summaryExpanded"
          @click="toggleSummary"
        >
          <span>{{ reactionSummaryLabel }}</span>
          <span
            class="material-symbols-outlined text-[1.25rem] text-nomi-mint/70"
            aria-hidden="true"
          >{{ summaryExpanded ? 'expand_less' : 'expand_more' }}</span>
        </button>
        <div
          v-show="summaryExpanded"
          class="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2"
          role="region"
          :aria-label="'Who reacted'"
        >
          <div
            v-for="r in displayPost.reactions"
            :key="r.profileId"
            class="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-nomi-mint/95"
          >
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xs font-bold text-white"
            >
              <img
                v-if="reactorAvatar(r)"
                :src="reactorAvatar(r) as string"
                alt=""
                class="h-full w-full object-cover"
              >
              <span v-else>{{ reactorInitials(r) }}</span>
            </div>
            <span class="min-w-0 flex-1 truncate font-medium">{{ reactorDisplayName(r) }}</span>
            <span class="shrink-0 text-lg" aria-hidden="true">{{ reactionEmoji(r.reactionType) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Friend: react -->
    <div v-else class="mt-4">
      <div class="flex flex-col items-start gap-2">
        <button
          type="button"
          class="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-nomi-mint/90 transition hover:bg-white/10"
          :aria-expanded="pickerOpen"
          aria-haspopup="dialog"
          @click="togglePicker"
        >
          <span
            v-if="myReactionType"
            class="text-xl leading-none"
            aria-hidden="true"
          >{{ reactionEmoji(myReactionType) }}</span>
          <span
            v-else
            class="material-symbols-outlined text-[1.5rem] text-white/60"
            aria-hidden="true"
          >favorite</span>
          <span>{{ myReactionType ? 'Change reaction' : 'React' }}</span>
        </button>

        <div
          v-show="pickerOpen"
          class="w-full rounded-xl border border-white/15 bg-black/30 p-3 backdrop-blur-sm"
          role="group"
          aria-label="Choose a reaction"
        >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in REACTION_OPTIONS"
              :key="opt.key"
              type="button"
              class="inline-flex min-h-[2.75rem] min-w-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              :class="myReactionType === opt.key ? 'ring-2 ring-white/50' : ''"
              @click="onPickReaction(opt.key)"
            >
              <span class="text-xl" aria-hidden="true">{{ opt.emoji }}</span>
              <span class="sr-only">{{ opt.label }}</span>
            </button>
          </div>
          <button
            type="button"
            class="mt-3 w-full rounded-lg border border-white/15 py-2 text-sm font-semibold transition"
            :class="myReactionType ? 'text-nomi-mint/80 hover:bg-white/10' : 'cursor-not-allowed text-nomi-mint/35'"
            :disabled="!myReactionType"
            @click="onRemoveReaction"
          >
            Remove
          </button>
        </div>

        <p
          v-if="reactionError"
          class="text-sm text-nomi-error"
          role="alert"
        >
          {{ reactionError }}
        </p>
      </div>
    </div>
  </article>
</template>
