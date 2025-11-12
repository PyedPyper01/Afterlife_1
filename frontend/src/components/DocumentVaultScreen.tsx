import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, FileText, Upload } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'

interface DocumentVaultScreenProps {
  setCurrentStep: (step: any) => void
}

export const DocumentVaultScreen = ({ setCurrentStep }: DocumentVaultScreenProps) => {
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
              Document Vault
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Securely store and manage important documents</p>
          </div>

          <FloatingCard delay={100}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Upload Documents</CardTitle>
                <CardDescription>Organize your documents by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600">Upload your documents here</p>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
