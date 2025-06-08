"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorMessage({ message, onRetry, showRetry = true }: ErrorMessageProps) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
        <AlertCircle className="w-4 h-4 text-white" />
      </div>

      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl rounded-bl-md flex-1">
        <p className="text-sm text-red-200 mb-2">{message}</p>
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30 h-8"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
