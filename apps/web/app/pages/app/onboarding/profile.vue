<script setup>
import { MAX_IMAGE_INPUT_BYTES } from '~/utils/fileToWebp'
import { uploadProfileAvatarToStorage } from '~/utils/uploadProfileAvatar'

const supabase = useSupabaseClient()

const displayName = ref('')
const photoFile = ref(null)
const previewUrl = ref(null)
const submitting = ref(false)
const formError = ref('')

function validateDisplayName (raw) {
  const s = raw.trim()
  if (s.length === 0) {
    return { ok: false, message: 'Enter a display name.' }
  }
  if (s.length > 100) {
    return { ok: false, message: 'Use at most 100 characters.' }
  }
  return { ok: true, value: s }
}

watch(photoFile, (f) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (f && f instanceof File) {
    previewUrl.value = URL.createObjectURL(f)
  }
})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const uid = session?.user?.id
  if (!uid) {
    await navigateTo('/')
    return
  }
  const complete = await getProfileSetupComplete(supabase, uid)
  if (complete) {
    await navigateTo(appPath('/home'), { replace: true })
  }
})

function onPickPhoto (e) {
  formError.value = ''
  const input = e.target
  const f = input?.files?.[0]
  if (f && f instanceof File && f.size > MAX_IMAGE_INPUT_BYTES) {
    formError.value = 'That photo is too large. Choose a smaller file.'
    photoFile.value = null
    if (input) input.value = ''
    return
  }
  photoFile.value = f ?? null
  if (input) input.value = ''
}

async function signOut () {
  clearProfileSetupCache()
  await supabase.auth.signOut()
  await navigateTo('/')
}

async function submit () {
  formError.value = ''
  const v = validateDisplayName(displayName.value)
  if (!v.ok) {
    formError.value = v.message
    return
  }

  const { data: { session } } = await supabase.auth.getSession()
  const uid = session?.user?.id
  if (!uid) {
    formError.value = 'Not signed in.'
    return
  }

  submitting.value = true
  try {
    let avatarUrl = null
    const file = photoFile.value
    if (file && file instanceof File) {
      const { publicUrl } = await uploadProfileAvatarToStorage(supabase, uid, file)
      avatarUrl = publicUrl
    }

    const payload = {
      display_name: v.value,
      has_completed_profile_setup: true,
    }
    if (avatarUrl) {
      payload.avatar_url = avatarUrl
    }

    const { error: upProfileErr } = await supabase
      .from('profiles')
      .update(payload)
      .eq('profile_id', uid)

    if (upProfileErr) {
      formError.value = upProfileErr.message
      return
    }

    markProfileSetupComplete(uid)
    await navigateTo(appPath('/onboarding/success'))
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <OnboardingShell header-variant="profile">
    <div class="flex w-full flex-1 flex-col pt-2 pb-[clamp(1rem,4vw,2rem)] sm:pt-8">
      <NomiAuthHero class="mb-[clamp(1.25rem,4vw,2rem)]">
        <template #title>
          <span class="text-[clamp(1.75rem,4.5vw,2.5rem)]">Set how you appear</span>
        </template>
        <template #description>
          Friends see this name and photo in the feed. You can skip the photo for now.
        </template>
      </NomiAuthHero>

      <form class="flex flex-1 flex-col gap-[clamp(1rem,3vw,1.5rem)]" @submit.prevent="submit">
        <label class="flex flex-col gap-1.5 text-left">
          <NomiFieldLabel text="Display name" />
          <input
            v-model="displayName"
            type="text"
            class="nomi-cream-field min-w-0 text-base sm:text-lg"
            autocomplete="nickname"
            maxlength="100"
            placeholder="Your name"
          >
        </label>

        <div class="flex flex-col gap-2 text-left">
          <NomiFieldLabel text="Profile photo (optional)" />
          <div class="flex flex-wrap items-center gap-4">
            <div
              class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10"
            >
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt=""
                class="h-full w-full object-cover"
              >
              <span
                v-else
                class="material-symbols-outlined text-3xl text-white/40"
                aria-hidden="true"
              >person</span>
            </div>
            <label
              class="cursor-pointer rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <input
                type="file"
                class="sr-only"
                accept="image/jpeg,image/png,image/webp,image/heic"
                @change="onPickPhoto"
              >
              Choose photo
            </label>
          </div>
        </div>

        <p v-if="formError" class="text-left text-sm font-semibold text-nomi-error" role="alert">
          {{ formError }}
        </p>

        <div class="mt-auto flex flex-col gap-4 pt-[clamp(1rem,4vw,2rem)] pb-2">
          <NomiPrimaryButton type="submit" :disabled="submitting">
            <span>{{ submitting ? 'Saving…' : 'Continue' }}</span>
            <template #trailing>
              <span
                class="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1 sm:text-2xl"
                aria-hidden="true"
              >arrow_forward</span>
            </template>
          </NomiPrimaryButton>

          <button
            type="button"
            class="text-center text-sm font-semibold text-white/55 underline-offset-2 transition hover:text-white/85"
            @click="signOut"
          >
            Sign out
          </button>
        </div>
      </form>
    </div>
  </OnboardingShell>
</template>
