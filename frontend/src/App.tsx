import { useState, useEffect } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Heart, Phone, FileText, MessageCircle, 
  Clock, AlertTriangle, Home, Mic, MicOff, 
  ShoppingCart
} from 'lucide-react'
import { TriageWizard } from './components/TriageWizard.tsx'
import { DockedAIAssistant } from './components/DockedAIAssistant.tsx'
import { FloatingCard, ParallaxBackground } from './components/FloatingCard.tsx'
import { MarketplaceScreen } from './components/MarketplaceScreen.tsx'
import { MemorialScreen } from './components/MemorialScreen.tsx'
import { DocumentVaultScreen } from './components/DocumentVaultScreen.tsx'
import { ChatScreen } from './components/ChatScreen.tsx'
import { ChecklistScreen } from './components/ChecklistScreen.tsx'
import { ConciergeScreen } from './components/ConciergeScreen.tsx'
import { theme, cn } from './theme.ts'

type Step = 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist' | 'about'
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
  <div className="home-premium">
    {/* Premium Navigation Header */}
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(26, 26, 26, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(135, 206, 235, 0.2)',
      padding: '20px 60px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <button onClick={() => setCurrentStep('welcome')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          Home
        </button>
        <button onClick={() => setCurrentStep('about')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          About
        </button>
        <button onClick={() => setCurrentStep('triage')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          AI Guide
        </button>
        <button onClick={() => setCurrentStep('marketplace')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          Marketplace
        </button>
        <button onClick={() => setCurrentStep('memorial')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          Memorial
        </button>
        <button onClick={() => setCurrentStep('concierge')} style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#87CEEB'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          Concierge
        </button>
      </div>
    </nav>

    <section className="hero-premium" style={{paddingTop: '120px', paddingBottom: '40px'}}>
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
        
        <div style={{position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
          <img 
            alt="AfterLife Logo" 
            src="https://customer-assets.emergentagent.com/job_griefhelp-portal/artifacts/f3bwrmaw_X2dsu6Y5A-nrnFWHDtX0r.png" 
            style={{height: '400px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 12px 50px rgba(135, 206, 235, 0.5))'}} 
          />
        </div>
        <h1 className="hero-title-premium" style={{fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '20px'}}>
          Compassionate <span className="accent">Guidance</span> When You Need It Most
        </h1>
        <p style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 48px', textAlign: 'center'}}>
          AfterLife transforms the overwhelming journey through bereavement into a clear, supported path forward. AI-powered guidance, verified professionals, and human compassion—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
          <button 
            style={{
              background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
              color: '#ffffff',
              border: 'none',
              padding: '18px 48px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(135, 206, 235, 0.3)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            onClick={() => setCurrentStep('triage')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #4682B4, #87CEEB)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(135, 206, 235, 0.6)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #87CEEB, #4682B4)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(135, 206, 235, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            START YOUR JOURNEY
          </button>
          <button 
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: '2px solid #ffffff',
              padding: '18px 48px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
            onClick={() => setCurrentStep('chat')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = '#87CEEB'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#ffffff'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            TALK TO AI GUIDE
          </button>
        </div>
    </section>

    {/* AI-Powered Guidance & Concierge Sections */}
    <section className="grid md:grid-cols-2 gap-8 px-6 py-12 max-w-6xl mx-auto">
      <FloatingCard delay={0}>
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-2xl">AI-Powered Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="card-description mb-4">Our intelligent guide is available 24/7 to answer your questions, walk you through procedures, and provide step-by-step support through every stage of your journey.</p>
            <p className="card-description font-semibold mb-4">Completely free. Always available.</p>
            <Button 
              onClick={() => setCurrentStep('chat')}
              style={{
                background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
                color: '#ffffff',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Talk to AI Guide
            </Button>
          </CardContent>
        </Card>
      </FloatingCard>

      <FloatingCard delay={100}>
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-2xl">Concierge Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="card-description mb-4">When grief makes even simple decisions feel impossible, our compassionate team handles everything. Phone calls, paperwork, coordination—we take care of it all.</p>
            <p className="card-description font-bold text-2xl mb-2" style={{color: '#87CEEB'}}>£1,000</p>
            <p className="card-description mb-4">Fixed fee. Often repaid through our savings. Complete peace of mind.</p>
            <Button 
              onClick={() => setCurrentStep('concierge')}
              style={{
                background: 'transparent',
                color: '#4682B4',
                border: '2px solid #4682B4',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      </FloatingCard>
    </section>

    {/* What We Offer Section */}
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 style={{fontSize: '48px', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>What We Offer</h2>
        <p style={{fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', margin: '0 auto'}}>
          A complete platform designed to support you through every aspect of bereavement—from the first hours after death through estate administration and beyond.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FloatingCard delay={0}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🤖</div>
              <CardTitle className="text-xl">Intelligent AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Personalized guidance that adapts to your specific situation, culture, and needs</p>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={100}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🏪</div>
              <CardTitle className="text-xl">Verified Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Trusted funeral directors, solicitors, and professionals across 570 UK areas</p>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={200}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>💐</div>
              <CardTitle className="text-xl">Memorial Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Beautiful, free tribute spaces with photos, stories, and charity donations</p>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={300}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🤝</div>
              <CardTitle className="text-xl">Concierge Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Full-service funeral administration when you need someone to take the lead</p>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={400}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⚖️</div>
              <CardTitle className="text-xl">Probate Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Clear direction through estate administration and inheritance procedures</p>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={500}>
          <Card className="premium-card">
            <CardHeader>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🔒</div>
              <CardTitle className="text-xl">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-description">Your data is encrypted and never shared without your explicit permission</p>
            </CardContent>
          </Card>
        </FloatingCard>
      </div>
    </section>
  </div>
)

interface AboutScreenProps {
  setCurrentStep: (step: Step) => void
}

const AboutScreen = ({ setCurrentStep }: AboutScreenProps) => {
  return (
    <div style={{background: '#1a1a1a', minHeight: '100vh', paddingTop: '100px'}}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep('welcome')} 
            style={{marginBottom: '24px', color: '#ffffff'}}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <div className="text-center mb-16">
            <h1 style={{fontSize: '64px', fontWeight: '800', color: '#ffffff', marginBottom: '24px'}}>
              About AfterLife
            </h1>
            <p style={{fontSize: '24px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', margin: '0 auto'}}>
              Transforming bereavement support through technology and compassion
            </p>
          </div>

          {/* AI-Powered Guidance & Concierge Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FloatingCard delay={0}>
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-2xl">AI-Powered Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="card-description mb-4">Our intelligent guide is available 24/7 to answer your questions, walk you through procedures, and provide step-by-step support through every stage of your journey.</p>
                  <p className="card-description font-semibold mb-4">Completely free. Always available.</p>
                  <Button 
                    onClick={() => setCurrentStep('chat')}
                    style={{
                      background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
                      color: '#ffffff',
                      padding: '12px 32px',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Talk to AI Guide
                  </Button>
                </CardContent>
              </Card>
            </FloatingCard>

            <FloatingCard delay={100}>
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Concierge Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="card-description mb-4">When grief makes even simple decisions feel impossible, our compassionate team handles everything. Phone calls, paperwork, coordination—we take care of it all.</p>
                  <p className="card-description font-bold text-2xl mb-2" style={{color: '#87CEEB'}}>£1,000</p>
                  <p className="card-description mb-4">Fixed fee. Often repaid through our savings. Complete peace of mind.</p>
                  <Button 
                    onClick={() => setCurrentStep('concierge')}
                    style={{
                      background: 'transparent',
                      color: '#4682B4',
                      border: '2px solid #4682B4',
                      padding: '12px 32px',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>

          {/* What We Offer Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 style={{fontSize: '48px', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>What We Offer</h2>
              <p style={{fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', margin: '0 auto'}}>
                A complete platform designed to support you through every aspect of bereavement—from the first hours after death through estate administration and beyond.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FloatingCard delay={0}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🤖</div>
                    <CardTitle className="text-xl">Intelligent AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Personalized guidance that adapts to your specific situation, culture, and needs</p>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard delay={100}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🏪</div>
                    <CardTitle className="text-xl">Verified Marketplace</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Trusted funeral directors, solicitors, and professionals across 570 UK areas</p>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard delay={200}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>💐</div>
                    <CardTitle className="text-xl">Memorial Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Beautiful, free tribute spaces with photos, stories, and charity donations</p>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard delay={300}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🤝</div>
                    <CardTitle className="text-xl">Concierge Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Full-service funeral administration when you need someone to take the lead</p>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard delay={400}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>⚖️</div>
                    <CardTitle className="text-xl">Probate Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Clear direction through estate administration and inheritance procedures</p>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard delay={500}>
                <Card className="premium-card">
                  <CardHeader>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🔒</div>
                    <CardTitle className="text-xl">Secure & Private</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="card-description">Your data is encrypted and never shared without your explicit permission</p>
                  </CardContent>
                </Card>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
    <div className="app-container">
      {/* Dynamic Background - Different for each page */}
      <div className="animated-bg">
        {currentStep === 'welcome' && (
          <video autoPlay loop muted playsInline className="bg-video bg-video-home" style={{opacity: 0.4}}>
            <source src="https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/5dlp98o6_4158435-hd_1280_720_30fps.mp4" type="video/mp4" />
          </video>
        )}
        {currentStep === 'about' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(70, 130, 180, 0.2) 50%, rgba(26, 26, 26, 0.95) 100%)',
            zIndex: 0
          }} />
        )}
        {(currentStep === 'triage' || currentStep === 'guidance' || currentStep === 'marketplace' || 
          currentStep === 'memorial' || currentStep === 'documents' || currentStep === 'chat' || 
          currentStep === 'checklist' || currentStep === 'concierge') && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1a1a1a',
            zIndex: 0
          }} />
        )}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {currentStep === 'welcome' && (
          <WelcomeScreen
            voiceEnabled={voiceEnabled}
            isListening={isListening}
            setIsListening={setIsListening}
            setCurrentStep={setCurrentStep}
            setVoiceEnabled={setVoiceEnabled}
          />
        )}
        {currentStep === 'about' && <AboutScreen setCurrentStep={setCurrentStep} />}
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
            className="rounded-full shadow-lg"
            style={{
              background: '#dc2626',
              color: '#ffffff',
              fontWeight: '600'
            }}
            onClick={() => window.open('https://www.cruse.org.uk', '_blank')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Crisis Support
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full shadow-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              border: '2px solid #87CEEB',
              fontWeight: '600'
            }}
            onClick={() => setCurrentStep('documents')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Documents
          </Button>
        </div>
      </main>
    </div>
  )
}

export default App
