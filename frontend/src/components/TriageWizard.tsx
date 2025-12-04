import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, ChevronLeft, Clock, HelpCircle } from 'lucide-react'
import { QUESTIONS, getFirstQuestion, getNextQuestion, type QuestionId } from '../questionConfig.ts'
import { theme, cn } from '../theme.ts'

interface TriageWizardProps {
  onComplete: (answers: Record<string, any>) => void
  onBack: () => void
}

export const TriageWizard = ({ onComplete, onBack }: TriageWizardProps) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<QuestionId>(getFirstQuestion())
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [history, setHistory] = useState<QuestionId[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showAIPrompts, setShowAIPrompts] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('afterlife-triage-progress')
    if (saved) {
      try {
        const { answers: savedAnswers, currentQuestion } = JSON.parse(saved)
        setAnswers(savedAnswers)
        setCurrentQuestionId(currentQuestion)
      } catch (e) {
        console.error('Failed to load saved progress', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('afterlife-triage-progress', JSON.stringify({
      answers,
      currentQuestion: currentQuestionId
    }))
  }, [answers, currentQuestionId])

  useEffect(() => {
    if (currentQuestionId === 'postcode' && answers.postcode) {
      const postcode = answers.postcode.toUpperCase()
      let jurisdiction = ''
      
      if (postcode.match(/^(BT|bt)/)) {
        jurisdiction = 'northern-ireland'
      } else if (postcode.match(/^(AB|DD|DG|EH|FK|G|HS|IV|KA|KW|KY|ML|PA|PH|TD|ZE|ab|dd|dg|eh|fk|g|hs|iv|ka|kw|ky|ml|pa|ph|td|ze)/)) {
        jurisdiction = 'scotland'
      } else {
        jurisdiction = 'england-wales'
      }
      
      if (answers.jurisdiction !== jurisdiction) {
        setAnswers(prev => ({ ...prev, jurisdiction }))
      }
    }
  }, [answers.postcode, currentQuestionId, answers.jurisdiction])

  const currentQuestion = QUESTIONS[currentQuestionId]

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [currentQuestionId]: value }
    setAnswers(newAnswers)
    
    const nextId = getNextQuestion(currentQuestionId, value, newAnswers)
    
    if (nextId === 'complete' || !nextId) {
      onComplete(newAnswers)
      localStorage.removeItem('afterlife-triage-progress')
    } else {
      setHistory([...history, currentQuestionId])
      setCurrentQuestionId(nextId)
      setInputValue('')
      setShowAIPrompts(false)
    }
  }

  const handleBack = () => {
    if (history.length > 0) {
      const previousId = history[history.length - 1]
      setHistory(history.slice(0, -1))
      setCurrentQuestionId(previousId)
      setInputValue(answers[previousId] || '')
      setShowAIPrompts(false)
    } else {
      onBack()
    }
  }

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      handleAnswer(inputValue.trim())
    }
  }

  if (!currentQuestion) {
    return null
  }

  if (currentQuestion.visibleIf && !currentQuestion.visibleIf(answers)) {
    const nextId = getNextQuestion(currentQuestionId, null, answers)
    if (nextId) {
      setCurrentQuestionId(nextId)
    }
    return null
  }

  const isUrgentQuestion = currentQuestionId === 'urgent_burial' || 
    (currentQuestionId === 'police_coroner' && answers.police_coroner === 'no')

  return (
    <div className={cn(theme.gradient.page, 'min-h-screen')}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className={cn(theme.button.ghost, theme.transition.default)}
            >
              {history.length > 0 ? (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </>
              ) : (
                <>
                  <Home className="w-4 h-4 mr-2" /> Home
                </>
              )}
            </Button>
            
            <div className={cn(theme.text.muted, 'text-sm')}>
              Question {history.length + 1}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={cn('h-full', theme.gradient.header, theme.transition.default)}
                style={{ width: `${((history.length + 1) / 12) * 100}%` }}
              />
            </div>
          </div>

          {/* Main question card */}
          <Card className={cn(
            theme.card.default,
            theme.transition.default,
            'border-2',
            isUrgentQuestion ? theme.card.urgent : ''
          )}>
            <CardHeader>
              <CardTitle className={cn(theme.text.primary, 'text-3xl')}>
                {currentQuestion.prompt}
              </CardTitle>
              {currentQuestion.description && (
                <CardDescription className={cn(theme.text.secondary, 'text-base mt-2')}>
                  {currentQuestion.description}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Urgent alert for time-sensitive questions */}
              {isUrgentQuestion && (
                <Alert className={cn(theme.card.urgent, 'border-2')}>
                  <Clock className="h-5 w-5 text-amber-600" />
                  <AlertDescription className={theme.text.secondary}>
                    <strong>Time-sensitive:</strong> This requires immediate attention
                  </AlertDescription>
                </Alert>
              )}

              {/* Text input */}
              {currentQuestion.type === 'text' && (
                <div className="space-y-3">
                  <Input
                    placeholder={currentQuestion.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    className={cn('text-lg p-6', theme.border.default, 'focus:' + theme.border.focus)}
                    autoFocus
                  />
                  
                  {/* Show detected jurisdiction for postcode */}
                  {currentQuestionId === 'postcode' && answers.jurisdiction && (
                    <p className={cn(theme.text.muted, 'text-sm')}>
                      Detected: {answers.jurisdiction === 'england-wales' ? 'England/Wales' : 
                                answers.jurisdiction === 'scotland' ? 'Scotland' : 'Northern Ireland'}
                    </p>
                  )}
                  
                  <Button 
                    size="lg" 
                    onClick={handleTextSubmit}
                    disabled={!inputValue.trim()}
                    className={cn(theme.button.primary, 'w-full text-lg py-6', theme.transition.default)}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Single choice options */}
              {currentQuestion.type === 'single' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={answers[currentQuestionId] === option.value ? 'default' : 'outline'}
                      className={cn(
                        'w-full justify-start text-left text-lg py-6 px-6',
                        answers[currentQuestionId] === option.value 
                          ? theme.button.selected 
                          : theme.button.outline,
                        theme.transition.default,
                        'hover:scale-[1.02]'
                      )}
                      onClick={() => handleAnswer(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* AI quick prompts */}
              {currentQuestion.aiPrompts && currentQuestion.aiPrompts.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowAIPrompts(!showAIPrompts)}
                    className={cn(
                      'flex items-center gap-2',
                      theme.text.muted,
                      'hover:' + theme.accent.primary,
                      theme.transition.default,
                      'text-sm'
                    )}
                  >
                    <HelpCircle className="w-4 h-4" />
                    {showAIPrompts ? 'Hide' : 'Show'} helpful questions
                  </button>
                  
                  {showAIPrompts && (
                    <div className="mt-3 space-y-2">
                      {currentQuestion.aiPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          className={cn(
                            'block w-full text-left px-4 py-2 rounded-lg',
                            'bg-violet-50 hover:bg-violet-100',
                            'border border-violet-200',
                            theme.text.secondary,
                            theme.transition.default,
                            'text-sm'
                          )}
                          onClick={() => {
                            console.log('AI prompt:', prompt)
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help text */}
          <div className={cn('mt-6 text-center', theme.text.muted, 'text-sm')}>
            <p>Your answers are saved automatically. You can return anytime to continue.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


