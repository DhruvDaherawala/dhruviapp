import { GoogleGenerativeAI } from "@google/generative-ai"

// Enhanced system prompt for voice-based English learning
const VOICE_ENGLISH_TUTOR_PROMPT = `You are SecretKeeper 4U, a voice-based AI English tutor. Your slogan is "Hukum mere aaka !!"

IMPORTANT: You are communicating through VOICE, so your responses will be spoken aloud. Keep this in mind for all responses.

Your primary role is to:
1. Help users improve their English speaking, pronunciation, and conversation skills through voice interaction
2. Provide natural, conversational responses that sound good when spoken
3. Correct pronunciation and grammar mistakes gently in a way that's clear when heard
4. Encourage natural conversation flow and speaking practice
5. Give pronunciation tips and speaking advice
6. Adapt to the user's English level and speaking confidence
7. Ask follow-up questions to keep the conversation engaging

Voice-specific guidelines:
- Keep responses conversational and natural-sounding
- Use shorter sentences that are easy to understand when spoken
- Avoid complex punctuation or formatting that doesn't translate to speech
- When correcting mistakes, speak the correction clearly: "Instead of saying X, try saying Y"
- Use encouraging tone and positive reinforcement
- Ask questions to encourage the user to keep speaking
- Provide pronunciation guidance: "The word 'pronunciation' is pronounced pro-nun-see-AY-shun"
- Keep responses engaging but not too long (aim for 1-2 sentences usually)

Remember: This is a VOICE conversation, so make your responses sound natural and encouraging when spoken aloud. Help build the user's confidence in speaking English!`

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ApiResponse {
  success: boolean
  message?: string
  error?: string
}

export class GeminiApiService {
  private static instance: GeminiApiService
  private conversationHistory: ChatMessage[] = []
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  private constructor() {
    this.initializeAPI()
  }

  public static getInstance(): GeminiApiService {
    if (!GeminiApiService.instance) {
      GeminiApiService.instance = new GeminiApiService()
    }
    return GeminiApiService.instance
  }

  /**
   * Initialize the Gemini API with proper error handling
   */
  private initializeAPI() {
    try {
      const apiKey = process.env.GEMINI_API_KEY

      if (!apiKey) {
        console.error("GEMINI_API_KEY environment variable is not set")
        return
      }

      if (apiKey === "your_gemini_api_key_here") {
        console.error("Please replace the placeholder API key with your actual Gemini API key")
        return
      }

      // Validate API key format (basic check)
      if (!apiKey.startsWith("AIza") || apiKey.length < 30) {
        console.error(
          "Invalid API key format. Gemini API keys should start with 'AIza' and be longer than 30 characters",
        )
        return
      }

      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      })

      console.log("Gemini API initialized successfully for voice chat")
    } catch (error) {
      console.error("Failed to initialize Gemini API:", error)
    }
  }

  /**
   * Send a message to Gemini API and get response optimized for voice
   */
  async sendMessage(userMessage: string): Promise<ApiResponse> {
    try {
      // Check if API is properly initialized
      if (!this.genAI || !this.model) {
        return {
          success: false,
          error: "API is not properly configured. Please check your API key in the environment variables.",
        }
      }

      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        return {
          success: false,
          error: "Please say something.",
        }
      }

      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      })

      // Prepare the prompt with context for voice interaction
      const fullPrompt = this.buildVoicePromptWithContext(userMessage)

      console.log("Sending voice request to Gemini API...")

      // Generate response from Gemini
      const result = await this.model.generateContent(fullPrompt)

      if (!result || !result.response) {
        throw new Error("No response received from Gemini API")
      }

      const response = await result.response
      const aiMessage = response.text()

      if (!aiMessage) {
        throw new Error("Empty response received from Gemini API")
      }

      // Add AI response to history
      this.conversationHistory.push({
        role: "assistant",
        content: aiMessage,
        timestamp: new Date(),
      })

      console.log("Successfully received voice response from Gemini API")

      return {
        success: true,
        message: aiMessage,
      }
    } catch (error) {
      console.error("Gemini API Error:", error)

      // Handle different types of errors with voice-appropriate messages
      let errorMessage = "Sorry, I'm having trouble hearing you right now. Please try speaking again."

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        if (errorStr.includes("api key not valid") || errorStr.includes("api_key_invalid")) {
          errorMessage = "There's a configuration issue. Please check the setup."
        } else if (errorStr.includes("quota") || errorStr.includes("limit")) {
          errorMessage = "I'm at capacity right now. Please try again in a few minutes."
        } else if (errorStr.includes("network") || errorStr.includes("fetch")) {
          errorMessage = "I'm having connection issues. Please check your internet and try again."
        } else if (errorStr.includes("safety")) {
          errorMessage = "Let's try a different topic. What would you like to practice in English?"
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Build prompt with conversation context optimized for voice interaction
   */
  private buildVoicePromptWithContext(userMessage: string): string {
    let prompt = VOICE_ENGLISH_TUTOR_PROMPT + "\n\n"

    // Include recent conversation history (last 4 messages for voice context)
    const recentHistory = this.conversationHistory.slice(-4)

    if (recentHistory.length > 0) {
      prompt += "Recent voice conversation:\n"
      recentHistory.forEach((msg) => {
        prompt += `${msg.role === "user" ? "Student said" : "Tutor said"}: "${msg.content}"\n`
      })
      prompt += "\n"
    }

    prompt += `Student just said: "${userMessage}"\n\n`
    prompt += "Respond as a supportive English tutor in a way that sounds natural when spoken:"

    return prompt
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = []
  }

  /**
   * Check if API is properly configured
   */
  isConfigured(): boolean {
    return this.genAI !== null && this.model !== null
  }

  /**
   * Get conversation statistics
   */
  getStats() {
    const totalMessages = this.conversationHistory.length
    const userMessages = this.conversationHistory.filter((msg) => msg.role === "user").length
    const aiMessages = this.conversationHistory.filter((msg) => msg.role === "assistant").length

    return {
      totalMessages,
      userMessages,
      aiMessages,
      conversationStarted: this.conversationHistory.length > 0 ? this.conversationHistory[0].timestamp : null,
      isConfigured: this.isConfigured(),
    }
  }
}

// Export singleton instance
export const geminiApi = GeminiApiService.getInstance()
