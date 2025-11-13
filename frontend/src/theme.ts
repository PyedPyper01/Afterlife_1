export const theme = {
  background: {
    primary: 'bg-slate-50',
    secondary: 'bg-stone-50',
    card: 'bg-white',
    subtle: 'bg-slate-100',
    hover: 'bg-slate-100',
  },
  
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-700',
    muted: 'text-slate-600',
    light: 'text-slate-500',
  },
  
  border: {
    default: 'border-slate-200',
    subtle: 'border-slate-100',
    focus: 'border-indigo-400',
    accent: 'border-violet-200',
  },
  
  button: {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    outline: 'border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50',
    ghost: 'hover:bg-slate-100',
    selected: 'bg-indigo-600 text-white',
  },
  
  accent: {
    primary: 'text-indigo-600',
    secondary: 'text-violet-400',
    tertiary: 'text-emerald-500',
    urgent: 'text-amber-600',
    critical: 'text-red-600',
  },
  
  card: {
    default: 'bg-white border-slate-200 shadow-md',
    hover: 'hover:shadow-lg hover:-translate-y-0.5',
    urgent: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-emerald-50 border-emerald-200',
  },
  
  gradient: {
    page: 'bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100',
    header: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700',
    subtle: 'bg-gradient-to-r from-slate-50 to-stone-100',
  },
  
  icon: {
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    secondary: 'bg-gradient-to-br from-violet-400 to-violet-500',
    tertiary: 'bg-gradient-to-br from-slate-500 to-slate-600',
    urgent: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
  
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  
  transition: {
    default: 'transition-all duration-300 ease-out',
    fast: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-500 ease-out',
  },
}

export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
