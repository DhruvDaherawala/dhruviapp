"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Settings } from "lucide-react"

interface ApiStatus {
  configured: boolean
  error?: string
}

export function ApiStatus() {
  const [status, setStatus] = useState<ApiStatus>({ configured: false })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check API status on component mount
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "test" }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ configured: true })
      } else {
        setStatus({
          configured: false,
          error: data.error || "API configuration error",
        })
        setIsVisible(true)
      }
    } catch (error) {
      setStatus({
        configured: false,
        error: "Failed to connect to API",
      })
      setIsVisible(true)
    }
  }

  if (!isVisible || status.configured) {
    return null
  }

  return (
    <div className="mx-4 mb-4">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-200 font-medium mb-1">API Configuration Issue</h3>
            <p className="text-red-300 text-sm mb-2">{status.error}</p>
            <div className="text-xs text-red-400">
              <p>Please check:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Your GEMINI_API_KEY is set in .env.local</li>
                <li>The API key is valid and starts with "AIza"</li>
                <li>Generative AI API is enabled in Google Cloud Console</li>
                <li>Billing is properly set up if required</li>
              </ul>
            </div>
          </div>
          <Settings className="w-4 h-4 text-red-400" />
        </div>
      </div>
    </div>
  )
}
