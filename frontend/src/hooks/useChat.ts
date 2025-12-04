import { useState, useCallback, useRef, useEffect } from 'react'
import { sendChatMessage, ChatContext, ChatResponse } from '../services/api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedAction?: string | null
}

interface UseChatOptions {
  context?: ChatContext
  persistKey?: string // localStorage key for persistence
  initialMessage?: string
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  clearError: () => void
}

const DEFAULT_WELCOME_MESSAGE = `Hello, I'm here to help guide you through this difficult time. I can answer questions about the bereavement process, explain legal terms, and help you understand what to expect at each step.

📚 For comprehensive information, visit:
• GOV.UK: https://www.gov.uk/after-a-death
• Cruse Bereavement Care: https://www.cruse.org.uk
• Citizens Advice: https://www.citizensadvice.org.uk/family/death-and-wills

What would you like to know?`

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { context, persistKey, initialMessage = DEFAULT_WELCOME_MESSAGE } = options
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contextRef = useRef(context)
  
  // Update context ref when it changes
  useEffect(() => {
    contextRef.current = context
  }, [context])
  
  // Load persisted messages on mount
  useEffect(() => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })))
          return
        } catch (e) {
          console.error('Failed to load chat history', e)
        }
      }
    }
    
    // Set initial welcome message if no persisted messages
    if (initialMessage) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date()
      }])
    }
  }, [persistKey, initialMessage])
  
  // Persist messages when they change
  useEffect(() => {
    if (persistKey && messages.length > 0) {
      localStorage.setItem(persistKey, JSON.stringify(messages))
    }
  }, [messages, persistKey])
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)
    
    try {
      // Extract postcode from message if present
      const postcodeRegex = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/i
      const postcodeMatch = content.match(postcodeRegex)
      
      const enrichedContext: ChatContext = {
        ...contextRef.current,
        answers: {
          ...contextRef.current?.answers,
          ...(postcodeMatch ? { postcode: postcodeMatch[1] } : {})
        }
      }
      
      const response: ChatResponse = await sendChatMessage(content, enrichedContext)
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestedAction: response.suggested_action
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact our support team if the issue persists.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  const clearMessages = useCallback(() => {
    if (persistKey) {
      localStorage.removeItem(persistKey)
    }
    setMessages(initialMessage ? [{
      id: 'welcome',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }] : [])
  }, [persistKey, initialMessage])
  
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError
  }
}

export default useChat
