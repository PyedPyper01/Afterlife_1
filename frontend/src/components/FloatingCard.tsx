import { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/theme'

interface FloatingCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const FloatingCard = ({ children, className, delay = 0 }: FloatingCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        'motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4',
        'motion-reduce:opacity-100 motion-reduce:translate-y-0',
        className
      )}
    >
      {children}
    </div>
  )
}

interface ParallaxBackgroundProps {
  className?: string
}

export const ParallaxBackground = ({ className }: ParallaxBackgroundProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      setOffset({
        x: 0,
        y: scrolled * 0.3
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      setOffset(prev => ({
        x: x,
        y: prev.y
      }))
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div
        className="absolute w-96 h-96 rounded-full bg-indigo-100/20 blur-3xl motion-reduce:transform-none"
        style={{
          top: '10%',
          left: '10%',
          transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-violet-100/20 blur-3xl motion-reduce:transform-none"
        style={{
          top: '50%',
          right: '10%',
          transform: `translate(${offset.x * 0.8}px, ${offset.y * 0.8}px)`
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full bg-slate-100/30 blur-3xl motion-reduce:transform-none"
        style={{
          bottom: '20%',
          left: '30%',
          transform: `translate(${offset.x * 1.2}px, ${offset.y * 1.2}px)`
        }}
      />
    </div>
  )
}
