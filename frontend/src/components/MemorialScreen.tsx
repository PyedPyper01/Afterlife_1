import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Heart } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

interface MemorialScreenProps {
  setCurrentStep: (step: any) => void
}

export const MemorialScreen = ({ setCurrentStep }: MemorialScreenProps) => {
  return (
    <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
      <ParallaxBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep('welcome')} 
            className={cn('mb-6', theme.button.ghost)}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <div className="text-center mb-10">
            <h1 className={cn('text-5xl font-bold mb-3', theme.gradient.header, 'bg-clip-text text-transparent')}>
              Memorial Pages
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Create beautiful, permanent tributes - free forever</p>
          </div>

          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'mb-8 border-2 text-center cursor-pointer', theme.card.hover)}>
              <CardContent className="py-12">
                <Heart className={cn('w-16 h-16 mx-auto mb-4', theme.accent.primary)} />
                <h3 className={cn('text-2xl font-semibold mb-2', theme.text.primary)}>Create a Memorial Page</h3>
                <p className={theme.text.muted}>Honor their memory with a beautiful tribute</p>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
