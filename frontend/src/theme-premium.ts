// Premium Tribute Design System
// Dark theme with glass-morphism and sky blue accents

export const premiumTheme = {
  // Color Palette
  colors: {
    background: {
      primary: '#1a1a1a',        // Main dark background
      card: '#333333f2',          // Card background with opacity
      cardLight: '#282828fa',     // Lighter card variant
      glass: 'rgba(135, 206, 235, 0.08)',  // Glass-morphism tint
      glassHover: 'rgba(135, 206, 235, 0.12)',
      overlay: 'rgba(26, 26, 26, 0.85)',
    },
    
    text: {
      primary: '#ffffff',         // Pure white
      secondary: 'rgba(255, 255, 255, 0.9)',  // 90% white
      tertiary: 'rgba(255, 255, 255, 0.7)',   // 70% white
      muted: 'rgba(255, 255, 255, 0.6)',
    },
    
    accent: {
      blue: '#87CEEB',           // Sky blue - main accent
      blueLight: '#62ECFE',      // Lighter blue
      blueDark: '#4682B4',       // Steel blue
      gradient: 'linear-gradient(135deg, #87CEEB, #4682B4)',
    },
    
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(135, 206, 235, 0.3)',
      hover: 'rgba(135, 206, 235, 0.5)',
      focus: 'rgba(135, 206, 235, 0.8)',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      display: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
      '7xl': '72px',
      huge: 'clamp(48px, 8vw, 120px)',
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.025em',
      wider: '1px',
      widest: '2px',
    },
  },
  
  // Effects
  effects: {
    blur: {
      sm: 'blur(10px)',
      md: 'blur(12px)',
      lg: 'blur(20px)',
    },
    
    backdropBlur: {
      sm: 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);',
      md: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
      lg: 'backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);',
    },
    
    shadow: {
      sm: '0 4px 20px rgba(0, 0, 0, 0.3)',
      md: '0 8px 30px rgba(0, 0, 0, 0.4)',
      lg: '0 12px 40px rgba(0, 0, 0, 0.7)',
      glow: '0 0 40px rgba(74, 144, 226, 0.3)',
      glowHover: '0 0 60px rgba(74, 144, 226, 0.6)',
    },
    
    gradient: {
      card: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08), rgba(70, 130, 180, 0.08))',
      cardHover: 'linear-gradient(135deg, rgba(135, 206, 235, 0.12), rgba(70, 130, 180, 0.12))',
      button: 'linear-gradient(135deg, #87CEEB, #4682B4)',
      buttonHover: 'linear-gradient(135deg, #4682B4, #87CEEB)',
      shimmer: 'linear-gradient(90deg, transparent, #87CEEB, transparent)',
    },
  },
  
  // Spacing
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '60px',
  },
  
  // Border Radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  
  // Transitions
  transition: {
    smooth: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.3s ease',
    default: 'all 0.5s ease',
  },
  
  // Button Styles
  button: {
    primary: {
      base: `
        background: linear-gradient(135deg, #87CEEB, #4682B4);
        color: #ffffff;
        border: none;
        padding: 18px 48px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-radius: 0;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 40px rgba(74, 144, 226, 0.3);
      `,
      hover: `
        background: linear-gradient(135deg, #4682B4, #87CEEB);
        box-shadow: 0 0 60px rgba(74, 144, 226, 0.6);
        transform: translateY(-2px);
      `,
    },
    
    secondary: {
      base: `
        background: transparent;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 18px 48px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-radius: 0;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: rgba(255, 255, 255, 0.05);
        border-color: #87CEEB;
        transform: translateY(-2px);
      `,
    },
  },
  
  // Card Styles
  card: {
    glass: {
      base: `
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background: linear-gradient(135deg, rgba(135, 206, 235, 0.08), rgba(70, 130, 180, 0.08));
        border: 1px solid rgba(135, 206, 235, 0.3);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: linear-gradient(135deg, rgba(135, 206, 235, 0.12), rgba(70, 130, 180, 0.12));
        border-color: rgba(135, 206, 235, 0.5);
        box-shadow: 0 8px 30px rgba(135, 206, 235, 0.2);
        transform: translateY(-8px);
      `,
    },
  },
  
  // Animation Keyframes
  animations: {
    fadeInUp: `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    
    bounce: `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `,
    
    shimmer: `
      @keyframes shimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
    `,
  },
}

// Utility function to apply premium styles
export const applyPremiumStyle = (element: string) => {
  const styles = {
    heading: `
      font-family: ${premiumTheme.typography.fontFamily.display};
      font-weight: ${premiumTheme.typography.fontWeight.extrabold};
      letter-spacing: ${premiumTheme.letterSpacing.tight};
      text-transform: uppercase;
      color: ${premiumTheme.colors.text.primary};
    `,
    
    body: `
      font-family: ${premiumTheme.typography.fontFamily.body};
      font-weight: ${premiumTheme.typography.fontWeight.medium};
      color: ${premiumTheme.colors.text.secondary};
      line-height: 1.6;
    `,
    
    card: premiumTheme.card.glass.base,
    
    button: premiumTheme.button.primary.base,
  }
  
  return styles[element as keyof typeof styles] || ''
}

// CSS class helpers (Tailwind-compatible)
export const premiumClasses = {
  background: {
    primary: 'bg-[#1a1a1a]',
    dark: 'bg-[#333333f2]',
  },
  
  text: {
    white: 'text-white',
    primary: 'text-white',
    secondary: 'text-white/90',
    muted: 'text-white/70',
  },
  
  accent: {
    blue: 'text-[#87CEEB]',
    border: 'border-[#87CEEB]/30',
    borderHover: 'hover:border-[#87CEEB]/50',
  },
  
  effect: {
    blur: 'backdrop-blur-lg',
    glass: 'backdrop-blur-[10px] bg-gradient-to-br from-[#87CEEB]/8 to-[#4682B4]/8',
  },
}

export default premiumTheme
