import { GoogleGenAI } from "@google/genai"
import { characterBlueprintSchema } from "./blueprint-schema"
import { logAiCall } from "./log"
import type { CharacterBlueprint } from "@/types/character-blueprint"

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set")
  return new GoogleGenAI({ apiKey })
}

const ANALYSIS_MODEL = "gemini-2.5-flash"
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message
  return (
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("Deadline expired") ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("500") ||
    msg.includes("INTERNAL")
  )
}

export interface ImageInput {
  data: Buffer
  mimeType: string
}

export async function generateText(
  systemPrompt: string,
  userMessage: string,
  logContext?: { caller?: string; persona_id?: string }
): Promise<string> {
  const ai = getClient()
  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "generateText",
    model: ANALYSIS_MODEL,
    persona_id: logContext?.persona_id,
    prompt: userMessage.substring(0, 2000),
    parameters: { system_prompt_length: systemPrompt.length },
  })

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: userMessage,
        config: { systemInstruction: systemPrompt },
      })
      return response.text ?? ""
    } catch (err) {
      console.warn(`[gemini-text] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
      if (!isRetryable(err) || attempt === MAX_RETRIES - 1) throw err
      await sleep(RETRY_DELAY_MS * (attempt + 1))
    }
  }

  throw new Error("generateText failed after retries")
}

export async function analyzeImagesToBlueprint(
  systemPrompt: string,
  images: ImageInput[],
  logContext?: { caller?: string; persona_id?: string }
): Promise<CharacterBlueprint> {
  const ai = getClient()

  logAiCall({
    caller: logContext?.caller ?? "unknown",
    action: "analyzeImagesToBlueprint",
    model: ANALYSIS_MODEL,
    persona_id: logContext?.persona_id,
    parameters: { image_count: images.length },
  })

  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.data.toString("base64"),
      mimeType: img.mimeType,
    },
  }))

  const n = images.length
  const textInstruction =
    n === 1
      ? "Analyze this image and produce the full character blueprint JSON. Be extremely detailed and precise. For any features that are not visible or occluded, write 'not visible — occluded by [reason]'. Auto-populate must_keep_traits with the 5-8 most distinctive features."
      : `Analyze these ${n} reference images of the SAME person and produce a single consolidated character blueprint JSON. Cross-reference all images to get the most accurate and complete description. Where images show different angles, use them to fill in details that may be occluded in other views. For features not visible in any image, write 'not visible — occluded by [reason]'. Auto-populate must_keep_traits with the 5-8 most distinctive features.`

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: [
          {
            role: "user",
            parts: [...imageParts, { text: textInstruction }],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      })

      const raw = response.text ?? "{}"
      const result = characterBlueprintSchema.safeParse(JSON.parse(raw))
      if (!result.success) {
        console.error("Gemini response failed Zod validation:", result.error.issues.slice(0, 5))
        return JSON.parse(raw) as CharacterBlueprint
      }
      return result.data as CharacterBlueprint
    } catch (err) {
      console.warn(`[gemini-analyze] attempt ${attempt + 1} threw:`, err instanceof Error ? err.message : err)
      if (!isRetryable(err) || attempt === MAX_RETRIES - 1) throw err
      await sleep(RETRY_DELAY_MS * (attempt + 1))
    }
  }

  throw new Error("analyzeImagesToBlueprint failed after retries")
}
