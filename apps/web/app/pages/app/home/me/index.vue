<script setup lang="ts">
import { MAX_IMAGE_INPUT_BYTES } from '~/utils/fileToWebp'
import { avatarSrc } from '~/utils/avatarSrc'
import { uploadProfileAvatarToStorage } from '~/utils/uploadProfileAvatar'

definePageMeta({
  layout: 'app',
})

const supabase = useSupabaseClient()

const displayName = ref<string | null>(null)
const avatarUrl = ref<string | null>(null)
const profileUpdatedAt = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const photoUploading = ref(false)
const formError = ref('')

function initialsFromName (name: string | null | undefined) {
  const n = (name || 'You').trim()
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return n.slice(0, 2).toUpperCase()
}

const initials = computed(() => initialsFromName(displayName.value))

const displayAvatarSrc = computed(() => {
  if (previewUrl.value) return previewUrl.value
  return avatarSrc(avatarUrl.value, profileUpdatedAt.value)
})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

async function loadProfile () {
  const { data: { user } } = await supabase.auth.getUser()
  const uid = user?.id
  if (!uid) return
  const { data } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, updated_at')
    .eq('profile_id', uid)
    .maybeSingle()
  if (data) {
    displayName.value = data.display_name
    avatarUrl.value = data.avatar_url
    profileUpdatedAt.value = data.updated_at
  }
}

onMounted(() => {
  loadProfile()
})

async function onPickPhoto (e: Event) {
  formError.value = ''
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  if (f.size > MAX_IMAGE_INPUT_BYTES) {
    formError.value = 'That photo is too large. Choose a smaller file.'
    input.value = ''
    return
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(f)

  photoUploading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const uid = user?.id
    if (!uid) {
      formError.value = 'Not signed in.'
      return
    }
    const { publicUrl } = await uploadProfileAvatarToStorage(supabase, uid, f)
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('profile_id', uid)
      .select('avatar_url, updated_at')
      .single()
    if (error) {
      formError.value = error.message
      return
    }
    avatarUrl.value = data.avatar_url
    profileUpdatedAt.value = data.updated_at
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Something went wrong.'
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  } finally {
    photoUploading.value = false
    input.value = ''
  }
}

async function signOut () {
  await supabase.auth.signOut()
  await navigateTo('/', { replace: true })
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
        class="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white/25 bg-white/10"
      >
        <img
          v-if="displayAvatarSrc"
          :src="displayAvatarSrc"
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

      <p
        v-if="formError"
        class="w-full text-center text-sm font-semibold text-nomi-error"
        role="alert"
      >
        {{ formError }}
      </p>

      <label
        class="cursor-pointer rounded-full border border-white/25 bg-transparent px-6 py-2.5 text-[0.9375rem] font-semibold text-nomi-mint/90 transition hover:border-white/40 hover:bg-white/10"
        :class="{ 'pointer-events-none opacity-60': photoUploading }"
      >
        <input
          type="file"
          class="sr-only"
          accept="image/jpeg,image/png,image/webp,image/heic"
          :disabled="photoUploading"
          @change="onPickPhoto"
        >
        {{ photoUploading ? 'Updating…' : 'Change photo' }}
      </label>

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
