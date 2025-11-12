import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Home, ChevronLeft } from 'lucide-react'
import { theme, cn } from '../theme'

interface TriageWizardProps {
  onComplete: (answers: Record<string, any>) => void
  onBack: () => void
}

export const TriageWizard = ({ onComplete, onBack }: TriageWizardProps) => {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const questions = [
    {
      id: 'location',
      prompt: 'Where did the death occur?',
      options: [
        { value: 'home-expected', label: 'At home (expected)' },
        { value: 'home-unexpected', label: 'At home (unexpected)' },
        { value: 'hospital', label: 'In hospital' },
        { value: 'care-home', label: 'In a care home' },
      ]
    },
    {
      id: 'postcode',
      prompt: 'What is your postcode?',
      type: 'text',
      placeholder: 'e.g., SW1A 1AA'
    },
    {
      id: 'religion',
      prompt: 'Religious or cultural background',
      options: [
        { value: 'none', label: 'None/Humanist' },
        { value: 'christian', label: 'Christian' },
        { value: 'islam', label: 'Islam' },
        { value: 'judaism', label: 'Judaism' },
      ]
    }
  ]

  const currentQuestion = questions[step]

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(newAnswers)
    }
  }

  return (
    <div className={cn(theme.gradient.page, 'min-h-screen')}>      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={step > 0 ? () => setStep(step - 1) : onBack}
            className={cn(theme.button.ghost)}
          >
            {step > 0 ? <ChevronLeft className="w-4 h-4 mr-2" /> : <Home className="w-4 h-4 mr-2" />}
            {step > 0 ? 'Back' : 'Home'}
          </Button>

          <div className="mt-8">
            <div className="h-2 bg-slate-200 rounded-full mb-8">
              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl">{currentQuestion.prompt}</CardTitle>
                {currentQuestion.type !== 'text' && (
                  <CardDescription>Question {step + 1} of {questions.length}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.type === 'text' ? (
                  <div className="space-y-3">
                    <Input
                      placeholder={currentQuestion.placeholder}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          handleAnswer((e.target as HTMLInputElement).value)
                        }
                      }}
                    />
                  </div>
                ) : (
                  currentQuestion.options?.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      className="w-full justify-start text-left py-6"
                      onClick={() => handleAnswer(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
