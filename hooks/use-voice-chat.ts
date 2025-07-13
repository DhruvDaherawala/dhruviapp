"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { speechService, type SpeechRecognitionResult } from "@/lib/speech-service"

export interface VoiceMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isPlaying?: boolean
  error?: boolean
}

export interface UseVoiceChatReturn {
  messages: VoiceMessage[]
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  error: string | null
  currentTranscript: string
  startVoiceChat: () => void
  stopVoiceChat: () => void
  stopSpeaking: () => void
  clearMessages: () => void
  capabilities: {
    speechRecognition: boolean
    speechSynthesis: boolean
    voicesAvailable: number
    englishVoices: number
  }
}

export function useVoiceChat(): UseVoiceChatReturn {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [capabilities, setCapabilities] = useState({
    speechRecognition: false,
    speechSynthesis: false,
    voicesAvailable: 0,
    englishVoices: 0,
  })

  const finalTranscriptRef = useRef("")
  const processingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Initialize capabilities
    setCapabilities(speechService.getCapabilities())
  }, [])

  const generateId = () => Math.random().toString(36).substring(7)

  const sendMessageToAPI = async (message: string): Promise<string> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to get response")
    }

    return data.message
  }

  const handleSpeechResult = useCallback((result: SpeechRecognitionResult) => {
    setCurrentTranscript(result.transcript)

    if (result.isFinal) {
      finalTranscriptRef.current = result.transcript.trim()

      // Clear any existing timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }

      // Set a timeout to process the final transcript
      processingTimeoutRef.current = setTimeout(() => {
        if (finalTranscriptRef.current) {
          processUserMessage(finalTranscriptRef.current)
          finalTranscriptRef.current = ""
          setCurrentTranscript("")
        }
      }, 700) // Wait a bit after final result to ensure user is done speaking
    }
  }, [])

  const processUserMessage = async (transcript: string) => {
    if (!transcript.trim()) {
      // If transcript is empty, just stop listening and don't process
      speechService.stopListening()
      setIsListening(false)
      return
    }

    setIsProcessing(true)
    setError(null)
    speechService.stopListening() // Stop listening while processing
    setIsListening(false) // Update state

    // Add user message
    const userMessage: VoiceMessage = {
      id: generateId(),
      role: "user",
      content: transcript,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      // Get AI response
      const aiResponse = await sendMessageToAPI(transcript)

      // Add AI message
      const aiMessage: VoiceMessage = {
        id: generateId(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Speak the AI response
      speakMessage(aiResponse, aiMessage.id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)

      const errorMsg: VoiceMessage = {
        id: generateId(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakMessage = (text: string, messageId: string) => {
    speechService.stopListening() // Ensure listening is stopped while AI speaks
    setIsListening(false) // Update state

    speechService.speak(
      text,
      { rate: 0.9, pitch: 1.0 },
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false)
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isPlaying: false } : msg)))
        // IMPORTANT: Do NOT restart listening here. User will manually click.
      },
      (error) => {
        setError(`Speech error: ${error}`)
        setIsSpeaking(false)
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isPlaying: false } : msg)))
        // IMPORTANT: Do NOT restart listening here. User will manually click.
      },
    )
  }

  const startListening = () => {
    if (!speechService.isSpeechRecognitionSupported()) {
      setError("Speech recognition is not supported in your browser")
      return
    }
    if (speechService.getIsListening()) return // Prevent multiple starts

    speechService.startListening(
      handleSpeechResult,
      (error) => {
        setError(error)
        setIsListening(false)
      },
      () => {
        // onEnd of recognition:
        // This means the user stopped speaking or recognition timed out.
        // Do NOT auto-restart listening. User will manually click.
        setIsListening(false)
      },
    )
    setIsListening(true)
    setError(null)
  }

  const startVoiceChat = useCallback(() => {
    if (isSpeaking || isProcessing) {
      // If AI is busy, stop its current action and then start listening
      if (isSpeaking) {
        speechService.stopSpeaking()
        setIsSpeaking(false)
      }
      // If processing, wait for it to finish or handle appropriately
      // For now, we'll just prevent starting if processing
      if (isProcessing) return
    }
    startListening()
  }, [isSpeaking, isProcessing])

  const stopVoiceChat = useCallback(() => {
    speechService.stopListening()
    speechService.stopSpeaking()
    setIsListening(false)
    setIsSpeaking(false)
    setIsProcessing(false)
    setCurrentTranscript("")
    finalTranscriptRef.current = ""
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking()
    setIsSpeaking(false)
    // Update all playing messages
    setMessages((prev) => prev.map((msg) => ({ ...msg, isPlaying: false })))
    // After stopping AI speech, the mic remains off. User must click to speak.
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setCurrentTranscript("")
    finalTranscriptRef.current = ""
  }, [])

  return {
    messages,
    isListening,
    isSpeaking,
    isProcessing,
    error,
    currentTranscript,
    startVoiceChat,
    stopVoiceChat,
    stopSpeaking,
    clearMessages,
    capabilities,
  }
}
