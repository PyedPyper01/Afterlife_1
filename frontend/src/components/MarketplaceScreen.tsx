import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Search, MapPin, Star, Phone, Mail, Globe, Filter, MessageCircle } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'

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


