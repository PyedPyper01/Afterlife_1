import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Heart, Upload, Share2, MessageCircle, Calendar } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'

interface MemorialScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
}

interface Memorial {
  id: string
  name: string
  dateOfBirth: string
  dateOfDeath: string
  biography: string
  photos: string[]
  condolences: Array<{
    author: string
    message: string
    timestamp: Date
  }>
  createdAt: Date
}

export const MemorialScreen = ({ setCurrentStep }: MemorialScreenProps) => {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newMemorial, setNewMemorial] = useState({
    name: '',
    dateOfBirth: '',
    dateOfDeath: '',
    biography: '',
    photos: [] as string[]
  })
  const [condolenceMessage, setCondolenceMessage] = useState('')
  const [condolenceAuthor, setCondolenceAuthor] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('afterlife-memorials')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMemorials(parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          condolences: m.condolences.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          }))
        })))
      } catch (e) {
        console.error('Failed to load memorials', e)
      }
    }
  }, [])

  const saveMemorials = (updatedMemorials: Memorial[]) => {
    localStorage.setItem('afterlife-memorials', JSON.stringify(updatedMemorials))
    setMemorials(updatedMemorials)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewMemorial(prev => ({
            ...prev,
            photos: [...prev.photos, event.target!.result as string]
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCreateMemorial = () => {
    if (!newMemorial.name || !newMemorial.dateOfBirth || !newMemorial.dateOfDeath) {
      alert('Please fill in all required fields')
      return
    }

    const memorial: Memorial = {
      id: Date.now().toString(),
      name: newMemorial.name,
      dateOfBirth: newMemorial.dateOfBirth,
      dateOfDeath: newMemorial.dateOfDeath,
      biography: newMemorial.biography,
      photos: newMemorial.photos,
      condolences: [],
      createdAt: new Date()
    }

    const updated = [...memorials, memorial]
    saveMemorials(updated)
    setNewMemorial({ name: '', dateOfBirth: '', dateOfDeath: '', biography: '', photos: [] })
    setIsCreating(false)
    setSelectedMemorial(memorial)
  }

  const handleAddCondolence = () => {
    if (!selectedMemorial || !condolenceMessage || !condolenceAuthor) {
      alert('Please fill in your name and message')
      return
    }

    const updatedMemorials = memorials.map(m => {
      if (m.id === selectedMemorial.id) {
        return {
          ...m,
          condolences: [
            ...m.condolences,
            {
              author: condolenceAuthor,
              message: condolenceMessage,
              timestamp: new Date()
            }
          ]
        }
      }
      return m
    })

    saveMemorials(updatedMemorials)
    setSelectedMemorial(updatedMemorials.find(m => m.id === selectedMemorial.id) || null)
    setCondolenceMessage('')
    setCondolenceAuthor('')
  }

  const handleShare = (memorial: Memorial) => {
    const url = `${window.location.origin}/memorial/${memorial.id}`
    const text = `In loving memory of ${memorial.name}`
    
    if (navigator.share) {
      navigator.share({ title: text, text, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Memorial link copied to clipboard!')
    }
  }

  if (isCreating) {
    return (
      <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
        <ParallaxBackground />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreating(false)} 
              className={cn('mb-6', theme.button.ghost, theme.transition.default)}
            >
              ← Back to Memorials
            </Button>
            
            <FloatingCard delay={0}>
              <Card className={cn(theme.card.default, 'border-2')}>
                <CardHeader>
                  <CardTitle className={cn('text-2xl', theme.text.primary)}>Create Memorial Page</CardTitle>
                  <CardDescription>Create a beautiful, permanent tribute that's free forever</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Full Name *</label>
                    <Input
                      value={newMemorial.name}
                      onChange={(e) => setNewMemorial({ ...newMemorial, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Date of Birth *</label>
                      <Input
                        type="date"
                        value={newMemorial.dateOfBirth}
                        onChange={(e) => setNewMemorial({ ...newMemorial, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Date of Death *</label>
                      <Input
                        type="date"
                        value={newMemorial.dateOfDeath}
                        onChange={(e) => setNewMemorial({ ...newMemorial, dateOfDeath: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Life Story</label>
                    <textarea
                      value={newMemorial.biography}
                      onChange={(e) => setNewMemorial({ ...newMemorial, biography: e.target.value })}
                      placeholder="Share memories, achievements, and what made them special..."
                      className="w-full p-3 border rounded-lg min-h-[150px] resize-none"
                    />
                  </div>

                  <div>
                    <label className={cn('block text-sm font-semibold mb-2', theme.text.primary)}>Photos</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className={cn('text-sm mb-2', theme.text.muted)}>Upload photos to celebrate their life</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button variant="outline" className={cn(theme.button.outline, theme.transition.default)} asChild>
                          <span>Choose Photos</span>
                        </Button>
                      </label>
                    </div>
                    {newMemorial.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {newMemorial.photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square">
                            <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                            <button
                              onClick={() => setNewMemorial(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index)
                              }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleCreateMemorial}
                    className={cn('w-full', theme.button.primary, theme.transition.default)}
                  >
                    Create Memorial Page
                  </Button>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>
        </div>
      </div>
    )
  }

  if (selectedMemorial) {
    return (
      <div className={cn(theme.gradient.page, 'min-h-screen relative overflow-hidden')}>
        <ParallaxBackground />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedMemorial(null)} 
              className={cn('mb-6', theme.button.ghost, theme.transition.default)}
            >
              ← Back to All Memorials
            </Button>
            
            <FloatingCard delay={0}>
              <Card className={cn(theme.card.default, 'border-2')}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={cn('text-3xl mb-2', theme.text.primary)}>{selectedMemorial.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-lg">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedMemorial.dateOfBirth).toLocaleDateString()} - {new Date(selectedMemorial.dateOfDeath).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedMemorial)}
                      className={cn(theme.button.outline, theme.transition.default)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedMemorial.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedMemorial.photos.map((photo, index) => (
                        <div key={index} className="aspect-square">
                          <img src={photo} alt={`Memory ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedMemorial.biography && (
                    <div>
                      <h3 className={cn('text-xl font-semibold mb-3', theme.text.primary)}>Life Story</h3>
                      <p className={cn('whitespace-pre-wrap', theme.text.secondary)}>{selectedMemorial.biography}</p>
                    </div>
                  )}

                  <div>
                    <h3 className={cn('text-xl font-semibold mb-3 flex items-center gap-2', theme.text.primary)}>
                      <MessageCircle className="w-5 h-5" />
                      Condolences ({selectedMemorial.condolences.length})
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      {selectedMemorial.condolences.map((condolence, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg">
                          <p className={cn('mb-2', theme.text.secondary)}>{condolence.message}</p>
                          <div className="flex items-center justify-between">
                            <p className={cn('text-sm font-semibold', theme.text.primary)}>— {condolence.author}</p>
                            <p className={cn('text-xs', theme.text.muted)}>
                              {new Date(condolence.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Card className={cn(theme.card.default, 'border-2 border-indigo-200')}>
                      <CardHeader>
                        <CardTitle className={cn('text-lg', theme.text.primary)}>Leave a Condolence</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={condolenceAuthor}
                          onChange={(e) => setCondolenceAuthor(e.target.value)}
                        />
                        <textarea
                          placeholder="Share your memories and condolences..."
                          value={condolenceMessage}
                          onChange={(e) => setCondolenceMessage(e.target.value)}
                          className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                        />
                        <Button 
                          onClick={handleAddCondolence}
                          className={cn('w-full', theme.button.primary, theme.transition.default)}
                        >
                          Post Condolence
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>
        </div>
      </div>
    )
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
              Memorial Pages
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Create beautiful, permanent tributes - free forever</p>
          </div>

          <FloatingCard delay={0}>
            <Alert className={cn(theme.card.success, 'mb-6 border-2')}>
              <Heart className="h-5 w-5 text-emerald-600" />
              <AlertDescription className={theme.text.secondary}>
                Memorial pages are completely free and will remain online permanently. Share photos, stories, and collect condolences from family and friends.
              </AlertDescription>
            </Alert>
          </FloatingCard>

          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'mb-8 border-2 text-center cursor-pointer', theme.card.hover, theme.transition.default)} onClick={() => setIsCreating(true)}>
              <CardContent className="py-12">
                <Heart className={cn('w-16 h-16 mx-auto mb-4', theme.accent.primary)} />
                <h3 className={cn('text-2xl font-semibold mb-2', theme.text.primary)}>Create a Memorial Page</h3>
                <p className={theme.text.muted}>Honor their memory with a beautiful tribute</p>
              </CardContent>
            </Card>
          </FloatingCard>

          {memorials.length > 0 && (
            <div>
              <h2 className={cn('text-2xl font-semibold mb-6', theme.text.primary)}>Your Memorials</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memorials.map((memorial, index) => (
                  <FloatingCard key={memorial.id} delay={200 + index * 50}>
                    <Card 
                      className={cn(theme.card.default, 'cursor-pointer', theme.card.hover, theme.transition.default, 'border-2')} 
                      onClick={() => setSelectedMemorial(memorial)}
                    >
                      {memorial.photos.length > 0 && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img src={memorial.photos[0]} alt={memorial.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className={cn('text-xl', theme.text.primary)}>{memorial.name}</CardTitle>
                        <CardDescription>
                          {new Date(memorial.dateOfBirth).getFullYear()} - {new Date(memorial.dateOfDeath).getFullYear()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={theme.text.muted}>
                            {memorial.photos.length} {memorial.photos.length === 1 ? 'photo' : 'photos'}
                          </span>
                          <span className={theme.text.muted}>
                            {memorial.condolences.length} {memorial.condolences.length === 1 ? 'condolence' : 'condolences'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


