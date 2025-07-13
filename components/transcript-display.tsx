"use client"

import { Mic } from "lucide-react"

interface TranscriptDisplayProps {
  transcript: string
  isListening: boolean
  isProcessing: boolean
}

export function TranscriptDisplay({ transcript, isListening, isProcessing }: TranscriptDisplayProps) {
  // Only show transcript display if actively listening or if there's a transcript from a recent final result
  if (!isListening && !transcript && !isProcessing) return null

  return (
    <div className="mx-4 mb-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Mic className="w-4 h-4 text-red-400" />
          <span className="text-xs text-gray-300">You're saying:</span>
        </div>
        <p className="text-white text-sm font-medium">
          {isListening ? transcript || "Listening..." : isProcessing ? "Processing your voice..." : transcript}
        </p>
      </div>
    </div>
  )
}
