import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, Upload, FileText, Download, Trash2, Lock, File } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'

interface DocumentVaultScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  data: string
  uploadedAt: Date
  category: 'certificate' | 'will' | 'insurance' | 'property' | 'financial' | 'other'
}

const categoryLabels = {
  'certificate': 'Death Certificate',
  'will': 'Will & Testament',
  'insurance': 'Insurance',
  'property': 'Property',
  'financial': 'Financial',
  'other': 'Other'
}

export const DocumentVaultScreen = ({ setCurrentStep }: DocumentVaultScreenProps) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Document['category'] | 'all'>('all')

  useEffect(() => {
    const saved = localStorage.getItem('afterlife-documents')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDocuments(parsed.map((d: any) => ({
          ...d,
          uploadedAt: new Date(d.uploadedAt)
        })))
      } catch (e) {
        console.error('Failed to load documents', e)
      }
    }
  }, [])

  const saveDocuments = (updatedDocuments: Document[]) => {
    localStorage.setItem('afterlife-documents', JSON.stringify(updatedDocuments))
    setDocuments(updatedDocuments)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: Document['category']) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const doc: Document = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result as string,
            uploadedAt: new Date(),
            category
          }
          const updated = [...documents, doc]
          saveDocuments(updated)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a')
    link.href = doc.data
    link.download = doc.name
    link.click()
  }

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const updated = documents.filter(d => d.id !== docId)
      saveDocuments(updated)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === selectedCategory)

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊'
    return '📎'
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
              Document Vault
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Securely store and manage important documents</p>
          </div>

          <FloatingCard delay={0}>
            <Alert className={cn(theme.card.info, 'mb-6 border-2')}>
              <Lock className="h-5 w-5 text-blue-600" />
              <AlertDescription className={theme.text.secondary}>
                Your documents are stored securely in your browser. Maximum file size: 5MB per document.
              </AlertDescription>
            </Alert>
          </FloatingCard>

          {/* Upload Section */}
          <FloatingCard delay={100}>
            <Card className={cn(theme.card.default, 'mb-8 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-2xl', theme.text.primary)}>Upload Documents</CardTitle>
                <CardDescription>Organize your documents by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryLabels).map(([category, label]) => (
                    <div key={category} className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className={cn('text-sm font-semibold mb-2', theme.text.primary)}>{label}</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleFileUpload(e, category as Document['category'])}
                        className="hidden"
                        id={`upload-${category}`}
                      />
                      <label htmlFor={`upload-${category}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(theme.button.outline, theme.transition.default)}
                          asChild
                        >
                          <span>
                            <Upload className="w-3 h-3 mr-1" />
                            Upload
                          </span>
                        </Button>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(selectedCategory === 'all' ? theme.button.selected : theme.button.outline, theme.transition.default)}
            >
              All ({documents.length})
            </Button>
            {Object.entries(categoryLabels).map(([category, label]) => {
              const count = documents.filter(d => d.category === category).length
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category as Document['category'])}
                  className={cn(selectedCategory === category ? theme.button.selected : theme.button.outline, theme.transition.default)}
                >
                  {label} ({count})
                </Button>
              )
            })}
          </div>

          {/* Documents List */}
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc, index) => (
                <FloatingCard key={doc.id} delay={200 + index * 50}>
                  <Card className={cn(theme.card.default, 'border-2')}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className={cn('font-semibold truncate', theme.text.primary)}>{doc.name}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={theme.text.muted}>{categoryLabels[doc.category]}</span>
                            <span className={theme.text.muted}>•</span>
                            <span className={theme.text.muted}>{formatFileSize(doc.size)}</span>
                            <span className={theme.text.muted}>•</span>
                            <span className={theme.text.muted}>{doc.uploadedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className={cn(theme.button.outline, theme.transition.default)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                            className={cn('border-red-300 text-red-600 hover:bg-red-50', theme.transition.default)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingCard>
              ))}
            </div>
          ) : (
            <FloatingCard delay={200}>
              <Card className={cn(theme.card.default, 'border-2')}>
                <CardContent className="py-12 text-center">
                  <File className={cn('w-16 h-16 mx-auto mb-4', theme.text.muted)} />
                  <p className={cn('text-lg', theme.text.muted)}>
                    {selectedCategory === 'all' 
                      ? 'No documents uploaded yet. Upload your first document above.'
                      : `No ${categoryLabels[selectedCategory]} documents yet.`
                    }
                  </p>
                </CardContent>
              </Card>
            </FloatingCard>
          )}
        </div>
      </div>
    </div>
  )
}


