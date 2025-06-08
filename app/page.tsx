"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2, RotateCcw } from "lucide-react"
import { ChatHeader } from "@/components/chat-header"
import { MessageBubble } from "@/components/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"
import { WelcomeMessage } from "@/components/welcome-message"
import { ErrorMessage } from "@/components/error-message"
import { ApiStatus } from "@/components/api-status"
import { useChatApi } from "@/hooks/use-chat-api"

export default function SecretKeeperChat() {
  const { messages, isLoading, error, sendMessage, clearMessages, retryLastMessage } = useChatApi()
  const [input, setInput] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (showWelcome) setShowWelcome(false)

    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleClearChat = () => {
    clearMessages()
    setShowWelcome(true)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <ChatHeader />

      {/* API Status Warning */}
      <ApiStatus />

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {/* Welcome Message */}
          {showWelcome && messages.length === 0 && <WelcomeMessage />}

          {/* Messages */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error Message */}
          {error && <ErrorMessage message={error} onRetry={retryLastMessage} showRetry={true} />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            {/* Chat Controls */}
            {messages.length > 0 && (
              <div className="flex justify-end gap-2 mb-2">
                <Button
                  onClick={handleClearChat}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear
                </Button>
                {error && (
                  <Button
                    onClick={retryLastMessage}
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/20 border-purple-500/30 text-purple-200 hover:bg-purple-500/30 h-8"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything in English or ask for help improving your English..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-12 text-base"
                disabled={isLoading}
                maxLength={4000}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 h-12 min-w-[48px] disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>

            {/* Character count */}
            {input.length > 3500 && (
              <div className="text-xs text-gray-400 mt-1 text-right">{input.length}/4000 characters</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
