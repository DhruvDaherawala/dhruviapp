import { type NextRequest, NextResponse } from "next/server"
import { geminiApi } from "@/lib/gemini-api"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    // Check if API is configured
    if (!geminiApi.isConfigured()) {
      console.error("Gemini API is not properly configured")
      return NextResponse.json(
        {
          error: "AI service is not properly configured. Please check the API key setup.",
          details: "Make sure GEMINI_API_KEY is set in your environment variables.",
        },
        { status: 500 },
      )
    }

    const body = await req.json()
    const { message } = body

    // Validate request
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Validate message length
    if (message.length > 4000) {
      return NextResponse.json({ error: "Message is too long. Please keep it under 4000 characters." }, { status: 400 })
    }

    // Trim and validate message content
    const trimmedMessage = message.trim()
    if (trimmedMessage.length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
    }

    console.log("Processing chat request:", { messageLength: trimmedMessage.length })

    // Send message to Gemini API
    const response = await geminiApi.sendMessage(trimmedMessage)

    if (response.success) {
      console.log("Chat request successful")
      return NextResponse.json({
        success: true,
        message: response.message,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error("Chat request failed:", response.error)
      return NextResponse.json({ error: response.error }, { status: 500 })
    }
  } catch (error) {
    console.error("API Route Error:", error)

    // More specific error handling
    let errorMessage = "Internal server error. Please try again later."

    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        errorMessage = "Invalid request format. Please try again."
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again."
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST to send messages." }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed. Use POST to send messages." }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed. Use POST to send messages." }, { status: 405 })
}
