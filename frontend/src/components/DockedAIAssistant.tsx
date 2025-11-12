import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { theme, cn } from '../theme'

interface DockedAIAssistantProps {
  context?: {
    currentStep?: string
    answers?: Record<string, any>
    currentQuestion?: string
  }
}

export const DockedAIAssistant = ({ context }: DockedAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

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
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn('shadow-2xl border-2', isMinimized ? 'w-80' : 'w-96 h-[600px]')}>
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
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">AI Chat interface will be available once you add your OpenAI API key.</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
