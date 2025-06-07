import { Shield, Sparkles } from "lucide-react"

export function ChatHeader() {
  return (
    <div className="text-center py-4 px-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="relative">
          <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white">SecretKeeper 4U</h1>
      </div>
      <p className="text-lg md:text-xl text-purple-300 font-medium">Hukum mere aaka !!</p>
      <p className="text-sm text-gray-300 mt-1">Chat in any language</p>
    </div>
  )
}
