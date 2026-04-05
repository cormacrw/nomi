/**
 * Decode an image file to canvas pixels, then encode as WebP or JPEG fallback.
 * HEIC and exotic formats may fail in non-Safari browsers.
 */
export async function fileToWebpOrJpeg (file: File): Promise<{ blob: Blob, mime: 'image/webp' | 'image/jpeg' }> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('Could not read this image. Try JPEG or PNG, or use Safari for HEIC.')
  }

  const maxEdge = 4096
  let { width, height } = bitmap
  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not prepare image')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const webpBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/webp', 0.92)
  })
  if (webpBlob && webpBlob.size > 0) {
    return { blob: webpBlob, mime: 'image/webp' }
  }

  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92)
  })
  if (jpegBlob && jpegBlob.size > 0) {
    return { blob: jpegBlob, mime: 'image/jpeg' }
  }

  throw new Error('Could not compress image')
}
