import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, CheckCircle2, Circle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from '@/components/FloatingCard'
import { theme, cn } from '@/theme'

interface ChecklistScreenProps {
  setCurrentStep: (step: any) => void
}

export const ChecklistScreen = ({ setCurrentStep }: ChecklistScreenProps) => {
  const tasks = [
    { title: 'Obtain Medical Certificate', completed: false },
    { title: 'Register the death', completed: false },
    { title: 'Arrange funeral', completed: false },
  ]

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
              Checklist
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Track your progress</p>
          </div>

          <FloatingCard delay={100}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border-2 rounded-lg">
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400" />
                    )}
                    <span className={task.completed ? 'line-through text-slate-500' : ''}>{task.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
