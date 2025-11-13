import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Home, Send, MessageCircle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'

interface ChatScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
  context?: {
    answers?: Record<string, any>
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export const ChatScreen = ({ setCurrentStep, context }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('afterlife-chat-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load chat history', e)
      }
    }

    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hello, I'm here to help guide you through this difficult time. I can answer questions about the bereavement process, explain legal terms, and help you understand what to expect at each step.\n\n📚 For comprehensive information, visit:\n• GOV.UK: https://www.gov.uk/after-a-death\n• Cruse Bereavement Care: https://www.cruse.org.uk\n• Citizens Advice: https://www.citizensadvice.org.uk/family/death-and-wills\n\nWhat would you like to know?",
        timestamp: new Date()
      }])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('afterlife-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    const postcodeRegex = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/i
    const postcodeMatch = userMessage.match(postcodeRegex)
    const postcode = postcodeMatch ? postcodeMatch[1] : context?.answers?.postcode
    
    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            answers: {
              ...context?.answers,
              postcode: postcode || context?.answers?.postcode
            }
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error calling API:', error)
      return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact our support team if the issue persists."
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      const responseText = await generateResponse(currentInput)
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const quickTopics = [
    'How do I register a death?',
    'What is probate?',
    'How much does a funeral cost?',
    'What is Tell Us Once?',
    'How do I find a Will?',
    'What is Inheritance Tax?'
  ]

  return (
    <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
      <ParallaxBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep('welcome')} 
            className={cn('mb-6', theme.button.ghost, theme.transition.default)}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'border-2 h-[calc(100vh-200px)] flex flex-col')}>
              <CardHeader className={cn('border-b', theme.border.default)}>
                <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                  <MessageCircle className="w-6 h-6" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-4',
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
                  </div>
                ))}
                
                {isTyping && (
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
                      {quickTopics.map((topic, index) => (
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
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


