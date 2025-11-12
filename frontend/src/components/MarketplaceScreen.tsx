import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ShoppingCart } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from '@/components/FloatingCard'
import { theme, cn } from '@/theme'

interface MarketplaceScreenProps {
  setCurrentStep: (step: any) => void
  userPostcode?: string
}

export const MarketplaceScreen = ({ setCurrentStep, userPostcode }: MarketplaceScreenProps) => {
  const suppliers = [
    { name: 'Dignity Funeral Directors', location: 'London', type: 'Funeral Director', priceRange: '£1,500 - £5,000' },
    { name: 'Co-op Funeralcare', location: 'Manchester', type: 'Funeral Director', priceRange: '£1,200 - £4,500' },
    { name: 'Bloom & Wild', location: 'Birmingham', type: 'Florist', priceRange: '£50 - £500' },
  ]

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
              Marketplace
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Find verified, reviewed suppliers for all your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier, index) => (
              <FloatingCard key={index} delay={index * 100}>
                <Card className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, 'border-2')}>
                  <CardHeader>
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-3', theme.icon.primary)}>
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{supplier.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={cn('text-sm mb-2', theme.text.muted)}>{supplier.location}</p>
                    <p className={cn('text-sm mb-2', theme.text.secondary)}>{supplier.type}</p>
                    <p className={cn('font-semibold', theme.accent.primary)}>{supplier.priceRange}</p>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
