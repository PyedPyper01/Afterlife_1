import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Phone, Mail, FileText, Download, CheckCircle2 } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'
import jsPDF from 'jspdf'

interface ConciergeScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
}

export const ConciergeScreen = ({ setCurrentStep }: ConciergeScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loaData, setLoaData] = useState({
    executorName: '',
    executorAddress: '',
    deceasedName: '',
    dateOfDeath: '',
    tasks: [] as string[]
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const saved = localStorage.getItem('afterlife-concierge-requests')
    const existing = saved ? JSON.parse(saved) : []
    const request = {
      ...formData,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('afterlife-concierge-requests', JSON.stringify([...existing, request]))
    
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const generateLetterOfAuthority = () => {
    if (!loaData.executorName || !loaData.deceasedName || !loaData.dateOfDeath) {
      alert('Please fill in all required fields')
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('LETTER OF AUTHORITY', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, margin, yPos)
    yPos += 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('TO WHOM IT MAY CONCERN', margin, yPos)
    yPos += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    const bodyText = [
      `I, ${loaData.executorName}, of ${loaData.executorAddress}, being the Personal Representative`,
      `(Executor/Administrator) of the estate of ${loaData.deceasedName}, who died on`,
      `${new Date(loaData.dateOfDeath).toLocaleDateString('en-GB')}, hereby authorize AfterLife Concierge Services to act on my behalf`,
      `in relation to the administration of the deceased's estate.`,
      '',
      'This authority is granted under Section 25 of the Trustee Act 1925 and permits',
      'AfterLife Concierge Services to undertake the following tasks:',
      ''
    ]

    bodyText.forEach(line => {
      doc.text(line, margin, yPos, { maxWidth: pageWidth - 2 * margin })
      yPos += 6
    })

    const tasks = loaData.tasks.length > 0 ? loaData.tasks : [
      'Registering the death with the local register office',
      'Obtaining certified copies of the death certificate',
      'Notifying government departments via Tell Us Once service',
      'Contacting banks, insurance companies, and other financial institutions',
      'Arranging funeral services and liaising with funeral directors',
      'Valuing the estate and preparing estate accounts',
      'Applying for Grant of Probate or Letters of Administration',
      'Distributing assets to beneficiaries as per the Will or intestacy rules'
    ]

    tasks.forEach((task, index) => {
      doc.text(`${index + 1}. ${task}`, margin + 5, yPos, { maxWidth: pageWidth - 2 * margin - 10 })
      yPos += 6
    })

    yPos += 5

    const limitations = [
      '',
      'This authority is valid for a period of 12 months from the date of this letter and may',
      'be revoked by me at any time by written notice.',
      '',
      'I confirm that I have the legal authority to grant this delegation and that all',
      'information provided is true and accurate to the best of my knowledge.',
      ''
    ]

    limitations.forEach(line => {
      doc.text(line, margin, yPos, { maxWidth: pageWidth - 2 * margin })
      yPos += 6
    })

    yPos += 10
    doc.text('Signed: _______________________________', margin, yPos)
    yPos += 10
    doc.text(`Name: ${loaData.executorName}`, margin, yPos)
    yPos += 10
    doc.text('Date: _______________________________', margin, yPos)
    yPos += 15

    doc.setFont('helvetica', 'bold')
    doc.text('WITNESS:', margin, yPos)
    yPos += 10
    doc.setFont('helvetica', 'normal')
    doc.text('Signed: _______________________________', margin, yPos)
    yPos += 10
    doc.text('Name: _______________________________', margin, yPos)
    yPos += 10
    doc.text('Address: _______________________________', margin, yPos)
    yPos += 10
    doc.text('Date: _______________________________', margin, yPos)

    yPos = doc.internal.pageSize.getHeight() - 20
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text('This document should be signed in the presence of an independent witness who is not a beneficiary.', pageWidth / 2, yPos, { align: 'center', maxWidth: pageWidth - 2 * margin })

    doc.save(`Letter_of_Authority_${loaData.deceasedName.replace(/\s+/g, '_')}.pdf`)
  }

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
              Concierge Service
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Let us handle everything for you</p>
          </div>

          {/* Service Overview */}
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'mb-8 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-2xl', theme.text.primary)}>Full-Service Support</CardTitle>
                <CardDescription>Professional, compassionate assistance through every step</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={cn('font-semibold mb-2 flex items-center gap-2', theme.text.primary)}>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      What We Handle
                    </h3>
                    <ul className={cn('space-y-2 text-sm', theme.text.secondary)}>
                      <li>• Death registration and certificates</li>
                      <li>• Tell Us Once notifications</li>
                      <li>• Bank and insurance notifications</li>
                      <li>• Funeral arrangements</li>
                      <li>• Estate valuation</li>
                      <li>• Probate application</li>
                      <li>• Asset distribution</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className={cn('font-semibold mb-2', theme.text.primary)}>Transparent Pricing</h3>
                    <div className="space-y-3">
                      <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
                        <p className={cn('font-semibold text-lg', theme.text.primary)}>£1,000 Fixed Fee</p>
                        <p className={cn('text-sm', theme.text.secondary)}>Immediate tasks (registration, notifications, funeral)</p>
                      </div>
                      <div className="bg-violet-50 p-4 rounded-lg border-2 border-violet-200">
                        <p className={cn('font-semibold text-lg', theme.text.primary)}>1-3% of Estate</p>
                        <p className={cn('text-sm', theme.text.secondary)}>Full probate administration (bespoke quote)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Comparison Table */}
          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'mb-8 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-xl', theme.text.primary)}>Compare Your Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className={cn('text-left py-3 px-2', theme.text.primary)}>Service</th>
                        <th className={cn('text-left py-3 px-2', theme.text.primary)}>Cost</th>
                        <th className={cn('text-left py-3 px-2', theme.text.primary)}>Time Required</th>
                        <th className={cn('text-left py-3 px-2', theme.text.primary)}>Expertise</th>
                      </tr>
                    </thead>
                    <tbody className={theme.text.secondary}>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-2 font-semibold">DIY (Self-Service)</td>
                        <td className="py-3 px-2">£0</td>
                        <td className="py-3 px-2">40-80 hours</td>
                        <td className="py-3 px-2">High risk of errors</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-indigo-50">
                        <td className="py-3 px-2 font-semibold">AfterLife Concierge</td>
                        <td className="py-3 px-2">£1,000 + 1-3%</td>
                        <td className="py-3 px-2">Minimal (we handle it)</td>
                        <td className="py-3 px-2">Expert guidance</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-2 font-semibold">Traditional Solicitor</td>
                        <td className="py-3 px-2">£2,500 - £10,000+</td>
                        <td className="py-3 px-2">Low (but expensive)</td>
                        <td className="py-3 px-2">Legal expertise</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Contact Form */}
          <FloatingCard delay={200}>
            <Card className={cn(theme.card.default, 'mb-8 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-xl', theme.text.primary)}>Request a Consultation</CardTitle>
                <CardDescription>We'll contact you within 24 hours to discuss your needs</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <Alert className={cn(theme.card.success, 'border-2')}>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <AlertDescription>
                      Thank you! We've received your request and will contact you within 24 hours.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Your Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Phone *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="07XXX XXXXXX"
                      />
                    </div>
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your situation and how we can help..."
                        className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                      />
                    </div>
                    <Button type="submit" className={cn('w-full', theme.button.primary, theme.transition.default)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Request Consultation
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Letter of Authority Generator */}
          <FloatingCard delay={300}>
            <Card className={cn(theme.card.default, 'border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-xl', theme.text.primary)}>Generate Letter of Authority</CardTitle>
                <CardDescription>Create a legal document to delegate tasks to our Concierge service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className={cn(theme.card.info, 'border-2')}>
                  <FileText className="h-5 w-5 text-blue-600" />
                  <AlertDescription className={theme.text.secondary}>
                    This Letter of Authority is granted under Section 25 of the Trustee Act 1925. It must be signed by the executor/administrator and witnessed by an independent person.
                  </AlertDescription>
                </Alert>

                <div>
                  <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Executor/Administrator Name *</label>
                  <Input
                    value={loaData.executorName}
                    onChange={(e) => setLoaData({ ...loaData, executorName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Executor/Administrator Address *</label>
                  <Input
                    value={loaData.executorAddress}
                    onChange={(e) => setLoaData({ ...loaData, executorAddress: e.target.value })}
                    placeholder="Your full address"
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Deceased's Full Name *</label>
                  <Input
                    value={loaData.deceasedName}
                    onChange={(e) => setLoaData({ ...loaData, deceasedName: e.target.value })}
                    placeholder="Full name of the deceased"
                  />
                </div>

                <div>
                  <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Date of Death *</label>
                  <Input
                    type="date"
                    value={loaData.dateOfDeath}
                    onChange={(e) => setLoaData({ ...loaData, dateOfDeath: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={generateLetterOfAuthority}
                  className={cn('w-full', theme.button.primary, theme.transition.default)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Download PDF
                </Button>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Contact Info */}
          <FloatingCard delay={400}>
            <Card className={cn(theme.card.default, 'mt-8 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-xl', theme.text.primary)}>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className={cn('font-semibold', theme.text.primary)}>Phone</p>
                    <a href="tel:08001234567" className={cn(theme.accent.primary, 'hover:underline')}>0800 123 4567</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className={cn('font-semibold', theme.text.primary)}>Email</p>
                    <a href="mailto:concierge@afterlife.co.uk" className={cn(theme.accent.primary, 'hover:underline')}>concierge@afterlife.co.uk</a>
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


