"use client"

import { Bot, Mic, Volume2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceWelcomeProps {
  onStartVoiceChat: () => void
  capabilities: {
    speechRecognition: boolean
    speechSynthesis: boolean
    voicesAvailable: number
    englishVoices: number
  }
}

export function VoiceWelcome({ onStartVoiceChat, capabilities }: VoiceWelcomeProps) {
  const isVoiceSupported = capabilities.speechRecognition && capabilities.speechSynthesis

  return (
    <div className="text-center py-8 px-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-lg mx-auto">
        <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Voice English Tutor</h3>
        <p className="text-gray-300 mb-6 text-sm">
          Practice English conversation naturally! Speak with me and I'll respond with voice to help improve your
          pronunciation and fluency.
        </p>

        {isVoiceSupported ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Mic className="w-6 h-6 text-purple-300 mx-auto mb-1" />
                <p className="text-xs text-purple-200">Speak Naturally</p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <Volume2 className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                <p className="text-xs text-blue-200">Voice Responses</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <MessageCircle className="w-6 h-6 text-green-300 mx-auto mb-1" />
                <p className="text-xs text-green-200">Real Conversation</p>
              </div>
            </div>

            <Button
              onClick={onStartVoiceChat}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Chat
            </Button>

            <div className="text-xs text-gray-400 mt-4">
              <p>💡 Click the microphone and start speaking in English</p>
              <p>🎯 I'll help correct your grammar and improve your pronunciation</p>
            </div>
          </>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-200 text-sm mb-2">Voice features are not fully supported in your browser.</p>
            <div className="text-xs text-red-300">
              <p>Requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Speech Recognition: {capabilities.speechRecognition ? "✅ Supported" : "❌ Not supported"}</li>
                <li>Speech Synthesis: {capabilities.speechSynthesis ? "✅ Supported" : "❌ Not supported"}</li>
                <li>English Voices: {capabilities.englishVoices} available</li>
              </ul>
              <p className="mt-2">Please use Chrome, Edge, or Safari for the best experience.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
