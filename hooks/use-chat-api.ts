"use client"

import { useState, useCallback } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
}

export interface UseChatApiReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  retryLastMessage: () => Promise<void>
}

export function useChatApi(): UseChatApiReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string>("")

  const generateId = () => Math.random().toString(36).substring(7)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    setError(null)
    setLastUserMessage(content)

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      // Add AI response
      const aiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(data.timestamp),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)

      // Add error message to chat
      const errorMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: `❌ ${errorMessage}`,
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage) {
      // Remove the last error message if it exists
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage?.error) {
          return prev.slice(0, -1)
        }
        return prev
      })

      await sendMessage(lastUserMessage)
    }
  }, [lastUserMessage, sendMessage])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setLastUserMessage("")
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  }
}
