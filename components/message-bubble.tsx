import { Bot, User } from "lucide-react"

interface MessageBubbleProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-purple-500"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div
        className={`max-w-[75%] sm:max-w-[80%] p-3 rounded-2xl ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white/10 text-white border border-white/20 rounded-bl-md"
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  )
}
