"use client"

import { Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceControlsProps {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  onStartListening: () => void
  onStopListening: () => void
  onStopSpeaking: () => void
  capabilities: {
    speechRecognition: boolean
    speechSynthesis: boolean
  }
}

export function VoiceControls({
  isListening,
  isSpeaking,
  isProcessing,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  capabilities,
}: VoiceControlsProps) {
  const isBusy = isProcessing || isSpeaking
  const showStopSpeaking = isSpeaking && !isProcessing

  if (!capabilities.speechRecognition && !capabilities.speechSynthesis) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-200 text-sm">
            Voice features are not supported in your browser. Please use Chrome, Edge, or Safari for the best
            experience.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {/* Main Voice Button */}
      <div className="relative">
        <Button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={isBusy} // Disable if AI is processing or speaking
          className={`w-16 h-16 rounded-full transition-all duration-300 ${
            isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-purple-600 hover:bg-purple-700"
          } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isBusy ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </Button>

        {/* Listening indicator */}
        {isListening && !isBusy && (
          <div className="absolute -inset-2 rounded-full border-2 border-red-400 animate-ping" />
        )}
      </div>

      {/* Stop Speaking Button */}
      {showStopSpeaking && (
        <Button
          onClick={onStopSpeaking}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <VolumeX className="w-5 h-5 mr-2" />
          Stop Speaking
        </Button>
      )}

      {/* Status Indicators */}
      <div className="flex flex-col items-center gap-1 min-h-[40px] justify-center">
        {isProcessing && (
          <div className="flex items-center gap-2 text-purple-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <span className="text-xs">AI is thinking...</span>
          </div>
        )}

        {isSpeaking && !isProcessing && (
          <div className="flex items-center gap-2 text-green-300">
            <Volume2 className="w-4 h-4" />
            <span className="text-xs">AI is speaking...</span>
          </div>
        )}

        {isListening && !isBusy && (
          <div className="flex items-center gap-2 text-red-300">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-xs">Listening for your voice...</span>
          </div>
        )}

        {!isListening && !isSpeaking && !isProcessing && (
          <span className="text-xs text-gray-400">Click mic to speak</span>
        )}
      </div>
    </div>
  )
}
