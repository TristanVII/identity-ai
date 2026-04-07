import { GoogleGenAI } from "@google/genai"
import { logAiCall } from "./log"

const IMAGE_MODEL =
  process.env.NODE_ENV === "production"
    ? "gemini-3.1-flash-image-preview"
    : "gemini-2.5-flash-image"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set")
  return new GoogleGenAI({ apiKey })
}

export interface ImagenResult {
  imageBytes: Buffer
  mimeType: string
}

export interface ImageGenOptions {
  aspectRatio?: string
  imageSize?: string
  allowText?: boolean
}

export interface ImageLogContext {
  caller?: string
  persona_id?: string
}

function buildConfig(options?: ImageGenOptions) {
  return {
    responseModalities: options?.allowText ? ["TEXT", "IMAGE"] : ["IMAGE"],
    imageConfig: {
      aspectRatio: options?.aspectRatio ?? "1:1",
      imageSize: options?.imageSize ?? "1K",
    },
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromResponse(response: any): { image?: ImagenResult; text?: string } {
  // Log safety/block feedback if present
  const feedback = response.promptFeedback
  if (feedback?.blockReason) {
    console.warn("[imagen] Prompt blocked:", feedback.blockReason, feedback.safetyRatings)
  }

  const parts = response.candidates?.[0]?.content?.parts
  if (!parts) return {}

  let image: ImagenResult | undefined
  let text: string | undefined

  for (const part of parts) {
    if (part.inlineData && !image) {
      image = {
        imageBytes: Buffer.from(part.inlineData.data || "", "base64"),
        mimeType: part.inlineData.mimeType || "image/png",
      }
    } else if (part.text && !text) {
      text = part.text
    }
  }

  return { image, text }
}

export async function generateImage(prompt: string, options?: ImageGenOptions, logContext?: ImageLogContext): Promise<ImagenResult> {
  const ai = getClient()
  const config = buildConfig(options)

  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "generateImage",
    model: IMAGE_MODEL,
    persona_id: logContext?.persona_id,
    prompt: prompt.substring(0, 2000),
    parameters: { aspectRatio: config.imageConfig.aspectRatio, imageSize: config.imageConfig.imageSize },
  })

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: prompt,
        config,
      })

      const { image, text } = extractFromResponse(response)
      if (image) return image

      console.warn(`[imagen] attempt ${attempt + 1}: no image. Model said: ${text ?? "(nothing)"}`)
    } catch (err) {
      console.warn(`[imagen] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
    }

    if (attempt < MAX_RETRIES - 1) await sleep(RETRY_DELAY_MS * (attempt + 1))
  }

  throw new Error("Image generation failed after retries")
}

export async function generateImageWithReference(
  prompt: string,
  referenceImageBytes: Buffer,
  referenceMimeType: string,
  options?: ImageGenOptions,
  logContext?: ImageLogContext
): Promise<ImagenResult> {
  const ai = getClient()
  const config = buildConfig(options)

  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "generateImageWithReference",
    model: IMAGE_MODEL,
    persona_id: logContext?.persona_id,
    prompt: prompt.substring(0, 2000),
    parameters: {
      aspectRatio: config.imageConfig.aspectRatio,
      imageSize: config.imageConfig.imageSize,
      referenceMimeType,
      referenceSize: referenceImageBytes.length,
    },
  })

  const contents = [
    { text: prompt },
    { inlineData: { mimeType: referenceMimeType, data: referenceImageBytes.toString("base64") } },
  ]

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents,
        config,
      })

      const { image, text } = extractFromResponse(response)
      if (image) return image

      console.warn(`[imagen-ref] attempt ${attempt + 1}: no image. Model said: ${text ?? "(nothing)"}`)
    } catch (err) {
      console.warn(`[imagen-ref] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
    }

    if (attempt < MAX_RETRIES - 1) await sleep(RETRY_DELAY_MS * (attempt + 1))
  }

  // Fallback: try without reference image
  console.warn("[imagen-ref] all retries with reference failed, falling back to text-only generation")
  return generateImage(prompt, options, logContext)
}

export async function editImageWithReference(
  prompt: string,
  sourceImageBytes: Buffer,
  sourceMimeType: string,
  referenceImageBytes: Buffer,
  referenceMimeType: string,
  options?: ImageGenOptions,
  logContext?: ImageLogContext
): Promise<ImagenResult> {
  const ai = getClient()
  const config = buildConfig(options)

  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "editImageWithReference",
    model: IMAGE_MODEL,
    persona_id: logContext?.persona_id,
    prompt: prompt.substring(0, 2000),
    parameters: {
      aspectRatio: config.imageConfig.aspectRatio,
      imageSize: config.imageConfig.imageSize,
      sourceSize: sourceImageBytes.length,
      referenceSize: referenceImageBytes.length,
    },
  })

  const contents = [
    { text: prompt },
    { inlineData: { mimeType: sourceMimeType, data: sourceImageBytes.toString("base64") } },
    { inlineData: { mimeType: referenceMimeType, data: referenceImageBytes.toString("base64") } },
  ]

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents,
        config,
      })

      const { image, text } = extractFromResponse(response)
      if (image) return image

      console.warn(`[imagen-edit] attempt ${attempt + 1}: no image. Model said: ${text ?? "(nothing)"}`)
    } catch (err) {
      console.warn(`[imagen-edit] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
    }

    if (attempt < MAX_RETRIES - 1) await sleep(RETRY_DELAY_MS * (attempt + 1))
  }

  throw new Error("Image edit failed after retries")
}

/**
 * Edit a specific region of an image using a visual annotation.
 * Sends three images: the annotated image (with circle overlay), the clean original, and a reference sheet.
 */
export async function editWithAnnotation(
  prompt: string,
  annotatedImageBytes: Buffer,
  annotatedMimeType: string,
  cleanImageBytes: Buffer,
  cleanMimeType: string,
  referenceImageBytes: Buffer,
  referenceMimeType: string,
  options?: ImageGenOptions,
  logContext?: ImageLogContext
): Promise<ImagenResult> {
  const ai = getClient()
  const config = buildConfig(options)

  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "editWithAnnotation",
    model: IMAGE_MODEL,
    persona_id: logContext?.persona_id,
    prompt: prompt.substring(0, 2000),
    parameters: {
      aspectRatio: config.imageConfig.aspectRatio,
      imageSize: config.imageConfig.imageSize,
      annotatedSize: annotatedImageBytes.length,
      cleanSize: cleanImageBytes.length,
      referenceSize: referenceImageBytes.length,
    },
  })

  const contents = [
    { text: prompt },
    { inlineData: { mimeType: annotatedMimeType, data: annotatedImageBytes.toString("base64") } },
    { inlineData: { mimeType: cleanMimeType, data: cleanImageBytes.toString("base64") } },
    { inlineData: { mimeType: referenceMimeType, data: referenceImageBytes.toString("base64") } },
  ]

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents,
        config,
      })

      const { image, text } = extractFromResponse(response)
      if (image) return image

      console.warn(`[imagen-annotate] attempt ${attempt + 1}: no image. Model said: ${text ?? "(nothing)"}`)
    } catch (err) {
      console.warn(`[imagen-annotate] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
    }

    if (attempt < MAX_RETRIES - 1) await sleep(RETRY_DELAY_MS * (attempt + 1))
  }

  // Fallback: try plain edit without annotation
  console.warn("[imagen-annotate] all retries failed, falling back to plain edit")
  return editImageWithReference(prompt, cleanImageBytes, cleanMimeType, referenceImageBytes, referenceMimeType, options, logContext)
}
