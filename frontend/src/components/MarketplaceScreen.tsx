import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Search, MapPin, Star, Phone, Mail, Globe, Filter, Loader2 } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard'
import { theme, cn } from '../theme'
import { getSuppliers, requestQuote, Supplier, SupplierFilters } from '../services/api'

type Step = 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist' | 'about' | 'contact'
type SupplierType = 'funeral-director' | 'florist' | 'stonemason' | 'venue' | 'caterer' | 'videographer' | 'all'

interface MarketplaceScreenProps {
  setCurrentStep: (step: Step) => void
  userPostcode?: string
}

const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  'funeral-director': 'Funeral Directors',
  'florist': 'Florists',
  'stonemason': 'Stonemasons',
  'venue': 'Venues',
  'caterer': 'Caterers',
  'videographer': 'Videographers'
}

export const MarketplaceScreen = ({ setCurrentStep, userPostcode }: MarketplaceScreenProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<SupplierType | 'all'>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [quoteSuccess, setQuoteSuccess] = useState(false)

  // Fetch suppliers on mount and when filters change
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const filters: SupplierFilters = {}
        if (selectedType !== 'all') filters.type = selectedType
        if (searchQuery) filters.search = searchQuery
        if (userPostcode) filters.postcode = userPostcode
        
        const response = await getSuppliers(filters)
        setSuppliers(response.suppliers)
      } catch (err) {
        console.error('Failed to fetch suppliers:', err)
        setError('Failed to load suppliers. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(fetchSuppliers, 300)
    return () => clearTimeout(timeoutId)
  }, [selectedType, searchQuery, userPostcode])

  const handleRequestQuote = async (supplier: Supplier, message: string) => {
    if (!message.trim()) {
      alert('Please enter a message for your quote request')
      return
    }
    
    setIsSubmittingQuote(true)
    
    try {
      await requestQuote(supplier.id, {
        supplier_id: supplier.id,
        message,
        contact_name: 'User', // In production, get from auth
        contact_email: 'user@example.com', // In production, get from auth
      })
      
      setQuoteSuccess(true)
      setTimeout(() => {
        setQuoteSuccess(false)
        setSelectedSupplier(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to submit quote:', err)
      alert('Failed to send quote request. Please try again.')
    } finally {
      setIsSubmittingQuote(false)
    }
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
            <p className={cn('text-xl', theme.text.muted)}>Find trusted funeral and memorial service providers</p>
          </div>

          {/* Search and Filter Section */}
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'mb-8 border-2')}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search suppliers, services, locations..."
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
                    {Object.entries(SUPPLIER_TYPE_LABELS).map(([type, label]) => (
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading suppliers...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 gap-6">
              {suppliers.map((supplier, index) => (
                <FloatingCard key={supplier.id} delay={200 + index * 50}>
                  <Card 
                    className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} 
                    onClick={() => setSelectedSupplier(supplier)}
                  >
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
          )}

          {/* No Results */}
          {!isLoading && !error && suppliers.length === 0 && (
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
              {quoteSuccess ? (
                <Alert className={cn(theme.card.success, 'border-2')}>
                  <AlertDescription className="text-emerald-700 font-medium">
                    ✓ Quote request sent successfully! The supplier will contact you soon.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
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
                      disabled={isSubmittingQuote}
                      onClick={() => {
                        const textarea = document.getElementById(`quote-message-${selectedSupplier.id}`) as HTMLTextAreaElement
                        handleRequestQuote(selectedSupplier, textarea.value)
                      }}
                    >
                      {isSubmittingQuote ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Quote Request'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MarketplaceScreen
