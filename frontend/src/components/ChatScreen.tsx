import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Home, MessageCircle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

interface ChatScreenProps {
  setCurrentStep: (step: any) => void
  context?: any
}

export const ChatScreen = ({ setCurrentStep, context }: ChatScreenProps) => {
  return (
    <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
      <ParallaxBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep('welcome')} 
            className={cn('mb-6', theme.button.ghost)}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <FloatingCard delay={0}>
            <Card className="border-2 h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <p>Hello, I'm here to help guide you through this difficult time. Please add your OpenAI API key to enable the chat.</p>
                </div>
              </CardContent>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input placeholder="Ask me anything..." disabled />
                  <Button disabled>Send</Button>
                </div>
              </div>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
