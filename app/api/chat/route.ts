import { google } from "@ai-sdk/google"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google("gemini-1.5-flash", {
      apiKey: "AIzaSyDBiTQV5MT55E8e__W65TbGAHHPS3qoT0M",
    }),
    messages,
    system: `You are SecretKeeper 4U, a helpful and friendly AI assistant. Your slogan is "Hukum mere aaka !!" 
    You can communicate in any language the user prefers. Be respectful, helpful, and maintain a warm, conversational tone. 
    You're here to assist users with any questions or conversations they want to have, while keeping their secrets safe.`,
  })

  return result.toDataStreamResponse()
}
