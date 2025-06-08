import { GoogleGenerativeAI } from "@google/generative-ai"

// System prompt for English learning
const ENGLISH_TUTOR_PROMPT = `You are SecretKeeper 4U, an AI English tutor designed to help users achieve proficiency in English. Your slogan is "Hukum mere aaka !!"

Your primary role is to:
1. Help users improve their English speaking, writing, reading, and listening skills
2. Correct grammar mistakes gently and explain the corrections
3. Suggest better vocabulary and sentence structures
4. Provide pronunciation tips when needed
5. Engage in conversations that gradually increase in complexity
6. Give encouragement and positive feedback
7. Adapt to the user's current English level (beginner, intermediate, advanced)

Guidelines:
- Always be patient, encouraging, and supportive
- Correct mistakes in a friendly, non-judgmental way
- Provide explanations for corrections
- Suggest alternative ways to express ideas
- Use examples to illustrate grammar rules
- Encourage practice through conversation
- Ask follow-up questions to keep the conversation flowing
- Celebrate improvements and progress
- If users write in other languages, gently encourage them to try in English while still being helpful

Remember: You're here to make English learning enjoyable and effective while keeping their learning journey confidential and safe.`

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
        model: "gemini-1.5-flash", // Using gemini-1.5-flash instead of 2.0-flash for better compatibility
      })

      console.log("Gemini API initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Gemini API:", error)
    }
  }

  /**
   * Send a message to Gemini API and get response
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
          error: "Please enter a message.",
        }
      }

      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      })

      // Prepare the prompt with context
      const fullPrompt = this.buildPromptWithContext(userMessage)

      console.log("Sending request to Gemini API...")

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

      console.log("Successfully received response from Gemini API")

      return {
        success: true,
        message: aiMessage,
      }
    } catch (error) {
      console.error("Gemini API Error:", error)

      // Handle different types of errors
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again."

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        if (errorStr.includes("api key not valid") || errorStr.includes("api_key_invalid")) {
          errorMessage = "Invalid API key. Please check your Gemini API key configuration."
        } else if (errorStr.includes("quota") || errorStr.includes("limit")) {
          errorMessage = "API quota exceeded. Please try again later."
        } else if (errorStr.includes("network") || errorStr.includes("fetch")) {
          errorMessage = "Network connection issue. Please check your internet and try again."
        } else if (errorStr.includes("model not found")) {
          errorMessage = "The AI model is currently unavailable. Please try again later."
        } else if (errorStr.includes("safety")) {
          errorMessage = "Your message was flagged by safety filters. Please try rephrasing your question."
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Build prompt with conversation context
   */
  private buildPromptWithContext(userMessage: string): string {
    let prompt = ENGLISH_TUTOR_PROMPT + "\n\n"

    // Include recent conversation history (last 6 messages for context)
    const recentHistory = this.conversationHistory.slice(-6)

    if (recentHistory.length > 0) {
      prompt += "Recent conversation:\n"
      recentHistory.forEach((msg) => {
        prompt += `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}\n`
      })
      prompt += "\n"
    }

    prompt += `Current student message: ${userMessage}\n\n`
    prompt += "Please respond as an encouraging English tutor:"

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
