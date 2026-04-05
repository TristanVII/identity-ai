import { GoogleGenerativeAI } from "@google/generative-ai"

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set")
  return new GoogleGenerativeAI(apiKey)
}

export interface ImagenResult {
  imageBytes: Buffer
  mimeType: string
}

export async function generateImage(prompt: string): Promise<ImagenResult> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: "imagen-3.0-generate-002" })

  const result = await model.generateContent(prompt)
  const response = result.response
  const parts = response.candidates?.[0]?.content?.parts

  if (!parts || parts.length === 0) {
    throw new Error("No image generated — the model returned no parts")
  }

  const imagePart = parts.find((p) => p.inlineData)
  if (!imagePart?.inlineData) {
    throw new Error("No image data in model response")
  }

  return {
    imageBytes: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType,
  }
}

export async function generateImageWithReference(
  prompt: string,
  referenceImageBytes: Buffer,
  referenceMimeType: string
): Promise<ImagenResult> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: "imagen-3.0-generate-002" })

  const result = await model.generateContent([
    { inlineData: { data: referenceImageBytes.toString("base64"), mimeType: referenceMimeType } },
    prompt,
  ])
  const response = result.response
  const parts = response.candidates?.[0]?.content?.parts
  const imagePart = parts?.find((p) => p.inlineData)

  if (!imagePart?.inlineData) {
    throw new Error("No image data in model response")
  }

  return {
    imageBytes: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType,
  }
}
