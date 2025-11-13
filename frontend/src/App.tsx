import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  const getImmediateActions = () => {
    const actions = []
    
    if (triageData.deathLocation === 'home-unexpected' || triageData.deathLocation === 'crime-scene') {
      actions.push({
        title: 'Call 999 immediately',
        description: 'For unexpected deaths at home or suspicious circumstances, call 999. A coroner will be involved and the deceased should not be moved until permission is given.',
        urgent: true
      })
    }
    
    if (triageData.deathLocation === 'hospital') {
      actions.push({
        title: 'Contact hospital bereavement office',
        description: 'The hospital bereavement office will issue the Medical Certificate of Cause of Death (MCCD). They will guide you through the next steps.',
        urgent: false
      })
    }
    
    if (triageData.deathLocation === 'abroad') {
      actions.push({
        title: 'Contact Foreign, Commonwealth & Development Office (FCDO)',
        description: 'Call the FCDO on +44 20 7008 5000 for guidance on repatriation and local procedures.',
        urgent: true
      })
    }
    
    if (triageData.religion === 'islam' || triageData.religion === 'judaism') {
      actions.push({
        title: `Contact ${triageData.religion === 'islam' ? 'Islamic' : 'Jewish'} funeral director urgently`,
        description: `${triageData.religion === 'islam' ? 'Islamic' : 'Jewish'} tradition typically requires burial within 24 hours. Contact a specialist funeral director immediately.`,
        urgent: true
      })
    }
    
    actions.push({
      title: 'Obtain Medical Certificate of Cause of Death (MCCD)',
      description: 'This certificate is required before you can register the death. Contact the GP (for expected home deaths) or hospital/care home staff.',
      urgent: false
    })
    
    actions.push({
      title: 'Arrange care of the deceased',
      description: 'Contact a funeral director to arrange for the deceased to be moved into their care. This should be done within a few days.',
      urgent: false
    })
    
    actions.push({
      title: 'Secure property and belongings',
      description: 'Ensure the deceased\'s home is locked, stop deliveries, arrange pet care, and secure valuables.',
      urgent: false
    })
    
    actions.push({
      title: 'Locate the Will',
      description: 'Search for the Will at home, with solicitors, or check the National Will Register. The Will names the executor and may contain funeral wishes.',
      urgent: false
    })
    
    return actions
  }
  
  const getRegistrationGuidance = () => {
    const deadline = triageData.jurisdiction === 'scotland' ? '8 days' : '5 days'
    const probateTerm = triageData.jurisdiction === 'scotland' ? 'Confirmation' : 'Probate'
    const tellUsOnce = triageData.jurisdiction === 'northern-ireland' 
      ? 'Tell Us Once is not available in Northern Ireland. You will need to notify each organization individually.'
      : 'Use the Tell Us Once service to notify most government departments at once. This is offered during death registration.'
    
    return {
      deadline,
      probateTerm,
      tellUsOnce,
      steps: [
        'Book an appointment at your local register office',
        'Bring the Medical Certificate of Cause of Death (MCCD)',
        'Provide information about the deceased (full name, date of birth, address, occupation)',
        'The registrar will issue the death certificate and burial/cremation certificate',
        'Order multiple copies of the death certificate (originals are required by banks, etc.)'
      ]
    }
  }
  
  const getFuneralGuidance = () => {
    const guidance = []
    
    if (triageData.hasFuneralPlan) {
      guidance.push({
        title: 'Contact funeral plan provider',
        description: 'You indicated there is a pre-paid funeral plan. Contact the provider first as costs may already be covered.',
        priority: 'high'
      })
    }
    
    const costInfo = triageData.burialOrCremation === 'burial' 
      ? 'Average burial cost: £5,894 (includes plot, interment, and basic service)'
      : triageData.burialOrCremation === 'cremation'
      ? 'Average cremation cost: £4,431. Direct cremation (no service) from £1,295'
      : 'Average burial: £5,894. Average cremation: £4,431. Direct cremation from £1,295'
    
    guidance.push({
      title: 'Choose funeral director and service type',
      description: costInfo,
      priority: 'high'
    })
    
    if (triageData.religion && triageData.religion !== 'none') {
      const religionGuidance = {
        'islam': 'Islamic funerals typically involve ritual washing, shrouding, and burial (not cremation) within 24 hours. Contact an Islamic funeral director.',
        'judaism': 'Jewish funerals typically occur within 24 hours and involve burial (not cremation). Contact a Jewish funeral director.',
        'hindu': 'Hindu funerals typically involve cremation. The body is usually cremated within 24 hours. Consult with family and religious advisors.',
        'sikh': 'Sikh funerals typically involve cremation. Consult with the Gurdwara and family.',
        'christian': 'Christian funerals can include burial or cremation. Consult with your church for specific traditions.',
        'catholic': 'Catholic funerals traditionally involve burial, though cremation is now permitted. Consult with your parish priest.'
      }
      
      guidance.push({
        title: 'Religious considerations',
        description: religionGuidance[triageData.religion as keyof typeof religionGuidance] || '',
        priority: 'medium'
      })
    }
    
    guidance.push({
      title: 'Plan the service',
      description: 'Decide on venue, celebrant, music, readings, flowers, and whether to have a wake. Consider live streaming for distant relatives.',
      priority: 'medium'
    })
    
    return guidance
  }
  
  const getProbateGuidance = () => {
    const hasWill = triageData.hasWill
    const probateTerm = triageData.jurisdiction === 'scotland' ? 'Confirmation' : 'Probate'
    
    return {
      hasWill,
      probateTerm,
      steps: hasWill ? [
        `Identify the executor named in the Will`,
        `Value the estate (all assets and debts)`,
        `Apply for Grant of ${probateTerm} if estate value exceeds £5,000 or includes property`,
        `Calculate and pay Inheritance Tax if estate exceeds £325,000 (with exemptions)`,
        `Collect assets, pay debts, and distribute to beneficiaries according to the Will`
      ] : [
        `Identify the administrator (usually spouse, then children, following legal priority)`,
        `Value the estate (all assets and debts)`,
        `Apply for Letters of Administration`,
        `Calculate and pay Inheritance Tax if estate exceeds £325,000 (with exemptions)`,
        `Distribute estate according to intestacy rules (spouse and children first)`
      ]
    }
  }
  
  const immediateActions = getImmediateActions()
  const registrationGuidance = getRegistrationGuidance()
  const funeralGuidance = getFuneralGuidance()
  const probateGuidance = getProbateGuidance()
  
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
          
          <div className="space-y-6">
            <FloatingCard delay={0}>
              <Card className={cn(theme.card.default, 'border-2 border-amber-200')}>
                <CardHeader>
                  <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                    <Clock className="w-6 h-6 text-amber-600" />
                    Immediate Actions (First 48 Hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {immediateActions.map((action, index) => (
                    <div key={index} className={cn('p-4 rounded-lg', action.urgent ? theme.card.urgent + ' border-2' : 'bg-slate-50')}>
                      <h3 className={cn('font-semibold text-lg mb-2 flex items-center gap-2', theme.text.primary)}>
                        {action.urgent && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                        {action.title}
                      </h3>
                      <p className={theme.text.secondary}>{action.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FloatingCard>
            
            <FloatingCard delay={100}>
              <Card className={cn(theme.card.default, 'border-2 border-blue-200')}>
                <CardHeader>
                  <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                    <FileText className="w-6 h-6 text-blue-600" />
                    Death Registration
                  </CardTitle>
                  <CardDescription>
                    Register within {registrationGuidance.deadline} in {triageData.jurisdiction === 'england-wales' ? 'England/Wales' : triageData.jurisdiction === 'scotland' ? 'Scotland' : 'Northern Ireland'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={cn(theme.card.info, 'p-4 rounded-lg')}>
                    <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Tell Us Once Service</h3>
                    <p className={theme.text.secondary}>{registrationGuidance.tellUsOnce}</p>
                  </div>
                  <div>
                    <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Registration Steps:</h3>
                    <ul className="space-y-2">
                      {registrationGuidance.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="font-semibold text-blue-600">{index + 1}.</span>
                          <span className={theme.text.secondary}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
            
            <FloatingCard delay={200}>
              <Card className={cn(theme.card.default, 'border-2 border-violet-200')}>
                <CardHeader>
                  <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                    <Heart className="w-6 h-6 text-violet-600" />
                    Funeral Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {funeralGuidance.map((item, index) => (
                    <div key={index} className={cn('p-4 rounded-lg', item.priority === 'high' ? 'bg-violet-50 border-2 border-violet-200' : 'bg-slate-50')}>
                      <h3 className={cn('font-semibold text-lg mb-2', theme.text.primary)}>{item.title}</h3>
                      <p className={theme.text.secondary}>{item.description}</p>
                    </div>
                  ))}
                  <Button 
                    className={cn('w-full', theme.button.primary, theme.transition.default)}
                    onClick={() => setCurrentStep('marketplace')}
                  >
                    Browse Marketplace for Funeral Directors
                  </Button>
                </CardContent>
              </Card>
            </FloatingCard>
            
            <FloatingCard delay={300}>
              <Card className={cn(theme.card.default, 'border-2 border-indigo-200')}>
                <CardHeader>
                  <CardTitle className={cn('text-2xl flex items-center gap-2', theme.text.primary)}>
                    <FileText className="w-6 h-6 text-indigo-600" />
                    Probate & Estate Administration
                  </CardTitle>
                  <CardDescription>
                    {probateGuidance.hasWill ? 'Will found - Executor to apply for Grant of ' + probateGuidance.probateTerm : 'No Will - Administrator to apply for Letters of Administration'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className={cn(theme.card.urgent, 'border-2')}>
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <AlertDescription>
                      Probate can be complex. Consider using our Concierge service for expert assistance.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Key Steps:</h3>
                    <ul className="space-y-2">
                      {probateGuidance.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="font-semibold text-indigo-600">{index + 1}.</span>
                          <span className={theme.text.secondary}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      className={cn('flex-1', theme.button.primary, theme.transition.default)}
                      onClick={() => setCurrentStep('concierge')}
                    >
                      Delegate to Concierge
                    </Button>
                    <Button 
                      variant="outline"
                      className={cn('flex-1', theme.button.outline, theme.transition.default)}
                      onClick={() => setCurrentStep('documents')}
                    >
                      View Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>
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


--------------------------------------------------------------------------------
FILE: src/components/ChatScreen.tsx
--------------------------------------------------------------------------------
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Home, Send, MessageCircle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
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


--------------------------------------------------------------------------------
FILE: src/components/DockedAIAssistant.tsx
--------------------------------------------------------------------------------
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { theme, cn } from '../theme'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, I'm here to help guide you through this difficult time. I can answer questions about the bereavement process, explain legal terms, and help you understand what to expect at each step. How can I assist you?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateContextualResponse = async (userMessage: string): Promise<string> => {
    const postcodeRegex = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/i
    const postcodeMatch = userMessage.match(postcodeRegex)
    const postcode = postcodeMatch ? postcodeMatch[1] : context?.answers?.postcode
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
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
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    try {
      const responseText = await generateContextualResponse(currentInput)
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
    <div
      className={cn(
        'fixed z-50',
        isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6',
        theme.transition.default
      )}
    >
      <Card
        className={cn(
          'shadow-2xl border-2',
          theme.border.default,
          isMinimized ? 'w-80' : 'w-96 h-[600px]',
          theme.transition.default
        )}
      >
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
          <CardContent className="p-0 flex flex-col h-[calc(600px-73px)]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      'max-w-[80%] rounded-lg p-3',
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-900',
                      theme.transition.default
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={cn(theme.button.primary)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}


--------------------------------------------------------------------------------
FILE: src/components/MarketplaceScreen.tsx
--------------------------------------------------------------------------------
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Search, MapPin, Star, Phone, Mail, Globe, Filter, MessageCircle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

interface MarketplaceScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
  userPostcode?: string
}

type SupplierType = 'funeral-director' | 'florist' | 'stonemason' | 'venue' | 'caterer' | 'videographer'

interface Supplier {
  id: string
  name: string
  type: SupplierType
  location: string
  postcode: string
  description: string
  priceRange: string
  rating: number
  reviewCount: number
  phone: string
  email: string
  website?: string
  services: string[]
  verified: boolean
}

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Dignity Funeral Directors',
    type: 'funeral-director',
    location: 'London',
    postcode: 'SW1A 1AA',
    description: 'Compassionate funeral services with over 50 years of experience. Full service and direct cremation options available.',
    priceRange: '£1,500 - £5,000',
    rating: 4.8,
    reviewCount: 127,
    phone: '020 7123 4567',
    email: 'london@dignity.co.uk',
    website: 'https://www.dignity.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Burial', 'Repatriation'],
    verified: true
  },
  {
    id: '2',
    name: 'Co-op Funeralcare',
    type: 'funeral-director',
    location: 'Manchester',
    postcode: 'M1 1AA',
    description: 'Trusted funeral directors offering transparent pricing and personalized services.',
    priceRange: '£1,200 - £4,500',
    rating: 4.7,
    reviewCount: 98,
    phone: '0161 234 5678',
    email: 'manchester@coop.co.uk',
    website: 'https://www.co-operativefuneralcare.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Green Burial', 'Memorial Services'],
    verified: true
  },
  {
    id: '9',
    name: 'Austin & Sons Funeral Directors',
    type: 'funeral-director',
    location: 'St Albans',
    postcode: 'AL1 3JQ',
    description: 'Family-run funeral directors serving St Albans and Hertfordshire for over 40 years. Personal, caring service.',
    priceRange: '£1,800 - £4,200',
    rating: 4.9,
    reviewCount: 145,
    phone: '01727 123456',
    email: 'info@austinfunerals.co.uk',
    website: 'https://www.austinfunerals.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Burial', 'Pre-paid Plans', 'Repatriation'],
    verified: true
  },
  {
    id: '10',
    name: 'Harpenden Funeral Services',
    type: 'funeral-director',
    location: 'Harpenden',
    postcode: 'AL5 2JX',
    description: 'Independent funeral directors providing compassionate care to families in Harpenden and surrounding areas.',
    priceRange: '£1,600 - £3,800',
    rating: 4.8,
    reviewCount: 89,
    phone: '01582 765432',
    email: 'care@harpendenfunerals.co.uk',
    website: 'https://www.harpendenfunerals.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Green Burial', 'Memorial Services', 'Home Visits'],
    verified: true
  },
  {
    id: '11',
    name: 'Watford Funeral Care',
    type: 'funeral-director',
    location: 'Watford',
    postcode: 'WD17 1DP',
    description: 'Professional funeral directors serving Watford and West Hertfordshire with dignity and respect.',
    priceRange: '£1,500 - £4,000',
    rating: 4.7,
    reviewCount: 112,
    phone: '01923 234567',
    email: 'info@watfordfuneralcare.co.uk',
    website: 'https://www.watfordfuneralcare.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Burial', 'Woodland Burial', 'Ashes Caskets'],
    verified: true
  },
  {
    id: '12',
    name: 'Hemel Hempstead Funeral Directors',
    type: 'funeral-director',
    location: 'Hemel Hempstead',
    postcode: 'HP1 1EE',
    description: 'Established funeral directors offering bespoke funeral services throughout Hertfordshire.',
    priceRange: '£1,700 - £4,500',
    rating: 4.8,
    reviewCount: 98,
    phone: '01442 345678',
    email: 'enquiries@hemelfunerals.co.uk',
    website: 'https://www.hemelfunerals.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Burial', 'Celebration of Life', 'Pre-planning'],
    verified: true
  },
  {
    id: '13',
    name: 'Luton Family Funeral Services',
    type: 'funeral-director',
    location: 'Luton',
    postcode: 'LU1 2TL',
    description: 'Caring funeral directors serving Luton and Bedfordshire with personalized funeral arrangements.',
    priceRange: '£1,400 - £3,600',
    rating: 4.6,
    reviewCount: 76,
    phone: '01582 456789',
    email: 'info@lutonfunerals.co.uk',
    website: 'https://www.lutonfunerals.co.uk',
    services: ['Traditional Funeral', 'Direct Cremation', 'Burial', 'Multi-faith Services', 'Floral Tributes'],
    verified: true
  },
  {
    id: '3',
    name: 'Bloom & Wild Funeral Flowers',
    type: 'florist',
    location: 'Birmingham',
    postcode: 'B1 1AA',
    description: 'Beautiful funeral flowers and tributes, delivered with care and respect.',
    priceRange: '£50 - £500',
    rating: 4.9,
    reviewCount: 156,
    phone: '0121 345 6789',
    email: 'funeral@bloomandwild.com',
    website: 'https://www.bloomandwild.com',
    services: ['Wreaths', 'Casket Sprays', 'Standing Sprays', 'Sympathy Bouquets'],
    verified: true
  },
  {
    id: '4',
    name: 'Memorial Masonry Ltd',
    type: 'stonemason',
    location: 'Leeds',
    postcode: 'LS1 1AA',
    description: 'Expert stonemasons crafting beautiful headstones and memorials.',
    priceRange: '£800 - £3,000',
    rating: 4.6,
    reviewCount: 67,
    phone: '0113 456 7890',
    email: 'info@memorialmasonry.co.uk',
    services: ['Headstones', 'Plaques', 'Restoration', 'Inscriptions'],
    verified: true
  },
  {
    id: '5',
    name: 'The Garden Room',
    type: 'venue',
    location: 'Brighton',
    postcode: 'BN1 1AA',
    description: 'Peaceful venue for memorial services and celebration of life events.',
    priceRange: '£300 - £1,500',
    rating: 4.8,
    reviewCount: 89,
    phone: '01273 567 890',
    email: 'bookings@thegardenroom.co.uk',
    website: 'https://www.thegardenroom.co.uk',
    services: ['Memorial Services', 'Wake Hosting', 'Catering Available', 'AV Equipment'],
    verified: true
  },
  {
    id: '6',
    name: 'Comfort Catering',
    type: 'caterer',
    location: 'Bristol',
    postcode: 'BS1 1AA',
    description: 'Compassionate catering services for funeral wakes and memorial gatherings.',
    priceRange: '£15 - £40 per person',
    rating: 4.7,
    reviewCount: 112,
    phone: '0117 678 9012',
    email: 'info@comfortcatering.co.uk',
    services: ['Buffet', 'Sit-down Meals', 'Dietary Requirements', 'Venue Setup'],
    verified: true
  },
  {
    id: '7',
    name: 'Eternal Memories Video',
    type: 'videographer',
    location: 'Edinburgh',
    postcode: 'EH1 1AA',
    description: 'Professional videography and live streaming for funeral services.',
    priceRange: '£200 - £800',
    rating: 4.9,
    reviewCount: 73,
    phone: '0131 789 0123',
    email: 'bookings@eternalmemories.co.uk',
    website: 'https://www.eternalmemories.co.uk',
    services: ['Live Streaming', 'Service Recording', 'Memorial Videos', 'Photo Slideshows'],
    verified: true
  },
  {
    id: '8',
    name: 'Pure Cremation',
    type: 'funeral-director',
    location: 'London',
    postcode: 'E1 1AA',
    description: 'Affordable direct cremation services with transparent pricing.',
    priceRange: '£895 - £1,295',
    rating: 4.8,
    reviewCount: 234,
    phone: '020 8901 2345',
    email: 'info@purecremation.co.uk',
    website: 'https://www.purecremation.co.uk',
    services: ['Direct Cremation', 'Ashes Return', 'Memorial Options'],
    verified: true
  }
]

const supplierTypeLabels: Record<SupplierType, string> = {
  'funeral-director': 'Funeral Directors',
  'florist': 'Florists',
  'stonemason': 'Stonemasons',
  'venue': 'Venues',
  'caterer': 'Caterers',
  'videographer': 'Videographers'
}

export const MarketplaceScreen = ({ setCurrentStep, userPostcode }: MarketplaceScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<SupplierType | 'all'>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [quoteRequests, setQuoteRequests] = useState<Array<{supplierId: string, message: string, timestamp: Date}>>([])
  const [aiRecommendations, setAiRecommendations] = useState<string>('')
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchQuery === '' || 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'all' || supplier.type === selectedType
    
    return matchesSearch && matchesType
  })

  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (!userPostcode) return
      
      setIsLoadingRecommendations(true)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `I'm looking for funeral services and suppliers near postcode ${userPostcode}. Can you recommend what types of suppliers I should consider and what to look for when choosing them? Please provide specific guidance for my location.`,
            context: { postcode: userPostcode }
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setAiRecommendations(data.response)
        }
      } catch (error) {
        console.error('Error fetching AI recommendations:', error)
      } finally {
        setIsLoadingRecommendations(false)
      }
    }
    
    fetchAIRecommendations()
  }, [userPostcode])

  const handleRequestQuote = (supplier: Supplier, message: string) => {
    const request = {
      supplierId: supplier.id,
      message,
      timestamp: new Date()
    }
    setQuoteRequests([...quoteRequests, request])
    
    const saved = localStorage.getItem('afterlife-quote-requests')
    const existing = saved ? JSON.parse(saved) : []
    localStorage.setItem('afterlife-quote-requests', JSON.stringify([...existing, request]))
    
    setSelectedSupplier(null)
    alert(`Quote request sent to ${supplier.name}. They will contact you within 24 hours.`)
  }

  return (
    <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
      <ParallaxBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep('welcome')} 
            className={cn('mb-6', theme.button.ghost, theme.transition.default)}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <div className="text-center mb-10">
            <h1 className={cn('text-5xl font-bold mb-3', theme.gradient.header, 'bg-clip-text text-transparent')}>
              Marketplace
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Find verified, reviewed suppliers for all your needs</p>
          </div>

          <FloatingCard delay={0}>
            <Alert className={cn(theme.card.info, 'mb-6 border-2')}>
              <AlertDescription className={theme.text.secondary}>
                All suppliers are verified and CMA-compliant with transparent pricing. Compare quotes and reviews to make informed decisions.
              </AlertDescription>
            </Alert>
          </FloatingCard>

          {userPostcode && (
            <FloatingCard delay={50}>
              <Card className={cn(theme.card.default, 'mb-6 border-2 border-indigo-200')}>
                <CardHeader>
                  <CardTitle className={cn('text-xl flex items-center gap-2', theme.text.primary)}>
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                    AI Recommendations for {userPostcode}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRecommendations ? (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <span>Getting personalized recommendations for your area...</span>
                    </div>
                  ) : aiRecommendations ? (
                    <div className={cn('prose prose-sm max-w-none', theme.text.secondary)}>
                      <p className="whitespace-pre-wrap">{aiRecommendations}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </FloatingCard>
          )}

          {/* Search and Filter */}
          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'mb-6 border-2')}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search by name, location, or service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedType === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('all')}
                      className={cn(selectedType === 'all' ? theme.button.selected : theme.button.outline, theme.transition.default)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      All
                    </Button>
                    {Object.entries(supplierTypeLabels).map(([type, label]) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'outline'}
                        onClick={() => setSelectedType(type as SupplierType)}
                        className={cn(selectedType === type ? theme.button.selected : theme.button.outline, theme.transition.default)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier, index) => (
              <FloatingCard key={supplier.id} delay={200 + index * 50}>
                <Card className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} onClick={() => setSelectedSupplier(supplier)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={cn('text-xl mb-1', theme.text.primary)}>{supplier.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {supplier.location}
                        </CardDescription>
                      </div>
                      {supplier.verified && (
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
                          Verified
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={cn('text-sm mb-3', theme.text.secondary)}>{supplier.description}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className={cn('font-semibold', theme.text.primary)}>{supplier.rating}</span>
                        <span className={cn('text-sm', theme.text.muted)}>({supplier.reviewCount})</span>
                      </div>
                      <div className={cn('text-sm font-semibold', theme.accent.primary)}>
                        {supplier.priceRange}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {supplier.services.slice(0, 3).map((service, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                          {service}
                        </span>
                      ))}
                      {supplier.services.length > 3 && (
                        <span className="text-slate-500 text-xs">+{supplier.services.length - 3} more</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <FloatingCard delay={200}>
              <Card className={cn(theme.card.default, 'border-2')}>
                <CardContent className="py-12 text-center">
                  <p className={cn('text-lg', theme.text.muted)}>No suppliers found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery(''); setSelectedType('all') }}
                    className={cn('mt-4', theme.button.outline, theme.transition.default)}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </FloatingCard>
          )}
        </div>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSupplier(null)}>
          <Card className={cn(theme.card.default, 'max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2')} onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className={cn('text-2xl mb-2', theme.text.primary)}>{selectedSupplier.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedSupplier.location} • {selectedSupplier.postcode}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedSupplier(null)}>✕</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className={cn('font-semibold mb-2', theme.text.primary)}>About</h3>
                <p className={theme.text.secondary}>{selectedSupplier.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className={cn('font-semibold text-lg', theme.text.primary)}>{selectedSupplier.rating}</span>
                  <span className={theme.text.muted}>({selectedSupplier.reviewCount} reviews)</span>
                </div>
                <div className={cn('font-semibold', theme.accent.primary)}>
                  {selectedSupplier.priceRange}
                </div>
              </div>

              <div>
                <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Services</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.services.map((service, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <a href={`tel:${selectedSupplier.phone}`} className={cn(theme.accent.primary, 'hover:underline')}>
                      {selectedSupplier.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <a href={`mailto:${selectedSupplier.email}`} className={cn(theme.accent.primary, 'hover:underline')}>
                      {selectedSupplier.email}
                    </a>
                  </div>
                  {selectedSupplier.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" className={cn(theme.accent.primary, 'hover:underline')}>
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Request a Quote</h3>
                <textarea
                  id={`quote-message-${selectedSupplier.id}`}
                  placeholder="Tell us about your requirements..."
                  className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                  defaultValue=""
                />
                <Button 
                  className={cn('w-full mt-3', theme.button.primary, theme.transition.default)}
                  onClick={() => {
                    const textarea = document.getElementById(`quote-message-${selectedSupplier.id}`) as HTMLTextAreaElement
                    handleRequestQuote(selectedSupplier, textarea.value)
                  }}
                >
                  Send Quote Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


