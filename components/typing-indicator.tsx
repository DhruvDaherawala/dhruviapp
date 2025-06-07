import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>

      <div className="bg-white/10 border border-white/20 p-3 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
