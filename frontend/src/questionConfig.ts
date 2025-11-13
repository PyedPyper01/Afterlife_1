export type QuestionId = 
  | 'location'
  | 'postcode'
  | 'abroad_country'
  | 'repatriation'
  | 'police_coroner'
  | 'age'
  | 'religion'
  | 'urgent_burial'
  | 'burial_cremation'
  | 'will'
  | 'funeral_plan'
  | 'complete'

export type QuestionType = 'single' | 'text' | 'boolean'

export interface QuestionOption {
  value: string
  label: string
  next?: QuestionId | ((answers: Record<string, any>) => QuestionId)
}

export interface Question {
  id: QuestionId
  prompt: string
  description?: string
  type: QuestionType
  options?: QuestionOption[]
  placeholder?: string
  visibleIf?: (answers: Record<string, any>) => boolean
  next?: QuestionId | ((answer: any, answers: Record<string, any>) => QuestionId)
  aiPrompts?: string[] // Quick-prompt chips for AI assistant
}

export const QUESTIONS: Record<QuestionId, Question> = {
  location: {
    id: 'location',
    prompt: 'Where did the death occur?',
    description: 'This helps us provide the right guidance for your situation',
    type: 'single',
    options: [
      { 
        value: 'home-expected', 
        label: 'At home (expected)', 
        next: 'postcode' 
      },
      { 
        value: 'home-unexpected', 
        label: 'At home (unexpected)', 
        next: 'police_coroner' 
      },
      { 
        value: 'hospital', 
        label: 'In hospital', 
        next: 'postcode' 
      },
      { 
        value: 'care-home', 
        label: 'In a care home', 
        next: 'postcode' 
      },
      { 
        value: 'abroad', 
        label: 'Abroad', 
        next: 'abroad_country' 
      },
      { 
        value: 'crime-scene', 
        label: 'Suspicious circumstances', 
        next: 'police_coroner' 
      }
    ],
    aiPrompts: [
      'What counts as expected vs unexpected death?',
      'What happens if death was unexpected?',
      'Who do I contact first?'
    ]
  },

  police_coroner: {
    id: 'police_coroner',
    prompt: 'Have you contacted the police or coroner?',
    description: 'For unexpected deaths or suspicious circumstances, the police and coroner must be involved',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, already contacted', next: 'postcode' },
      { value: 'no', label: 'No, not yet', next: 'postcode' }
    ],
    visibleIf: (answers) => 
      answers.location === 'home-unexpected' || answers.location === 'crime-scene',
    aiPrompts: [
      'What will the coroner do?',
      'How long does a coroner investigation take?',
      'Can I arrange the funeral during investigation?'
    ]
  },

  abroad_country: {
    id: 'abroad_country',
    prompt: 'Which country did the death occur in?',
    description: 'This helps us provide country-specific repatriation guidance',
    type: 'text',
    placeholder: 'e.g., Spain, France, USA',
    next: 'repatriation',
    visibleIf: (answers) => answers.location === 'abroad',
    aiPrompts: [
      'What documents do I need for repatriation?',
      'How long does repatriation take?',
      'Who handles repatriation arrangements?'
    ]
  },

  repatriation: {
    id: 'repatriation',
    prompt: 'Do you need help arranging repatriation to the UK?',
    description: 'We can connect you with specialists who handle international repatriation',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, I need help', next: 'postcode' },
      { value: 'no', label: 'No, already arranged', next: 'postcode' }
    ],
    visibleIf: (answers) => answers.location === 'abroad',
    aiPrompts: [
      'What are the costs of repatriation?',
      'Does travel insurance cover repatriation?',
      'How do I contact the FCDO?'
    ]
  },

  postcode: {
    id: 'postcode',
    prompt: 'What is your postcode?',
    description: 'This helps us provide jurisdiction-specific guidance (England/Wales, Scotland, or Northern Ireland)',
    type: 'text',
    placeholder: 'e.g., SW1A 1AA',
    next: 'age',
    aiPrompts: [
      'Why do you need my postcode?',
      'What are the differences between jurisdictions?',
      'How do registration deadlines differ?'
    ]
  },

  age: {
    id: 'age',
    prompt: 'Age category of the deceased',
    type: 'single',
    options: [
      { value: 'adult', label: 'Adult', next: 'religion' },
      { value: 'child', label: 'Child (under 18)', next: 'religion' },
      { value: 'stillbirth', label: 'Stillbirth', next: 'religion' }
    ],
    aiPrompts: [
      'Are there different procedures for children?',
      'What is the definition of stillbirth?',
      'What support is available for child bereavement?'
    ]
  },

  religion: {
    id: 'religion',
    prompt: 'Religious or cultural background',
    description: 'This helps us provide culturally appropriate guidance',
    type: 'single',
    options: [
      { 
        value: 'islam', 
        label: 'Islam', 
        next: 'urgent_burial' 
      },
      { 
        value: 'judaism', 
        label: 'Judaism', 
        next: 'urgent_burial' 
      },
      { 
        value: 'hindu', 
        label: 'Hindu', 
        next: 'burial_cremation' 
      },
      { 
        value: 'sikh', 
        label: 'Sikh', 
        next: 'burial_cremation' 
      },
      { 
        value: 'christian', 
        label: 'Christian', 
        next: 'burial_cremation' 
      },
      { 
        value: 'catholic', 
        label: 'Catholic', 
        next: 'burial_cremation' 
      },
      { 
        value: 'none', 
        label: 'None/Humanist', 
        next: 'burial_cremation' 
      }
    ],
    aiPrompts: [
      'What are the religious requirements for funerals?',
      'How do I find a religious funeral director?',
      'What if the family has different religious views?'
    ]
  },

  urgent_burial: {
    id: 'urgent_burial',
    prompt: 'Do you have a community contact or preferred religious funeral director?',
    description: 'Islamic and Jewish traditions typically require burial within 24 hours. We can connect you with specialist funeral directors immediately.',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, I have a contact', next: 'burial_cremation' },
      { value: 'no', label: 'No, I need help urgently', next: 'burial_cremation' }
    ],
    visibleIf: (answers) => 
      answers.religion === 'islam' || answers.religion === 'judaism',
    aiPrompts: [
      'What are the 24-hour burial requirements?',
      'Can I delay burial for family to arrive?',
      'What if I cannot find a religious funeral director?'
    ]
  },

  burial_cremation: {
    id: 'burial_cremation',
    prompt: 'Burial or cremation preference?',
    type: 'single',
    options: [
      { value: 'burial', label: 'Burial', next: 'will' },
      { value: 'cremation', label: 'Cremation', next: 'will' },
      { value: 'unsure', label: 'Not sure yet', next: 'will' }
    ],
    aiPrompts: [
      'What are the cost differences?',
      'What are the environmental considerations?',
      'Can I change my mind later?'
    ]
  },

  will: {
    id: 'will',
    prompt: 'Is there a Will?',
    description: 'The Will names the executor and may contain funeral wishes',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, Will found', next: 'funeral_plan' },
      { value: 'no', label: 'No Will found', next: 'funeral_plan' },
      { value: 'unsure', label: 'Not sure / Still looking', next: 'funeral_plan' }
    ],
    aiPrompts: [
      'Where should I look for the Will?',
      'What happens if there is no Will?',
      'What is the National Will Register?'
    ]
  },

  funeral_plan: {
    id: 'funeral_plan',
    prompt: 'Is there a pre-paid funeral plan?',
    description: 'A funeral plan may cover significant costs',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, there is a plan', next: 'complete' },
      { value: 'no', label: 'No plan', next: 'complete' },
      { value: 'unsure', label: 'Not sure', next: 'complete' }
    ],
    aiPrompts: [
      'How do I find out if there is a funeral plan?',
      'What does a funeral plan typically cover?',
      'Can I still use a different funeral director?'
    ]
  },

  complete: {
    id: 'complete',
    prompt: 'Assessment Complete',
    type: 'single',
    options: []
  }
}

export const getFirstQuestion = (): QuestionId => 'location'

export const getNextQuestion = (
  currentId: QuestionId,
  answer: any,
  answers: Record<string, any>
): QuestionId | null => {
  const question = QUESTIONS[currentId]
  
  if (!question) return null
  
  if (typeof question.next === 'function') {
    return question.next(answer, answers)
  }
  
  if (question.next) {
    return question.next
  }
  
  if (question.options && question.type === 'single') {
    const selectedOption = question.options.find(opt => opt.value === answer)
    if (selectedOption?.next) {
      if (typeof selectedOption.next === 'function') {
        return selectedOption.next(answers)
      }
      return selectedOption.next
    }
  }
  
  return null
}


