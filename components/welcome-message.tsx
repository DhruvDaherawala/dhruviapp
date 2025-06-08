import { Bot, BookOpen, MessageCircle, Target } from "lucide-react"

export function WelcomeMessage() {
  return (
    <div className="text-center py-8 px-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-lg mx-auto">
        <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Welcome to SecretKeeper 4U!</h3>
        <p className="text-gray-300 mb-4 text-sm">
          Your personal English tutor! I'm here to help you achieve proficiency in English through conversation and
          practice.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-purple-500/20 rounded-lg p-3">
            <BookOpen className="w-6 h-6 text-purple-300 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Grammar & Vocabulary</p>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-3">
            <MessageCircle className="w-6 h-6 text-blue-300 mx-auto mb-1" />
            <p className="text-xs text-blue-200">Conversation Practice</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-3">
            <Target className="w-6 h-6 text-green-300 mx-auto mb-1" />
            <p className="text-xs text-green-200">Pronunciation Tips</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          💡 Try starting with: "Help me improve my English" or "Can you check my grammar?"
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">Beginner</span>
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">Intermediate</span>
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">Advanced</span>
        </div>
      </div>
    </div>
  )
}
