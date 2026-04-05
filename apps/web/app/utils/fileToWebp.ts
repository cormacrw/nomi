/**
 * Decode an image file, downscale for MVP, then encode as WebP or JPEG fallback.
 * HEIC and exotic formats may fail in non-Safari browsers.
 */

export const MAX_IMAGE_INPUT_BYTES = 25 * 1024 * 1024
/** Keep under Supabase bucket file_size_limit (10 MiB) */
export const MAX_OUTPUT_BYTES = Math.floor(9.5 * 1024 * 1024)
export const MAX_MEGAPIXELS = 40_000_000
export const DEFAULT_ENCODE_QUALITY = 0.85
export const POST_MAX_LONG_EDGE = 1600
export const AVATAR_MAX_LONG_EDGE = 512

const HEAD_BYTES = 65536

export type FileToWebpOptions = {
  maxLongEdge?: number
  quality?: number
}

async function readFileHead (file: File, maxBytes: number): Promise<Uint8Array> {
  const n = Math.min(file.size, maxBytes)
  const buf = await file.slice(0, n).arrayBuffer()
  return new Uint8Array(buf)
}

function parseJpegDimensions (buf: Uint8Array): { width: number, height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    i += 2
    if (marker === 0xd8 || marker === 0xd9) continue
    if (marker === 0xda) break
    const len = (buf[i] << 8) | buf[i + 1]
    if (len < 2 || i + len > buf.length) return null
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const h = (buf[i + 3] << 8) | buf[i + 4]
      const w = (buf[i + 5] << 8) | buf[i + 6]
      if (w > 0 && h > 0) return { width: w, height: h }
    }
    i += len
  }
  return null
}

function parsePngDimensions (buf: Uint8Array): { width: number, height: number } | null {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  for (let j = 0; j < 8; j++) {
    if (buf[j] !== sig[j]) return null
  }
  if (buf.length < 24) return null
  const w = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19]
  const h = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23]
  if (w <= 0 || h <= 0) return null
  return { width: w, height: h }
}

function parseWebpDimensions (buf: Uint8Array): { width: number, height: number } | null {
  if (buf.length < 30) return null
  if (buf[0] !== 0x52 || buf[1] !== 0x49 || buf[2] !== 0x46 || buf[3] !== 0x46) return null
  if (buf[8] !== 0x57 || buf[9] !== 0x45 || buf[10] !== 0x42 || buf[11] !== 0x50) return null
  let offset = 12
  while (offset + 8 <= buf.length) {
    const id = String.fromCharCode(buf[offset], buf[offset + 1], buf[offset + 2], buf[offset + 3])
    const chunkSize = buf[offset + 4] | (buf[offset + 5] << 8) | (buf[offset + 6] << 16) | (buf[offset + 7] << 24)
    const dataStart = offset + 8
    const paddedSize = chunkSize + (chunkSize % 2)
    if (id === 'VP8X' && chunkSize >= 10 && dataStart + 7 <= buf.length) {
      const w = 1 + (buf[dataStart + 1] | (buf[dataStart + 2] << 8) | (buf[dataStart + 3] << 16))
      const h = 1 + (buf[dataStart + 4] | (buf[dataStart + 5] << 8) | (buf[dataStart + 6] << 16))
      if (w > 0 && h > 0) return { width: w, height: h }
    }
    if (id === 'VP8 ' && chunkSize >= 10 && dataStart + 10 <= buf.length) {
      if (buf[dataStart] === 0x9d && buf[dataStart + 1] === 0x01 && buf[dataStart + 2] === 0x2a) {
        const w = (buf[dataStart + 6] | (buf[dataStart + 7] << 8)) & 0x3fff
        const h = (buf[dataStart + 8] | (buf[dataStart + 9] << 8)) & 0x3fff
        if (w > 0 && h > 0) return { width: w, height: h }
      }
    }
    if (id === 'VP8L' && chunkSize >= 5 && dataStart + 5 <= buf.length) {
      if (buf[dataStart] === 0x2f) {
        const bits = buf[dataStart + 1] | (buf[dataStart + 2] << 8) | (buf[dataStart + 3] << 16) | (buf[dataStart + 4] << 24)
        const w = (bits & 0x3fff) + 1
        const h = ((bits >> 14) & 0x3fff) + 1
        if (w > 0 && h > 0) return { width: w, height: h }
      }
    }
    offset += 8 + paddedSize
    if (offset > buf.length) break
  }
  return null
}

export async function sniffImageDimensions (file: File): Promise<{ width: number, height: number } | null> {
  const buf = await readFileHead(file, HEAD_BYTES)
  const t = file.type
  if (t === 'image/jpeg' || t === 'image/jpg') {
    return parseJpegDimensions(buf)
  }
  if (t === 'image/png') {
    return parsePngDimensions(buf)
  }
  if (t === 'image/webp') {
    return parseWebpDimensions(buf)
  }
  return parseJpegDimensions(buf) ?? parsePngDimensions(buf) ?? parseWebpDimensions(buf)
}

function fitInsideBox (width: number, height: number, maxLongEdge: number): { width: number, height: number } {
  const longEdge = Math.max(width, height)
  if (longEdge <= maxLongEdge) {
    return { width, height }
  }
  const scale = maxLongEdge / longEdge
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/** Decode with EXIF orientation applied when supported; then scale proportionally (preserves aspect ratio). */
async function decodeWithCanvasFallback (file: File, maxLongEdge: number): Promise<ImageBitmap> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    try {
      bitmap = await createImageBitmap(file)
    } catch {
      throw new Error('Could not read this image. Try JPEG or PNG, or use Safari for HEIC.')
    }
  }
  const scaled = fitInsideBox(bitmap.width, bitmap.height, maxLongEdge)
  const w = scaled.width
  const h = scaled.height
  if (bitmap.width === w && bitmap.height === h) {
    return bitmap
  }
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not prepare image')
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  try {
    return await createImageBitmap(canvas)
  } catch {
    throw new Error('Could not prepare image')
  }
}

async function encodeBitmapToWebpOrJpeg (
  bitmap: ImageBitmap,
  quality: number,
): Promise<{ blob: Blob, mime: 'image/webp' | 'image/jpeg' }> {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not prepare image')
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const webpBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/webp', quality)
  })
  if (webpBlob && webpBlob.size > 0) {
    if (webpBlob.size > MAX_OUTPUT_BYTES) {
      throw new Error('Compressed image is still too large. Try a different photo.')
    }
    return { blob: webpBlob, mime: 'image/webp' }
  }

  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
  })
  if (jpegBlob && jpegBlob.size > 0) {
    if (jpegBlob.size > MAX_OUTPUT_BYTES) {
      throw new Error('Compressed image is still too large. Try a different photo.')
    }
    return { blob: jpegBlob, mime: 'image/jpeg' }
  }

  throw new Error('Could not compress image')
}

export async function fileToWebpOrJpeg (
  file: File,
  options: FileToWebpOptions = {},
): Promise<{ blob: Blob, mime: 'image/webp' | 'image/jpeg' }> {
  const maxLongEdge = options.maxLongEdge ?? POST_MAX_LONG_EDGE
  const quality = options.quality ?? DEFAULT_ENCODE_QUALITY

  if (file.size > MAX_IMAGE_INPUT_BYTES) {
    throw new Error('This image file is too large. Choose a smaller photo or lower camera resolution.')
  }

  const sniffed = await sniffImageDimensions(file)
  if (sniffed) {
    const pixels = sniffed.width * sniffed.height
    if (pixels > MAX_MEGAPIXELS) {
      throw new Error('This image has too many pixels. Try a smaller photo.')
    }
  }

  // Always decode then scale on canvas. Sniffed dimensions ignore EXIF orientation; using them with
  // createImageBitmap({ resizeWidth, resizeHeight }) caused wrong aspect (e.g. squashed phone JPEGs).
  const bitmap = await decodeWithCanvasFallback(file, maxLongEdge)

  return encodeBitmapToWebpOrJpeg(bitmap, quality)
}
