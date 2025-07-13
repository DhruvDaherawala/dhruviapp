"use client" // Mark this file as a client component

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

export class SpeechService {
  private static instance: SpeechService | null = null // Make instance nullable
  private recognition: any = null
  private synthesis: SpeechSynthesis
  private isListeningFlag = false // Internal flag for recognition state
  private isSpeakingFlag = false // Internal flag for synthesis state
  private voices: SpeechSynthesisVoice[] = []

  private constructor() {
    // Ensure window is defined before accessing browser APIs
    if (typeof window === "undefined") {
      throw new Error("SpeechService cannot be initialized on the server.")
    }
    this.synthesis = window.speechSynthesis
    this.initializeSpeechRecognition()
    this.loadVoices()
  }

  public static getInstance(): SpeechService {
    // Only create instance if window is defined (i.e., on the client)
    if (typeof window === "undefined") {
      throw new Error("SpeechService can only be accessed on the client side.")
    }
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService()
    }
    return SpeechService.instance
  }

  /**
   * Initialize Speech Recognition
   */
  private initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"
      this.recognition.maxAlternatives = 1
    }
  }

  /**
   * Load available voices
   */
  private loadVoices() {
    const loadVoicesHandler = () => {
      this.voices = this.synthesis.getVoices()
    }

    loadVoicesHandler()
    this.synthesis.addEventListener("voiceschanged", loadVoicesHandler)
  }

  /**
   * Check if speech recognition is supported
   */
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  /**
   * Check if speech synthesis is supported
   */
  isSpeechSynthesisSupported(): boolean {
    return "speechSynthesis" in window
  }

  /**
   * Get available voices for English
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter((voice) => voice.lang.startsWith("en"))
  }

  /**
   * Get the best English voice (prefer female, native)
   */
  getBestEnglishVoice(): SpeechSynthesisVoice | null {
    const englishVoices = this.getEnglishVoices()

    // Prefer female voices for tutoring
    const femaleVoices = englishVoices.filter(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("karen") ||
        voice.name.toLowerCase().includes("susan"),
    )

    // Prefer native/local voices
    const nativeVoices = englishVoices.filter((voice) => voice.localService)

    if (femaleVoices.length > 0) return femaleVoices[0]
    if (nativeVoices.length > 0) return nativeVoices[0]
    if (englishVoices.length > 0) return englishVoices[0]

    return null
  }

  /**
   * Start listening for speech
   */
  startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
  ): boolean {
    if (!this.recognition || this.isListeningFlag) {
      return false
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      const confidence = result[0].confidence

      onResult({
        transcript,
        confidence,
        isFinal: result.isFinal,
      })
    }

    this.recognition.onerror = (event: any) => {
      let errorMessage = "Speech recognition error occurred"

      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try speaking again."
          break
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions."
          break
        case "not-allowed":
          errorMessage = "Microphone permission denied. Please allow microphone access."
          break
        case "network":
          errorMessage = "Network error. Please check your connection."
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      onError(errorMessage)
      this.isListeningFlag = false // Update internal flag on error
    }

    this.recognition.onend = () => {
      this.isListeningFlag = false
      onEnd()
    }

    this.recognition.onstart = () => {
      this.isListeningFlag = true
    }

    try {
      this.recognition.start()
      return true
    } catch (error) {
      onError("Failed to start speech recognition")
      this.isListeningFlag = false // Update internal flag on error
      return false
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListeningFlag) {
      this.recognition.stop()
      this.isListeningFlag = false // Update internal flag
    }
  }

  /**
   * Speak text using speech synthesis
   */
  speak(
    text: string,
    options: SpeechSynthesisOptions = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
  ): boolean {
    if (!this.isSpeechSynthesisSupported()) {
      onError?.("Speech synthesis not supported")
      return false
    }

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice
    const voice = options.voice || this.getBestEnglishVoice()
    if (voice) {
      utterance.voice = voice
    }

    // Set speech parameters
    utterance.rate = options.rate || 0.9 // Slightly slower for learning
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    utterance.lang = options.lang || "en-US"

    // Event handlers
    utterance.onstart = () => {
      this.isSpeakingFlag = true
      onStart?.()
    }

    utterance.onend = () => {
      this.isSpeakingFlag = false
      onEnd?.()
    }

    utterance.onerror = (event) => {
      this.isSpeakingFlag = false
      onError?.(`Speech synthesis error: ${event.error}`)
    }

    try {
      this.synthesis.speak(utterance)
      return true
    } catch (error) {
      onError?.("Failed to start speech synthesis")
      this.isSpeakingFlag = false // Update internal flag on error
      return false
    }
  }

  /**
   * Stop current speech
   */
  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel()
    }
    this.isSpeakingFlag = false
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListeningFlag
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeakingFlag
  }

  /**
   * Get speech capabilities
   */
  getCapabilities() {
    return {
      speechRecognition: this.isSpeechRecognitionSupported(),
      speechSynthesis: this.isSpeechSynthesisSupported(),
      voicesAvailable: this.voices.length,
      englishVoices: this.getEnglishVoices().length,
    }
  }
}

// Export a function to get the instance, rather than the instance directly
// This ensures it's only called on the client.
export function getSpeechService(): SpeechService {
  return SpeechService.getInstance()
}
