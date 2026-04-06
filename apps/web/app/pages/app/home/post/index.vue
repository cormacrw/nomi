<script setup>
import { fileToWebpOrJpeg, MAX_IMAGE_INPUT_BYTES, POST_MAX_LONG_EDGE } from '~/utils/fileToWebp'

definePageMeta({
  layout: 'app',
  appShell: 'none',
})

const CAPTION_MAX = 280
const MAX_PHOTOS = 5

const supabase = useSupabaseClient()

/** @type {import('vue').Ref<'pick' | 'caption' | 'review' | 'error'>} */
const step = ref('pick')
const caption = ref('')

/** @type {import('vue').Ref<{ id: string, file: File, url: string }[]>} */
const items = ref([])

const fileInputRef = ref(null)
const publishing = ref(false)
const uploadMessage = ref('')
const pickError = ref('')
const pendingPostId = ref(null)
/** @type {import('vue').Ref<Set<number>>} */
const completedMediaIndices = ref(new Set())
/** @type {import('vue').Ref<string[]>} */
const uploadedStoragePaths = ref([])

let dragSourceIndex = null

function revokeUrls () {
  for (const it of items.value) {
    URL.revokeObjectURL(it.url)
  }
}

onUnmounted(() => {
  revokeUrls()
})

function addFiles (fileList) {
  pickError.value = ''
  const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
  const room = MAX_PHOTOS - items.value.length
  const take = incoming.slice(0, Math.max(0, room))
  let skippedLarge = 0
  for (const file of take) {
    if (file.size > MAX_IMAGE_INPUT_BYTES) {
      skippedLarge++
      continue
    }
    items.value = [
      ...items.value,
      { id: crypto.randomUUID(), file, url: URL.createObjectURL(file) },
    ]
  }
  if (skippedLarge > 0) {
    pickError.value = skippedLarge === 1
      ? 'That photo is too large to upload. Choose a smaller file.'
      : 'Some photos were too large and were skipped.'
  }
}

function openPicker () {
  fileInputRef.value?.click()
}

function onFileChange (e) {
  const el = e.target
  if (el && 'files' in el && el.files?.length) {
    addFiles(el.files)
    el.value = ''
  }
}

function removeAt (index) {
  const next = [...items.value]
  const [gone] = next.splice(index, 1)
  if (gone) URL.revokeObjectURL(gone.url)
  items.value = next
}

function onDragStart (index) {
  dragSourceIndex = index
}

function onDragEnd () {
  dragSourceIndex = null
}

function onDragOver (e) {
  e.preventDefault()
}

function onDrop (targetIndex) {
  const from = dragSourceIndex
  dragSourceIndex = null
  if (from === null || from === targetIndex) return
  const arr = [...items.value]
  const [row] = arr.splice(from, 1)
  arr.splice(targetIndex, 0, row)
  items.value = arr
}

function clampCaption (raw) {
  if (raw.length <= CAPTION_MAX) return raw
  return raw.slice(0, CAPTION_MAX)
}

function onCaptionInput (e) {
  caption.value = clampCaption(e.target.value)
}

function onCaptionPaste (e) {
  e.preventDefault()
  const text = (e.clipboardData?.getData('text/plain') ?? '')
  const el = e.target
  const start = el.selectionStart ?? caption.value.length
  const end = el.selectionEnd ?? caption.value.length
  const before = caption.value.slice(0, start)
  const after = caption.value.slice(end)
  const merged = clampCaption(before + text + after)
  caption.value = merged
  nextTick(() => {
    const pos = Math.min(start + text.length, CAPTION_MAX)
    el.setSelectionRange(pos, pos)
  })
}

const canNextFromPick = computed(() => items.value.length >= 1)

function goNextFromPick () {
  if (!canNextFromPick.value) return
  step.value = 'caption'
}

function goNextFromCaption () {
  step.value = 'review'
}

function headerTitle () {
  if (step.value === 'pick' || step.value === 'error') return 'New post'
  if (step.value === 'caption') return 'Caption'
  return 'Review'
}

function goBack () {
  if (step.value === 'error') {
    step.value = 'review'
    return
  }
  if (step.value === 'review') {
    step.value = 'caption'
    return
  }
  if (step.value === 'caption') {
    step.value = 'pick'
    return
  }
  navigateTo(appPath('/home'))
}

async function goEditFromReview () {
  if (pendingPostId.value) {
    publishing.value = true
    try {
      await cleanupFailedPublish()
    } catch (e) {
      uploadMessage.value = e instanceof Error ? e.message : 'Could not reset upload'
      step.value = 'error'
      publishing.value = false
      return
    }
    publishing.value = false
  }
  step.value = 'pick'
}

async function cleanupFailedPublish () {
  const pid = pendingPostId.value
  const paths = [...uploadedStoragePaths.value]
  if (!pid) return
  for (const p of paths) {
    await supabase.storage.from('post_media').remove([p])
  }
  await supabase.from('posts').delete().eq('post_id', pid)
  pendingPostId.value = null
  uploadedStoragePaths.value = []
  completedMediaIndices.value = new Set()
}

function resetWizardState () {
  revokeUrls()
  items.value = []
  caption.value = ''
  step.value = 'pick'
  uploadMessage.value = ''
  pickError.value = ''
  pendingPostId.value = null
  uploadedStoragePaths.value = []
  completedMediaIndices.value = new Set()
}

async function cancelUploadError () {
  publishing.value = true
  try {
    await cleanupFailedPublish()
  } catch {
    // Still leave the wizard; orphaned rows/objects may need ops cleanup
  } finally {
    publishing.value = false
  }
  resetWizardState()
  await navigateTo(appPath('/home'))
}

async function publishOrResume () {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    uploadMessage.value = 'Not signed in'
    step.value = 'error'
    return
  }

  const files = items.value.map((i) => i.file)
  if (files.length === 0) return

  publishing.value = true
  uploadMessage.value = ''

  try {
    let postId = pendingPostId.value
    if (!postId) {
      const { data: post, error: insPostErr } = await supabase
        .from('posts')
        .insert({
          author_profile_id: user.id,
          caption: caption.value,
        })
        .select('post_id')
        .single()

      if (insPostErr || !post) {
        throw new Error(insPostErr?.message ?? 'Could not create post')
      }
      postId = post.post_id
      pendingPostId.value = postId
    } else {
      const { error: capErr } = await supabase
        .from('posts')
        .update({ caption: caption.value })
        .eq('post_id', postId)
      if (capErr) {
        throw new Error(capErr.message)
      }
    }

    for (let i = 0; i < files.length; i++) {
      if (completedMediaIndices.value.has(i)) continue

      uploadMessage.value = `Uploading ${i + 1} of ${files.length}`

      const { blob, mime } = await fileToWebpOrJpeg(files[i], { maxLongEdge: POST_MAX_LONG_EDGE })
      const ext = mime === 'image/webp' ? 'webp' : 'jpg'
      const path = `${postId}/${crypto.randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('post_media')
        .upload(path, blob, {
          contentType: mime,
          upsert: false,
        })

      if (upErr) {
        throw new Error(upErr.message)
      }

      uploadedStoragePaths.value = [...uploadedStoragePaths.value, path]

      const { error: rowErr } = await supabase.from('post_media').insert({
        post_id: postId,
        sort_order: i,
        storage_path: path,
        mime_type: mime,
      })

      if (rowErr) {
        throw new Error(rowErr.message)
      }

      completedMediaIndices.value = new Set([...completedMediaIndices.value, i])
    }

    pendingPostId.value = null
    uploadedStoragePaths.value = []
    completedMediaIndices.value = new Set()
    revokeUrls()
    items.value = []
    caption.value = ''

    await navigateTo(appPath('/home'))
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed'
    uploadMessage.value = msg
    step.value = 'error'
  } finally {
    publishing.value = false
  }
}

async function retryUpload () {
  await publishOrResume()
}
</script>

<template>
  <div
    class="mx-auto flex min-h-dvh w-full max-w-md flex-col px-[max(1rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))]"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      @change="onFileChange"
    >

    <PostWizardHeader :title="headerTitle()" @back="goBack" />

    <!-- POST-02 Pick media -->
    <div v-if="step === 'pick'" class="flex min-h-0 flex-1 flex-col">
      <p class="mb-3 text-center text-sm text-white/70">
        {{ items.length }} of {{ MAX_PHOTOS }}
      </p>
      <p
        v-if="pickError"
        class="mb-3 rounded-xl border border-nomi-error/50 bg-black/25 px-3 py-2 text-center text-sm text-nomi-error"
        role="alert"
      >
        {{ pickError }}
      </p>
      <div class="grid grid-cols-3 gap-2 sm:gap-3">
        <div
          v-for="(it, index) in items"
          :key="it.id"
          draggable="true"
          class="relative aspect-square cursor-grab touch-manipulation overflow-hidden rounded-2xl border border-white/20 active:cursor-grabbing"
          @dragstart="onDragStart(index)"
          @dragend="onDragEnd"
          @dragover="onDragOver"
          @drop="onDrop(index)"
        >
          <img
            :src="it.url"
            alt=""
            class="h-full w-full object-cover"
            draggable="false"
          >
          <span
            class="absolute left-2 top-2 flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-black/45 px-2 text-xs font-bold text-white"
          >
            {{ index + 1 }}
          </span>
          <button
            type="button"
            class="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Remove photo"
            @click="removeAt(index)"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <button
          v-if="items.length < MAX_PHOTOS"
          type="button"
          class="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-white/35 bg-white/5 text-white/90 transition hover:border-white/55 hover:bg-white/10"
          aria-label="Add photos"
          @click="openPicker"
        >
          <span class="material-symbols-outlined text-4xl">add</span>
        </button>
      </div>

      <div class="mt-auto flex flex-1 flex-col justify-end pt-8">
        <NomiPrimaryButton
          :disabled="!canNextFromPick"
          @click="goNextFromPick"
        >
          Next
        </NomiPrimaryButton>
      </div>
    </div>

    <!-- POST-03 Caption -->
    <div v-else-if="step === 'caption'" class="flex min-h-0 flex-1 flex-col">
      <div class="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <img
          v-for="it in items"
          :key="it.id"
          :src="it.url"
          alt=""
          class="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-white/25"
        >
      </div>
      <div class="relative min-h-[12rem] flex-1">
        <textarea
          :value="caption"
          rows="6"
          maxlength="280"
          placeholder="Write a caption…"
          class="h-full min-h-[12rem] w-full resize-none rounded-2xl border-0 bg-transparent px-1 py-2 font-sans text-[1.0625rem] leading-relaxed text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/30"
          @input="onCaptionInput"
          @paste="onCaptionPaste"
        />
        <p class="pointer-events-none absolute bottom-2 right-2 text-xs text-white/50">
          {{ caption.length }} / {{ CAPTION_MAX }}
        </p>
      </div>
      <div class="mt-6">
        <NomiPrimaryButton @click="goNextFromCaption">
          Next
        </NomiPrimaryButton>
      </div>
    </div>

    <!-- POST-04 Review -->
    <div v-else-if="step === 'review'" class="flex min-h-0 flex-1 flex-col">
      <div
        class="relative mb-4 min-h-[14rem] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/20"
      >
        <div
          class="flex h-full min-h-[14rem] snap-x snap-mandatory gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <img
            v-for="it in items"
            :key="it.id"
            :src="it.url"
            alt=""
            class="h-full w-full min-w-full shrink-0 snap-center object-contain"
          >
        </div>
        <p
          v-if="items.length > 1"
          class="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-white/70"
        >
          Swipe for more
        </p>
      </div>
      <p class="mb-2 whitespace-pre-wrap font-sans text-[1.0625rem] leading-relaxed text-white/95">
        {{ caption || 'No caption' }}
      </p>
      <p class="mb-6 text-sm text-white/65">
        Visible to friends
      </p>
      <div class="mt-auto flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          class="order-2 flex min-h-[3.75rem] flex-1 items-center justify-center rounded-full border border-white/35 bg-transparent px-6 font-headline text-[clamp(1rem,3vw,1.125rem)] font-bold text-white transition hover:bg-white/10 sm:order-1 sm:min-h-[5rem]"
          :disabled="publishing"
          @click="goEditFromReview"
        >
          Edit
        </button>
        <NomiPrimaryButton
          class="order-1 flex-1 sm:order-2"
          :disabled="publishing"
          @click="publishOrResume"
        >
          {{ publishing ? 'Publishing…' : 'Publish' }}
        </NomiPrimaryButton>
      </div>
    </div>

    <!-- Upload error -->
    <div v-else class="flex min-h-0 flex-1 flex-col">
      <div
        class="mb-4 rounded-2xl border border-nomi-error/60 bg-black/25 px-4 py-3 text-sm leading-relaxed text-nomi-error"
        role="alert"
      >
        {{ uploadMessage || 'Something went wrong while uploading.' }}
      </div>
      <p v-if="publishing === false && uploadMessage" class="mb-2 text-center text-xs text-white/60">
        You can retry or cancel and start over.
      </p>
      <div class="mt-auto flex flex-col gap-3">
        <NomiPrimaryButton
          :disabled="publishing"
          @click="retryUpload"
        >
          Retry
        </NomiPrimaryButton>
        <button
          type="button"
          class="flex min-h-[3.25rem] items-center justify-center rounded-full border border-white/35 bg-transparent px-6 font-headline text-base font-bold text-white transition hover:bg-white/10"
          :disabled="publishing"
          @click="cancelUploadError"
        >
          {{ publishing ? 'Cleaning up…' : 'Cancel' }}
        </button>
      </div>
    </div>
  </div>
</template>
