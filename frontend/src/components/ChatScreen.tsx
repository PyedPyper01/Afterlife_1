import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Home, Send, MessageCircle, ShoppingCart, Trash2 } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'
import { useChat } from '../hooks/useChat'

type Step = 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist' | 'about' | 'contact'

interface ChatScreenProps {
  setCurrentStep: (step: Step) => void
  context?: {
    answers?: Record<string, any>
  }
}

const QUICK_TOPICS = [
  'How do I register a death?',
  'What is probate?',
  'How much does a funeral cost?',
  'What is Tell Us Once?',
  'How do I find a Will?',
  'What is Inheritance Tax?'
]

export const ChatScreen = ({ setCurrentStep, context }: ChatScreenProps) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useChat({
    context: { answers: context?.answers },
    persistKey: 'afterlife-chat-history'
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
    if (action === 'marketplace') {
      setCurrentStep('marketplace')
    }
  }

  return (
    <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
      <ParallaxBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('welcome')} 
              className={cn(theme.button.ghost, theme.transition.default)}
            >
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            
            <Button
              variant="ghost"
              onClick={clearMessages}
              className={cn(theme.button.ghost, theme.transition.default, 'text-red-500 hover:text-red-600')}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear History
            </Button>
          </div>
          
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'border-2 h-[calc(100vh-200px)] flex flex-col')}>
              <CardHeader className={cn('border-b', theme.border.default)}>
                <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                  <MessageCircle className="w-6 h-6" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
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
                          'rounded-lg p-4',
                          message.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={cn(
                            'text-xs mt-2',
                            message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {/* Suggested Action Button */}
                      {message.suggestedAction && message.role === 'assistant' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn('mt-2 self-start', theme.button.outline, theme.transition.default)}
                          onClick={() => handleSuggestedAction(message.suggestedAction)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Browse Marketplace
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className={cn('border-t p-4', theme.border.default)}>
                {messages.length === 1 && (
                  <div className="mb-4">
                    <p className={cn('text-sm font-semibold mb-2', theme.text.primary)}>Quick topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TOPICS.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInputValue(topic)}
                          className={cn(theme.button.outline, theme.transition.default, 'text-xs')}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className={cn(theme.button.primary, theme.transition.default)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen
