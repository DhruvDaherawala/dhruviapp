"use client"

import { Bot, User, Volume2, Play, Square, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { speechService } from "@/lib/speech-service"

interface VoiceMessageBubbleProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    isPlaying?: boolean
    error?: boolean
  }
}

export function VoiceMessageBubble({ message }: VoiceMessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"
  const isError = message.error

  const handleReplay = () => {
    if (message.isPlaying) {
      speechService.stopSpeaking()
    } else {
      speechService.speak(message.content, { rate: 0.9 })
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : isError ? "bg-red-500" : "bg-purple-500"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div
        className={`max-w-[75%] sm:max-w-[80%] p-3 rounded-2xl group relative ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : isError
              ? "bg-red-500/10 text-red-200 border border-red-500/20 rounded-bl-md"
              : "bg-white/10 text-white border border-white/20 rounded-bl-md"
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words pr-8">{message.content}</p>

        {/* Controls for AI messages */}
        {!isUser && !isError && (
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={handleReplay} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
              {message.isPlaying ? (
                <Square className="w-3 h-3 text-gray-400" />
              ) : (
                <Play className="w-3 h-3 text-gray-400" />
              )}
            </Button>
            <Button onClick={copyToClipboard} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
              {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
            </Button>
          </div>
        )}

        {/* Speaking indicator for AI messages */}
        {message.isPlaying && (
          <div className="absolute top-1 right-1">
            <Volume2 className="w-3 h-3 text-green-400 animate-pulse" />
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-1 opacity-70 ${isUser ? "text-blue-100" : "text-gray-400"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
