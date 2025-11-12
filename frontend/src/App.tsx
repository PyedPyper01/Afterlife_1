import { useState, useEffect } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Alert, AlertDescription } from './components/ui/alert'
import { 
  Heart, Phone, FileText, MessageCircle, 
  Clock, AlertTriangle, Home, Mic, MicOff, 
  ShoppingCart
} from 'lucide-react'
import { TriageWizard } from './components/TriageWizard'
import { DockedAIAssistant } from './components/DockedAIAssistant'
import { FloatingCard, ParallaxBackground } from './components/FloatingCard'
import { MarketplaceScreen } from './components/MarketplaceScreen'
import { MemorialScreen } from './components/MemorialScreen'
import { DocumentVaultScreen } from './components/DocumentVaultScreen'
import { ChatScreen } from './components/ChatScreen'
import { ChecklistScreen } from './components/ChecklistScreen'
import { ConciergeScreen } from './components/ConciergeScreen'
import { theme, cn } from './theme'

type Step = 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist'
type DeathLocation = 'home-expected' | 'home-unexpected' | 'hospital' | 'care-home' | 'abroad' | 'crime-scene' | ''
type Jurisdiction = 'england-wales' | 'scotland' | 'northern-ireland' | ''
type Religion = 'islam' | 'judaism' | 'hindu' | 'sikh' | 'christian' | 'catholic' | 'none' | ''
type AgeCategory = 'adult' | 'child' | 'stillbirth' | ''

interface TriageData {
  deathLocation: DeathLocation
  jurisdiction: Jurisdiction
  hasWill: boolean | null
  hasFuneralPlan: boolean | null
  ageCategory: AgeCategory
  religion: Religion
  burialOrCremation: string
  postcode: string
  nationality: string
  needsRepatriation: boolean
}

interface WelcomeScreenProps {
  voiceEnabled: boolean
  isListening: boolean
  setIsListening: (value: boolean) => void
  setCurrentStep: (step: Step) => void
  setVoiceEnabled: (value: boolean) => void
}

const WelcomeScreen = ({ voiceEnabled, isListening, setIsListening, setCurrentStep, setVoiceEnabled }: WelcomeScreenProps) => (
  <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
    <ParallaxBackground />
    
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="max-w-6xl mx-auto">
        {voiceEnabled && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              size="lg"
              variant={isListening ? 'destructive' : 'default'}
              className="rounded-full shadow-lg"
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
        )}
        
        <div className="text-center mb-16 pt-12">
          <Heart className={cn('w-20 h-20 mx-auto mb-6', theme.accent.primary)} />
          <h1 className={cn('text-7xl font-bold mb-6', theme.gradient.header, 'bg-clip-text text-transparent')}>
            AfterLife
          </h1>
          <p className={cn('text-2xl mb-3 font-medium', theme.text.secondary)}>Compassionate guidance through bereavement</p>
          <p className={cn('text-xl max-w-2xl mx-auto', theme.text.muted)}>Complete platform with AI guidance, marketplace, and memorial pages</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} onClick={() => setCurrentStep('triage')}>
              <CardHeader className="pb-4">
                <div className={cn('w-14 h-14 rounded-full flex items-center justify-center mb-4', theme.icon.primary)}>
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">AI Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={theme.text.muted}>24/7 intelligent assistant with voice control</p>
              </CardContent>
            </Card>
          </FloatingCard>

          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} onClick={() => setCurrentStep('marketplace')}>
              <CardHeader className="pb-4">
                <div className={cn('w-14 h-14 rounded-full flex items-center justify-center mb-4', theme.icon.secondary)}>
                  <ShoppingCart className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={theme.text.muted}>Find verified funeral directors, florists, and more</p>
              </CardContent>
            </Card>
          </FloatingCard>

          <FloatingCard delay={200}>
            <Card className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} onClick={() => setCurrentStep('memorial')}>
              <CardHeader className="pb-4">
                <div className={cn('w-14 h-14 rounded-full flex items-center justify-center mb-4', theme.icon.tertiary)}>
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Memorial Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={theme.text.muted}>Create free, permanent tribute pages</p>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>

        <FloatingCard delay={300}>
          <Alert className={cn(theme.card.urgent, 'mb-10 border-2 shadow-md')}>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className={theme.text.secondary}>
              <strong>In Crisis?</strong> Contact Samaritans at <strong>116 123</strong> (24/7) or <a href="https://www.cruse.org.uk" className={cn(theme.accent.primary, 'underline hover:opacity-80')}>Cruse Bereavement Care</a>
            </AlertDescription>
          </Alert>
        </FloatingCard>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
          <Button 
            size="lg" 
            className={cn('text-lg px-10 py-7 shadow-lg hover:shadow-xl font-semibold', theme.button.primary, theme.transition.default, 'motion-safe:hover:scale-105')}
            onClick={() => setCurrentStep('triage')}
          >
            Start Guided Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className={cn('text-lg px-10 py-7 shadow-md hover:shadow-lg font-semibold', theme.button.outline, theme.transition.default, 'motion-safe:hover:scale-105')}
            onClick={() => setCurrentStep('chat')}
          >
            Chat with AI Assistant
          </Button>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            className={cn(theme.button.ghost, theme.transition.default)}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {voiceEnabled ? 'Disable' : 'Enable'} Voice Control
          </Button>
        </div>
      </div>
    </div>
  </div>
)

interface GuidanceScreenProps {
  triageData: TriageData
  setCurrentStep: (step: Step) => void
}

const GuidanceScreen = ({ triageData, setCurrentStep }: GuidanceScreenProps) => {
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
          
          <div className="text-center mb-10">
            <h1 className={cn('text-5xl font-bold mb-3', theme.gradient.header, 'bg-clip-text text-transparent')}>
              Your Personalized Guidance
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Step-by-step support through this difficult time</p>
          </div>
          
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'border-2')}>
              <CardHeader>
                <CardTitle className="text-2xl">Guidance Complete</CardTitle>
                <CardDescription>Based on your answers, here's what to do next</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={theme.text.secondary}>Your personalized guidance has been generated. Navigate through the sections to learn more.</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => setCurrentStep('marketplace')} className={theme.button.primary}>
                    Browse Marketplace
                  </Button>
                  <Button onClick={() => setCurrentStep('checklist')} variant="outline" className={theme.button.outline}>
                    View Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [triageData, setTriageData] = useState<TriageData>({
    deathLocation: '',
    jurisdiction: '',
    hasWill: null,
    hasFuneralPlan: null,
    ageCategory: '',
    religion: '',
    burialOrCremation: '',
    postcode: '',
    nationality: 'UK',
    needsRepatriation: false
  })
  
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    if (voiceEnabled && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleVoiceCommand(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
      }
      
      if (isListening) {
        recognition.start()
      }
    }
  }, [isListening, voiceEnabled])

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    if (lowerCommand.includes('home')) setCurrentStep('welcome')
    else if (lowerCommand.includes('start') || lowerCommand.includes('begin')) setCurrentStep('triage')
    else if (lowerCommand.includes('marketplace')) setCurrentStep('marketplace')
    else if (lowerCommand.includes('memorial')) setCurrentStep('memorial')
    else if (lowerCommand.includes('chat') || lowerCommand.includes('help')) setCurrentStep('chat')
    else if (lowerCommand.includes('checklist')) setCurrentStep('checklist')
  }

  const handleTriageComplete = (answers: Record<string, any>) => {
    const newTriageData: TriageData = {
      deathLocation: answers.location || '',
      jurisdiction: answers.jurisdiction || '',
      hasWill: answers.will === 'yes' ? true : answers.will === 'no' ? false : null,
      hasFuneralPlan: answers.funeral_plan === 'yes' ? true : answers.funeral_plan === 'no' ? false : null,
      ageCategory: answers.age || '',
      religion: answers.religion || '',
      burialOrCremation: answers.burial_cremation || '',
      postcode: answers.postcode || '',
      nationality: answers.abroad_country ? 'Other' : 'UK',
      needsRepatriation: answers.repatriation === 'yes'
    }
    setTriageData(newTriageData)
    setCurrentStep('guidance')
  }

  return (
    <div className="min-h-screen">
      {currentStep === 'welcome' && (
        <WelcomeScreen
          voiceEnabled={voiceEnabled}
          isListening={isListening}
          setIsListening={setIsListening}
          setCurrentStep={setCurrentStep}
          setVoiceEnabled={setVoiceEnabled}
        />
      )}
      {currentStep === 'triage' && (
        <TriageWizard
          onComplete={handleTriageComplete}
          onBack={() => setCurrentStep('welcome')}
        />
      )}
      {currentStep === 'guidance' && (
        <GuidanceScreen
          triageData={triageData}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 'marketplace' && <MarketplaceScreen setCurrentStep={setCurrentStep} userPostcode={triageData.postcode} />}
      {currentStep === 'memorial' && <MemorialScreen setCurrentStep={setCurrentStep} />}
      {currentStep === 'documents' && <DocumentVaultScreen setCurrentStep={setCurrentStep} />}
      {currentStep === 'chat' && <ChatScreen setCurrentStep={setCurrentStep} context={{ answers: triageData }} />}
      {currentStep === 'checklist' && <ChecklistScreen setCurrentStep={setCurrentStep} />}
      {currentStep === 'concierge' && <ConciergeScreen setCurrentStep={setCurrentStep} />}

      {/* Docked AI Assistant - always available */}
      <DockedAIAssistant 
        context={{
          currentStep,
          answers: triageData,
          currentQuestion: currentStep === 'triage' ? 'triage' : undefined
        }}
      />

      {/* Fixed action buttons */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
        <Button 
          size="lg" 
          className={cn('rounded-full shadow-lg bg-red-600 hover:bg-red-700', theme.transition.default)}
          onClick={() => window.open('https://www.cruse.org.uk', '_blank')}
        >
          <Phone className="w-5 h-5 mr-2" />
          Crisis Support
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn('rounded-full shadow-lg bg-white', theme.transition.default)}
          onClick={() => setCurrentStep('documents')}
        >
          <FileText className="w-5 h-5 mr-2" />
          Documents
        </Button>
      </div>
    </div>
  )
}

export default App
