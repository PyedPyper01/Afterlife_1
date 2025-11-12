import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Home, Phone, Mail } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

interface ConciergeScreenProps {
  setCurrentStep: (step: any) => void
}

export const ConciergeScreen = ({ setCurrentStep }: ConciergeScreenProps) => {
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
          
          <div className="text-center mb-10">
            <h1 className={cn('text-5xl font-bold mb-3', theme.gradient.header, 'bg-clip-text text-transparent')}>
              Concierge Service
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Let us handle everything for you</p>
          </div>

          <FloatingCard delay={0}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Full-Service Support</CardTitle>
                <CardDescription>Professional, compassionate assistance through every step</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
                    <p className="font-semibold text-lg mb-2">£1,000 Fixed Fee</p>
                    <p className="text-sm text-slate-600">Immediate tasks (registration, notifications, funeral)</p>
                  </div>
                  <div className="bg-violet-50 p-6 rounded-lg border-2 border-violet-200">
                    <p className="font-semibold text-lg mb-2">1-3% of Estate</p>
                    <p className="text-sm text-slate-600">Full probate administration</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:08001234567" className="text-indigo-600 hover:underline">0800 123 4567</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:concierge@afterlife.co.uk" className="text-indigo-600 hover:underline">concierge@afterlife.co.uk</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
