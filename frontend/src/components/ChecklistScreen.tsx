import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Home, CheckCircle2, Circle, Clock, FileText, Heart, Briefcase } from 'lucide-react'
import { FloatingCard, ParallaxBackground } from './FloatingCard.tsx'
import { theme, cn } from '../theme.ts'

interface ChecklistScreenProps {
  setCurrentStep: (step: 'welcome' | 'triage' | 'guidance' | 'marketplace' | 'memorial' | 'documents' | 'chat' | 'concierge' | 'checklist') => void
}

interface Task {
  id: string
  title: string
  description: string
  category: 'immediate' | 'registration' | 'funeral' | 'probate'
  completed: boolean
  urgent: boolean
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Obtain Medical Certificate of Cause of Death (MCCD)',
    description: 'Contact GP (expected death) or hospital/care home (other deaths). Required before registration.',
    category: 'immediate',
    completed: false,
    urgent: true
  },
  {
    id: '2',
    title: 'Arrange care of the deceased',
    description: 'Contact funeral director to move deceased into their care within a few days.',
    category: 'immediate',
    completed: false,
    urgent: true
  },
  {
    id: '3',
    title: 'Secure property and belongings',
    description: 'Lock home, stop deliveries, arrange pet care, secure valuables.',
    category: 'immediate',
    completed: false,
    urgent: false
  },
  {
    id: '4',
    title: 'Locate the Will',
    description: 'Search home, contact solicitors, check National Will Register.',
    category: 'immediate',
    completed: false,
    urgent: false
  },
  
  {
    id: '5',
    title: 'Register the death',
    description: 'Book appointment at register office within 5 days (8 days in Scotland). Bring MCCD.',
    category: 'registration',
    completed: false,
    urgent: true
  },
  {
    id: '6',
    title: 'Order death certificates',
    description: 'Get 5-10 certified copies from registrar (photocopies not accepted by most organizations).',
    category: 'registration',
    completed: false,
    urgent: false
  },
  {
    id: '7',
    title: 'Use Tell Us Once service',
    description: 'Notify government departments at once (not available in Northern Ireland).',
    category: 'registration',
    completed: false,
    urgent: false
  },
  {
    id: '8',
    title: 'Notify banks, insurance, and utilities',
    description: 'Contact all financial institutions and service providers individually.',
    category: 'registration',
    completed: false,
    urgent: false
  },
  
  {
    id: '9',
    title: 'Choose funeral director and service type',
    description: 'Compare prices, decide on burial/cremation, traditional/direct service.',
    category: 'funeral',
    completed: false,
    urgent: false
  },
  {
    id: '10',
    title: 'Plan the funeral service',
    description: 'Choose venue, celebrant, music, readings, flowers, wake arrangements.',
    category: 'funeral',
    completed: false,
    urgent: false
  },
  
  {
    id: '11',
    title: 'Value the estate',
    description: 'Create inventory of all assets (property, savings, investments) and debts.',
    category: 'probate',
    completed: false,
    urgent: false
  },
  {
    id: '12',
    title: 'Apply for Grant of Probate/Letters of Administration',
    description: 'Submit application to Probate Registry (if estate over £5,000 or includes property).',
    category: 'probate',
    completed: false,
    urgent: false
  }
]

const categoryInfo = {
  immediate: {
    title: 'Immediate Actions',
    description: 'First 48 hours',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  registration: {
    title: 'Registration & Notifications',
    description: 'Within 5-8 days',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  funeral: {
    title: 'Funeral Planning',
    description: 'Usually within 2-4 weeks',
    icon: Heart,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200'
  },
  probate: {
    title: 'Probate & Estate',
    description: 'Ongoing process',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  }
}

export const ChecklistScreen = ({ setCurrentStep }: ChecklistScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedCategory, setSelectedCategory] = useState<Task['category'] | 'all'>('all')

  useEffect(() => {
    const saved = localStorage.getItem('afterlife-checklist')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load checklist', e)
      }
    }
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('afterlife-checklist', JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const toggleTask = (taskId: string) => {
    const updated = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    saveTasks(updated)
  }

  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory)

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  const getCategoryStats = (category: Task['category']) => {
    const categoryTasks = tasks.filter(t => t.category === category)
    const completed = categoryTasks.filter(t => t.completed).length
    return { completed, total: categoryTasks.length }
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
              Checklist
            </h1>
            <p className={cn('text-xl', theme.text.muted)}>Track your progress through the bereavement process</p>
          </div>

          {/* Progress Overview */}
          <FloatingCard delay={0}>
            <Card className={cn(theme.card.default, 'mb-6 border-2')}>
              <CardHeader>
                <CardTitle className={cn('text-2xl', theme.text.primary)}>Overall Progress</CardTitle>
                <CardDescription>{completedCount} of {totalCount} tasks completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className={cn('text-center mt-2 font-semibold', theme.text.primary)}>{progressPercentage}%</p>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(selectedCategory === 'all' ? theme.button.selected : theme.button.outline, theme.transition.default)}
            >
              All Tasks ({totalCount})
            </Button>
            {Object.entries(categoryInfo).map(([category, info]) => {
              const stats = getCategoryStats(category as Task['category'])
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category as Task['category'])}
                  className={cn(selectedCategory === category ? theme.button.selected : theme.button.outline, theme.transition.default)}
                >
                  {info.title} ({stats.completed}/{stats.total})
                </Button>
              )
            })}
          </div>

          {/* Tasks by Category */}
          {selectedCategory === 'all' ? (
            <div className="space-y-8">
              {Object.entries(categoryInfo).map(([category, info], catIndex) => {
                const categoryTasks = tasks.filter(t => t.category === category)
                const Icon = info.icon
                return (
                  <FloatingCard key={category} delay={100 + catIndex * 100}>
                    <Card className={cn(theme.card.default, 'border-2', info.borderColor)}>
                      <CardHeader className={info.bgColor}>
                        <CardTitle className={cn('text-xl flex items-center gap-2', info.color)}>
                          <Icon className="w-5 h-5" />
                          {info.title}
                        </CardTitle>
                        <CardDescription>{info.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-3">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={cn(
                              'p-4 rounded-lg border-2 cursor-pointer transition-all',
                              task.completed
                                ? 'bg-emerald-50 border-emerald-200'
                                : task.urgent
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-white border-slate-200 hover:border-indigo-300'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {task.completed ? (
                                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className={cn(
                                  'font-semibold mb-1',
                                  task.completed ? 'line-through text-slate-500' : theme.text.primary
                                )}>
                                  {task.title}
                                  {task.urgent && !task.completed && (
                                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                      Urgent
                                    </span>
                                  )}
                                </h3>
                                <p className={cn(
                                  'text-sm',
                                  task.completed ? 'line-through text-slate-400' : theme.text.secondary
                                )}>
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </FloatingCard>
                )
              })}
            </div>
          ) : (
            <FloatingCard delay={100}>
              <Card className={cn(theme.card.default, 'border-2', categoryInfo[selectedCategory].borderColor)}>
                <CardHeader className={categoryInfo[selectedCategory].bgColor}>
                  <CardTitle className={cn('text-xl flex items-center gap-2', categoryInfo[selectedCategory].color)}>
                    {(() => {
                      const Icon = categoryInfo[selectedCategory].icon
                      return <Icon className="w-5 h-5" />
                    })()}
                    {categoryInfo[selectedCategory].title}
                  </CardTitle>
                  <CardDescription>{categoryInfo[selectedCategory].description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all',
                        task.completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : task.urgent
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            'font-semibold mb-1',
                            task.completed ? 'line-through text-slate-500' : theme.text.primary
                          )}>
                            {task.title}
                            {task.urgent && !task.completed && (
                              <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                Urgent
                              </span>
                            )}
                          </h3>
                          <p className={cn(
                            'text-sm',
                            task.completed ? 'line-through text-slate-400' : theme.text.secondary
                          )}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FloatingCard>
          )}

          {/* Help Alert */}
          <FloatingCard delay={300}>
            <Alert className={cn(theme.card.info, 'mt-6 border-2')}>
              <AlertDescription className={theme.text.secondary}>
                Feeling overwhelmed? Our Concierge service can handle all these tasks for you. Click the button below to learn more.
              </AlertDescription>
              <Button 
                className={cn('mt-3 w-full', theme.button.primary, theme.transition.default)}
                onClick={() => setCurrentStep('concierge')}
              >
                Learn About Concierge Service
              </Button>
            </Alert>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}


