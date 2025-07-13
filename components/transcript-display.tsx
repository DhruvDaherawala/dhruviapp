"use client"

interface TranscriptDisplayProps {
  transcript: string
  isListening: boolean
}

export function TranscriptDisplay({ transcript, isListening }: TranscriptDisplayProps) {
  if (!isListening && !transcript) return null

  return (
    <div className="mx-4 mb-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-300">You're saying:</span>
        </div>
        <p className="text-white text-sm">{transcript || (isListening ? "Listening..." : "")}</p>
      </div>
    </div>
  )
}
