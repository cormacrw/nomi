import type { SupabaseClient } from '@supabase/supabase-js'
import { fileToWebpOrJpeg, MAX_IMAGE_INPUT_BYTES, AVATAR_MAX_LONG_EDGE } from '~/utils/fileToWebp'

const BUCKET = 'profile_avatars'

/**
 * Compress, upload to public profile_avatars bucket (upsert), return public URL.
 * @throws Error with user-facing message on validation or upload failure
 */
export async function uploadProfileAvatarToStorage (
  supabase: SupabaseClient,
  uid: string,
  file: File,
): Promise<{ publicUrl: string }> {
  if (file.size > MAX_IMAGE_INPUT_BYTES) {
    throw new Error('That photo is too large. Choose a smaller file.')
  }
  const { blob, mime } = await fileToWebpOrJpeg(file, { maxLongEdge: AVATAR_MAX_LONG_EDGE })
  const ext = mime === 'image/webp' ? 'webp' : 'jpg'
  const path = `${uid}/avatar.${ext}`
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: mime, upsert: true })
  if (upErr) {
    throw new Error(upErr.message)
  }
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { publicUrl: pub.publicUrl }
}
