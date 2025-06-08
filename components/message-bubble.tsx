"use client"

import { Bot, User, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MessageBubbleProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    error?: boolean
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"
  const isError = message.error

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
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

        {/* Copy button for AI messages */}
        {!isUser && !isError && (
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/10"
          >
            {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
          </Button>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-1 opacity-70 ${isUser ? "text-blue-100" : "text-gray-400"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
