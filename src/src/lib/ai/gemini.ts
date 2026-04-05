import { GoogleGenerativeAI } from "@google/generative-ai"

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set")
  return new GoogleGenerativeAI(apiKey)
}

export async function generateText(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  })
  const result = await model.generateContent(userMessage)
  return result.response.text()
}

export async function analyzeImage(
  systemPrompt: string,
  imageBytes: Buffer,
  mimeType: string
): Promise<string> {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  })
  const result = await model.generateContent([
    { inlineData: { data: imageBytes.toString("base64"), mimeType } },
    "Analyze this face and output the trait JSON.",
  ])
  return result.response.text()
}
