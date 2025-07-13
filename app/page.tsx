"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ChatHeader } from "@/components/chat-header"
import { VoiceMessageBubble } from "@/components/voice-message-bubble"
import { VoiceControls } from "@/components/voice-controls"
import { VoiceWelcome } from "@/components/voice-welcome"
import { TranscriptDisplay } from "@/components/transcript-display"
import { ApiStatus } from "@/components/api-status"
import { useVoiceChat } from "@/hooks/use-voice-chat"

export default function SecretKeeperVoiceChat() {
  const {
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
  } = useVoiceChat()

  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartVoiceChat = () => {
    setShowWelcome(false)
    startVoiceChat()
  }

  const handleClearChat = () => {
    clearMessages()
    stopVoiceChat()
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
          {showWelcome && messages.length === 0 && (
            <VoiceWelcome onStartVoiceChat={handleStartVoiceChat} capabilities={capabilities} />
          )}

          {/* Messages */}
          {messages.map((message) => (
            <VoiceMessageBubble key={message.id} message={message} />
          ))}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mx-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Transcript Display */}
        <TranscriptDisplay transcript={currentTranscript} isListening={isListening} />

        {/* Voice Controls */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            onStartListening={startVoiceChat}
            onStopListening={stopVoiceChat}
            onStopSpeaking={stopSpeaking}
            capabilities={capabilities}
          />

          {/* Chat Controls */}
          {messages.length > 0 && (
            <div className="flex justify-center gap-2 pb-4">
              <Button
                onClick={handleClearChat}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
