import { Bot } from "lucide-react"

export function WelcomeMessage() {
  return (
    <div className="text-center py-8 px-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-md mx-auto">
        <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Welcome to SecretKeeper 4U!</h3>
        <p className="text-gray-300 mb-4 text-sm">
          I'm here to chat with you in any language. Your secrets are safe with me!
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">English</span>
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">हिंदी</span>
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">Español</span>
          <span className="px-2 py-1 bg-purple-500/30 rounded-full text-purple-200">العربية</span>
        </div>
      </div>
    </div>
  )
}
