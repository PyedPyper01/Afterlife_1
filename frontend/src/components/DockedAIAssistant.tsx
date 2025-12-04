import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { theme, cn } from '../theme'
import { useChat } from '../hooks/useChat'

interface DockedAIAssistantProps {
  context?: {
    currentStep?: string
    answers?: Record<string, any>
    currentQuestion?: string
  }
  onNavigate?: (step: string) => void
}

const DOCKED_WELCOME_MESSAGE = `Hello, I'm here to help guide you through this difficult time. I can answer questions about the bereavement process, explain legal terms, and help you understand what to expect at each step. How can I assist you?`

export const DockedAIAssistant = ({ context, onNavigate }: DockedAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    sendMessage
  } = useChat({
    context: { answers: context?.answers, currentStep: context?.currentStep },
    initialMessage: DOCKED_WELCOME_MESSAGE
    // No persistKey - docked assistant doesn't persist across sessions
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    const message = inputValue
    setInputValue('')
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedAction = (action: string | null | undefined) => {
    if (action === 'marketplace' && onNavigate) {
      onNavigate('marketplace')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-16 h-16 rounded-full',
          theme.gradient.header,
          'text-white shadow-xl',
          'flex items-center justify-center',
          theme.transition.default,
          'hover:scale-110',
          'motion-safe:animate-pulse'
        )}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed z-50',
        'bottom-6 right-6',
        theme.transition.default
      )}
    >
      <Card
        className={cn(
          'shadow-2xl border-2',
          theme.border.default,
          isMinimized ? 'w-80' : 'w-96 h-[600px]',
          theme.transition.default
        )}
      >
        <CardHeader className={cn('flex flex-row items-center justify-between p-4', theme.gradient.header, 'text-white')}>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-73px)]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={cn(
                        'rounded-lg p-3',
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-900',
                        theme.transition.default
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {/* Suggested Action Button */}
                    {message.suggestedAction && message.role === 'assistant' && (
                      <button
                        onClick={() => handleSuggestedAction(message.suggestedAction)}
                        className={cn(
                          'mt-2 self-start text-xs px-3 py-1 rounded-full',
                          'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
                          theme.transition.default
                        )}
                      >
                        🛒 Browse Marketplace
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(theme.button.primary)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default DockedAIAssistant
