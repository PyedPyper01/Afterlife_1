import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App_premium.css'

const API = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : 'http://localhost:8001/api'

// ==================== UTILITY HOOKS ====================
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('LocalStorage error:', e)
    }
  }, [key, value])

  return [value, setValue]
}

// ==================== MAIN APP ====================
function App() {
  const [page, setPage] = useState('home')
  const [sessionId] = useLocalStorage('chat_session_id', `session_${Date.now()}`)

  useEffect(() => {
    const hash = window.location.hash.slice(2) || 'home'
    setPage(hash)
  }, [])

  const navigate = (p) => {
    setPage(p)
    window.location.hash = `#/${p}`
  }

  // Define video backgrounds for each page
  const videoBackgrounds = {
    home: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/5dlp98o6_4158435-hd_1280_720_30fps.mp4', // Keep original
    about: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/le4u3l9h_6446287-uhd_3840_2160_30fps.mp4',
    concierge: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/e6ucnrzj_5724712-uhd_3840_2160_30fps.mp4',
    'ai-guide': 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/5lpo0y1q_3561988-hd_1920_1080_25fps.mp4',
    marketplace: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/rkyvo5e5_9335381-hd_1920_1080_25fps.mp4',
    memorial: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/x3pdgfjw_5120402-hd_1920_1080_25fps.mp4',
    documents: 'https://customer-assets.emergentagent.com/job_griefguide-2/artifacts/e6ucnrzj_5724712-uhd_3840_2160_30fps.mp4'
  }

  const currentVideo = videoBackgrounds[page] || videoBackgrounds.home
  const isHomePage = page === 'home'

  return (
    <div className="app-container">
      <div className="animated-bg">
        <video 
          key={page === 'home' ? 'home-video' : currentVideo}
          autoPlay 
          loop 
          muted 
          playsInline
          className={`bg-video ${isHomePage ? 'bg-video-home' : 'bg-video-other'}`}
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
      </div>
      
      <Nav page={page} navigate={navigate} />
      
      <main className="main-content">
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'ai-guide' && <AIGuide sessionId={sessionId} navigate={navigate} />}
        {page === 'marketplace' && <Marketplace />}
        {page === 'memorial' && <Memorial />}
        {page === 'documents' && <Documents sessionId={sessionId} />}
        {page === 'concierge' && <Concierge />}
        {page === 'about' && <About />}
        {page === 'payment-success' && <PaymentSuccess />}
        {page === 'payment-cancelled' && <PaymentCancelled />}
      </main>

      <Footer />
    </div>
  )
}

// ==================== NAVIGATION ====================
function Nav({ page, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('home')} style={{cursor: 'pointer'}}>
          {/* Logo removed as per user request */}
        </div>

        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <a onClick={() => navigate('home')} className={page === 'home' ? 'active' : ''}>Home</a>
          <a onClick={() => navigate('about')} className={page === 'about' ? 'active' : ''}>About</a>
          <a onClick={() => navigate('ai-guide')} className={page === 'ai-guide' ? 'active' : ''}>AI Guide</a>
          <a onClick={() => navigate('marketplace')} className={page === 'marketplace' ? 'active' : ''}>Marketplace</a>
          <a onClick={() => navigate('memorial')} className={page === 'memorial' ? 'active' : ''}>Memorial</a>
          <a onClick={() => navigate('concierge')} className={page === 'concierge' ? 'active' : ''}>Concierge</a>
        </div>
      </div>
    </nav>
  )
}

// ==================== HOME ====================
function Home({ navigate }) {
  return (
    <div className="home-premium">
      <section className="hero-premium" style={{paddingTop: '30px', paddingBottom: '40px'}}>
        <div style={{
          position: 'relative',
          height: '800px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <img 
            src="https://customer-assets.emergentagent.com/job_griefhelp-portal/artifacts/f3bwrmaw_X2dsu6Y5A-nrnFWHDtX0r.png" 
            alt="AfterLife Logo" 
            style={{
              height: '800px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 50px rgba(135, 206, 235, 0.5))'
            }}
          />
        </div>
        <h1 className="hero-title-premium" style={{fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '20px'}}>
          Compassionate
          <span className="accent">Guidance</span>
          When You Need It Most
        </h1>
        <p className="hero-subtitle-premium">
          AfterLife transforms the overwhelming journey through bereavement into a clear, supported path forward. AI-powered guidance, verified professionals, and human compassion—all in one place.
        </p>
        <div className="hero-actions">
          <button className="btn-premium btn-premium-primary" onClick={() => navigate('ai-guide')}>
            Start Your Journey
          </button>
          <button className="btn-premium btn-premium-secondary" onClick={() => navigate('marketplace')}>
            Explore Services
          </button>
        </div>
        <div className="scroll-indicator"></div>
      </section>

      <section className="dual-cta-premium">
        <div className="cta-card-premium">
          <h2>AI-Powered Guidance</h2>
          <p>Our intelligent guide is available 24/7 to answer your questions, walk you through procedures, and provide step-by-step support through every stage of your journey.</p>
          <p style={{fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '24px'}}>Completely free. Always available.</p>
          <button className="btn-premium btn-premium-primary" onClick={() => navigate('ai-guide')} style={{marginTop: '32px'}}>
            Talk to AI Guide
          </button>
        </div>

        <div className="cta-card-premium">
          <h2>Concierge Service</h2>
          <p>When grief makes even simple decisions feel impossible, our compassionate team handles everything. Phone calls, paperwork, coordination—we take care of it all.</p>
          <p className="price">£1,000</p>
          <p style={{fontSize: '14px', color: 'var(--text-tertiary)', fontStyle: 'italic'}}>Fixed fee. Often repaid through our savings. Complete peace of mind.</p>
          <button className="btn-premium btn-premium-secondary" onClick={() => navigate('concierge')} style={{marginTop: '32px'}}>
            Learn More
          </button>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">What We Offer</h2>
        <p className="section-subtitle">
          A complete platform designed to support you through every aspect of bereavement—from the first hours after death through estate administration and beyond.
        </p>

        <div className="feature-grid-premium">
          <div className="feature-item-premium">
            <div className="feature-icon-premium">🤖</div>
            <h3>Intelligent AI</h3>
            <p>Personalized guidance that adapts to your specific situation, culture, and needs</p>
          </div>
          <div className="feature-item-premium">
            <div className="feature-icon-premium">🏪</div>
            <h3>Verified Marketplace</h3>
            <p>Trusted funeral directors, solicitors, and professionals across 570 UK areas</p>
          </div>
          <div className="feature-item-premium">
            <div className="feature-icon-premium">💐</div>
            <h3>Memorial Pages</h3>
            <p>Beautiful, free tribute spaces with photos, stories, and charity donations</p>
          </div>
          <div className="feature-item-premium">
            <div className="feature-icon-premium">🤝</div>
            <h3>Concierge Support</h3>
            <p>Full-service funeral administration when you need someone to take the lead</p>
          </div>
          <div className="feature-item-premium">
            <div className="feature-icon-premium">⚖️</div>
            <h3>Probate Guidance</h3>
            <p>Clear direction through estate administration and inheritance procedures</p>
          </div>
          <div className="feature-item-premium">
            <div className="feature-icon-premium">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and never shared without your explicit permission</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ==================== AI GUIDE ====================
function AIGuide({ sessionId, navigate }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)  // Regular state, not localStorage
  const [userProfile, setUserProfile] = useLocalStorage('user_profile', {})
  const messagesEndRef = useRef(null)

  const JOURNEY_STEPS = [
    {
      id: 0,
      title: "Welcome",
      prompt: "I'm so sorry for your loss.\n\nThis is an incredibly difficult time, and I'm here to support you with both the emotional and practical aspects.\n\nFirst, please take all the time you need.\n\nWhen did this happen?",
      options: [
        { label: "Within the last 24 hours", value: "24hrs" },
        { label: "In the last few days", value: "few_days" },
        { label: "Within the last week", value: "week" },
        { label: "Longer ago", value: "longer" }
      ]
    },
    {
      id: 1,
      title: "How You're Feeling",
      prompt: "There's no right or wrong way to feel right now.\n\nAre you feeling overwhelmed by everything that needs to be done?",
      options: [
        { label: "Yes, I don't know where to start", value: "overwhelmed" },
        { label: "I need help with specific tasks", value: "specific" },
        { label: "I just need a checklist", value: "checklist" },
        { label: "I want full support - do it for me", value: "concierge" }
      ]
    },
    {
      id: 2,
      title: "Immediate Needs",
      prompt: "Let me help you understand what needs to happen first.\n\nHave any of these been done yet?",
      options: [
        { label: "✓ Death has been registered", value: "registered" },
        { label: "Doctor issued certificate, but not registered yet", value: "cert_only" },
        { label: "Nothing has been done yet", value: "nothing" },
        { label: "I don't know what's been done", value: "unsure" }
      ]
    },
    {
      id: 3,
      title: "Location",
      prompt: "Where are you located? This helps me give you the right guidance for your area.",
      options: [
        { label: "England", value: "england" },
        { label: "Wales", value: "wales" },
        { label: "Scotland", value: "scotland" },
        { label: "Northern Ireland", value: "ni" }
      ]
    },
    {
      id: 4,
      title: "Registering the Death",
      prompt: "In England and Wales, you have 5 days to register the death.\nIn Scotland, it's 8 days.\n\nI can help you with this. Do you have the Medical Certificate from the doctor?",
      options: [
        { label: "Yes, I have it", value: "yes" },
        { label: "Still waiting for it", value: "waiting" },
        { label: "I'm not sure what this is", value: "unsure" }
      ]
    },
    {
      id: 5,
      title: "Funeral Wishes",
      prompt: "When you're ready, we need to think about funeral arrangements.\n\nDid your loved one leave any wishes about what they wanted?",
      options: [
        { label: "Yes, they left instructions", value: "yes_instructions" },
        { label: "No instructions, but I know what they'd want", value: "i_know" },
        { label: "I'm not sure what they'd want", value: "unsure" },
        { label: "I need help deciding", value: "need_help" }
      ]
    },
    {
      id: 6,
      title: "Funeral Options",
      prompt: "There are a few options. I'll explain each one:\n\n• **Traditional burial** (£4,000-£7,000) - Funeral service then burial\n• **Cremation with service** (£3,500-£6,000) - Service then cremation  \n• **Direct cremation** (£1,200-£2,000) - Simple cremation, memorial later\n\nWhich feels right?",
      options: [
        { label: "Traditional burial", value: "burial" },
        { label: "Cremation with service", value: "cremation" },
        { label: "Direct cremation (simpler, more affordable)", value: "direct" },
        { label: "I need help choosing", value: "help" }
      ]
    },
    {
      id: 7,
      title: "Finding Help",
      prompt: "Would you like me to show you local funeral directors?\n\nThey'll guide you through everything and handle the arrangements.",
      options: [
        { label: "Yes, show me local funeral directors", value: "yes", requiresPostcode: true },
        { label: "I already have someone", value: "have_one" },
        { label: "Can you handle everything for me?", value: "concierge" }
      ]
    },
    {
      id: 8,
      title: "Practical Tasks",
      prompt: "There are some organizations you'll need to notify:\n\n• Banks and building societies\n• Pension providers  \n• Government departments (HMRC, DWP)\n• Utilities and insurance\n\nWould you like help with this?",
      options: [
        { label: "Yes, generate notification letters", value: "generate" },
        { label: "Yes, I want the Concierge service (£1,000)", value: "concierge" },
        { label: "Just show me the list", value: "list" },
        { label: "I'll do this later", value: "later" }
      ]
    },
    {
      id: 9,
      title: "Your Support Plan",
      prompt: "You're doing really well.\n\nHere's what I recommend you focus on:\n\n**This week:**\n• Register the death (if not done)\n• Arrange the funeral\n• Tell close family and friends\n\n**Next 2 weeks:**\n• Notify banks and pension providers\n• Contact utilities\n\n**This month:**\n• Apply for probate (if needed)\n• Claim bereavement benefits\n\nWhat would help you most right now?",
      options: [
        { label: "Show me local funeral directors", value: "marketplace" },
        { label: "Generate notification letters", value: "notifications" },
        { label: "Tell me about the Concierge service", value: "concierge" },
        { label: "I just need the checklist", value: "checklist" },
        { label: "I need to talk to someone", value: "support" }
      ]
    }
  ]

  useEffect(() => {
    // Don't load history - always start fresh
    // loadHistory()
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Auto-start journey on component mount
    const timer = setTimeout(() => {
      startJourney()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])  // Only run once on mount

  const loadHistory = async () => {
    try {
      const { data } = await axios.get(`${API}/ai/history/${sessionId}`)
      setMessages(data.messages || [])
    } catch (e) {
      console.error('Failed to load history:', e)
    }
  }

  const startJourney = () => {
    const welcomeMsg = {
      role: 'assistant',
      content: JOURNEY_STEPS[0].prompt,  // Just use the prompt directly, don't duplicate
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMsg])
  }

  const handleOptionClick = (option) => {
    // Add user's choice as a message
    const userMsg = {
      role: 'user',
      content: option.label,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])

    // Handle special actions
    if (option.value === 'restart') {
      setCurrentStep(0)
      setMessages([])
      setTimeout(() => startJourney(), 500)
      return
    }

    if (option.value === 'marketplace') {
      navigate('marketplace')
      return
    }

    if (option.value === 'concierge') {
      // Add confirmation message
      const confirmMsg = {
        role: 'assistant',
        content: "Perfect. Our Concierge team will handle everything for you - from death registration to funeral arrangements and all notifications.\n\nTaking you to the Concierge service now (£1,000 fixed fee)...",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, confirmMsg])
      
      // Navigate using the proper navigate function
      setTimeout(() => {
        navigate('concierge')
      }, 1500)
      return
    }

    if (option.requiresPostcode) {
      // Show postcode input prompt
      setInput('')
      const aiMsg = {
        role: 'assistant',
        content: "Great! What's your postcode? (e.g., SW1A 1AA)\n\nI'll show you verified funeral directors within 5 miles.",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMsg])
      
      // Set a flag to expect postcode next
      setUserProfile({ ...userProfile, expectingPostcode: true })
      return
    }

    // Get AI response for this choice
    sendChoiceToAI(option)
  }

  const sendChoiceToAI = async (option) => {
    setLoading(true)

    try {
      const contextMessage = `User selected: "${option.label}". Acknowledge their choice briefly (1 sentence) and explain the specific next action they should take. Be direct and actionable. If it's a postcode like "${option.label}", search for local funeral directors near that postcode and provide specific names, addresses, and contact details.`
      
      const { data } = await axios.post(`${API}/ai/chat`, {
        session_id: sessionId,
        message: contextMessage
      })

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message, 
        timestamp: data.timestamp 
      }])
    } catch (e) {
      console.error('AI error:', e)
      // Don't add fallback message on error - just skip to next step
    } finally {
      setLoading(false)
      
      // Auto-progress to next step after response or error
      if (currentStep < JOURNEY_STEPS.length - 1) {
        setTimeout(() => {
          const nextStepIndex = currentStep + 1
          setCurrentStep(nextStepIndex)
          const stepMsg = {
            role: 'assistant',
            content: JOURNEY_STEPS[nextStepIndex].prompt,
            timestamp: new Date().toISOString()
          }
          setMessages(prev => [...prev, stepMsg])
        }, 2000)
      }
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }])

    try {
      // Check if we're expecting a postcode
      if (userProfile.expectingPostcode) {
        // Search for funeral directors
        const { data } = await axios.get(`${API}/suppliers/search`, {
          params: { 
            postcode: userMessage,
            type: 'funeral_director'
          }
        })
        
        if (data.suppliers && data.suppliers.length > 0) {
          const suppliers = data.suppliers.slice(0, 5) // Top 5
          let responseText = `Found ${data.count} funeral directors near ${userMessage}:\n\n`
          
          suppliers.forEach((s, i) => {
            responseText += `${i + 1}. **${s.name}**\n`
            responseText += `   📍 ${s.address}\n`
            responseText += `   📞 ${s.phone}\n`
            responseText += `   ⭐ ${s.rating} (${s.review_count} reviews)\n`
            responseText += `   💰 From £${Math.min(...Object.values(s.pricing)).toFixed(0)}\n\n`
          })
          
          responseText += `\nWould you like to see the full list in the Marketplace?`
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: responseText, 
            timestamp: new Date().toISOString() 
          }])
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I couldn't find funeral directors near ${userMessage}. Try visiting our Marketplace page to search manually.`, 
            timestamp: new Date().toISOString() 
          }])
        }
        
        // Clear postcode flag
        setUserProfile({ ...userProfile, expectingPostcode: false })
        setLoading(false)
        return
      }

      console.log('Sending message:', userMessage)
      console.log('Session ID:', sessionId)
      
      const { data } = await axios.post(`${API}/ai/chat`, {
        session_id: sessionId,
        message: userMessage  // Send the actual user message without modifications
      })

      setMessages(prev => [...prev, { role: 'assistant', content: data.message, timestamp: data.timestamp }])
      
      console.log('✅ AI response received')
    } catch (e) {
      console.error('❌ Chat error:', e)
      console.error('Response data:', e.response?.data)
      
      // Handle different error types
      let errorMsg = 'Sorry, I encountered an error. Please try again.'
      
      if (e.response?.data) {
        const errorData = e.response.data
        // Handle FastAPI validation errors
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMsg = errorData.detail
          } else if (Array.isArray(errorData.detail)) {
            // Validation error array
            errorMsg = `Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`
          } else if (typeof errorData.detail === 'object') {
            errorMsg = JSON.stringify(errorData.detail)
          }
        }
      } else if (e.message) {
        errorMsg = e.message
      }
      
      console.error('Error message:', errorMsg)
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: String(errorMsg), // Ensure it's a string
        timestamp: new Date().toISOString() 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-guide">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <div>
              <h2>🤖 AI Bereavement Guide</h2>
              <p>Direct step-by-step guidance through bereavement admin</p>
            </div>
            <div className="journey-progress">
              <span className="step-indicator">Step {currentStep + 1} of {JOURNEY_STEPS.length}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentStep + 1) / JOURNEY_STEPS.length) * 100}%` }}></div>
              </div>
              <span className="step-title">{JOURNEY_STEPS[currentStep]?.title}</span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="spinner-small"></div>
              <p>Preparing your guidance journey...</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message message-assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          {JOURNEY_STEPS[currentStep]?.options && (
            <div className="choice-options">
              {JOURNEY_STEPS[currentStep].options.map((option, idx) => (
                <button 
                  key={idx}
                  className="choice-btn" 
                  onClick={() => handleOptionClick(option)}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          
          <div className="quick-actions">
            {currentStep < JOURNEY_STEPS.length - 1 && (
              <button className="quick-action-btn" onClick={() => {
                const nextStepIndex = currentStep + 1
                setCurrentStep(nextStepIndex)
                const stepMsg = {
                  role: 'assistant',
                  content: JOURNEY_STEPS[nextStepIndex].prompt,
                  timestamp: new Date().toISOString()
                }
                setMessages(prev => [...prev, stepMsg])
              }}>
                Skip to next →
              </button>
            )}
          </div>
          
          <div className="input-row">
            <input
              type="text"
              className="chat-input"
              placeholder="Or type your own response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== MARKETPLACE ====================
function Marketplace() {
  const [suppliers, setSuppliers] = useState([])
  const [postcode, setPostcode] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)

  const searchSuppliers = async () => {
    if (!postcode.trim()) {
      alert('Please enter a postcode')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/suppliers/search`, {
        params: { postcode, type: type || undefined }
      })
      setSuppliers(data.suppliers || [])
    } catch (e) {
      console.error('Search failed:', e)
      alert('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-premium">
      <section className="hero-premium" style={{minHeight: '60vh'}}>
        <h1 className="hero-title-premium">
          Verified
          <span className="accent">Marketplace</span>
        </h1>
        <p className="hero-subtitle-premium">
          Trusted local suppliers within 5 miles of your postcode. All verified and reviewed.
        </p>
      </section>

      <section className="content-section">
        <div className="search-bar-premium">
          <input
            type="text"
            placeholder="Enter UK postcode (e.g., SW1A 1AA)"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="input-premium"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-premium">
            <option value="">All Types</option>
            <option value="funeral_director">Funeral Directors</option>
            <option value="florist">Florists</option>
            <option value="mason">Stonemasons</option>
            <option value="venue">Venues</option>
            <option value="caterer">Caterers</option>
          </select>
          <button onClick={searchSuppliers} className="btn-premium btn-premium-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="supplier-grid-premium">
          {suppliers.length === 0 && !loading && (
            <div className="empty-state-premium">
              <p>Enter a postcode to find local suppliers</p>
            </div>
          )}

          {suppliers.map(supplier => (
            <div key={supplier.id} className="supplier-card-premium">
              <div className="supplier-badge-premium">{supplier.verified ? '✓ Verified' : 'Unverified'}</div>
              <h3>{supplier.name}</h3>
              <p className="supplier-type-premium">{supplier.type.replace('_', ' ')}</p>
              <p className="supplier-address-premium">{supplier.address}</p>
              <div className="supplier-rating-premium">
                ⭐ {supplier.rating.toFixed(1)} ({supplier.review_count} reviews)
              </div>
              <button className="btn-premium btn-premium-secondary" style={{marginTop: '16px', width: '100%'}}>
                Request Quote
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ==================== MEMORIAL ====================
function Memorial() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="page-premium">
      <section className="hero-premium" style={{minHeight: '60vh'}}>
        <h1 className="hero-title-premium">
          Lasting
          <span className="accent">Tribute</span>
        </h1>
        <p className="hero-subtitle-premium">
          Free memorial pages with photos, stories, and charity donations
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">Create Memorial</h2>
        
        <div className="form-premium">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-premium"
            style={{width: '100%', marginBottom: '20px'}}
          />
          <textarea
            placeholder="Write your tribute..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-premium"
            rows="6"
            style={{width: '100%', marginBottom: '20px', resize: 'vertical'}}
          />
          <button className="btn-premium btn-premium-primary">
            Create Memorial Page
          </button>
        </div>

        <div className="memorial-features-premium">
          <div className="memorial-feature-card-premium">
            <h3>📸 Photo Gallery</h3>
            <p>Upload unlimited photos to celebrate their life</p>
          </div>
          <div className="memorial-feature-card-premium">
            <h3>💬 Condolences</h3>
            <p>Friends and family can share memories</p>
          </div>
          <div className="memorial-feature-card-premium">
            <h3>💝 Charity Donations</h3>
            <p>Accept donations in their memory</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ==================== CONCIERGE ====================
function Concierge() {
  const [stage, setStage] = useState('overview')
  const [loaData, setLoaData] = useState({
    executorName: '', executorAddress: '', deceasedName: '',
    deceasedAddress: '', deathDate: '', relationship: ''
  })

  const downloadLOA = async () => {
    try {
      const API = process.env.REACT_APP_BACKEND_URL 
        ? `${process.env.REACT_APP_BACKEND_URL}/api`
        : 'http://localhost:8001/api'
      const response = await axios.post(`${API}/loa`, loaData, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'letter_of_authority.docx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('LOA generation failed:', e)
      alert('Failed to generate Letter of Authority.')
    }
  }

  const startCheckout = async () => {
    try {
      const API = process.env.REACT_APP_BACKEND_URL 
        ? `${process.env.REACT_APP_BACKEND_URL}/api`
        : 'http://localhost:8001/api'
      const originUrl = window.location.origin
      const { data } = await axios.post(`${API}/payments/checkout/session`, {
        package_id: 'concierge',
        origin_url: originUrl,
        metadata: { service: 'concierge', executor: loaData.executorName }
      })
      window.location.href = data.url
    } catch (e) {
      console.error('Checkout error:', e)
      alert('Failed to start checkout.')
    }
  }

  return (
    <div className="page-premium">
      <section className="hero-premium" style={{minHeight: '80vh'}}>
        <h1 className="hero-title-premium">
          Concierge
          <span className="accent">Service</span>
        </h1>
        <p className="hero-subtitle-premium" style={{maxWidth: '700px'}}>
          When grief makes decisions feel impossible, we handle everything. Phone calls, paperwork, coordination—so you can focus on what truly matters.
        </p>
        
        <div className="hero-stats-premium">
          <div className="stat-premium">
            <div className="stat-number-premium">£1,000</div>
            <div className="stat-label-premium">Fixed Fee</div>
          </div>
          <div className="stat-premium">
            <div className="stat-number-premium">50+</div>
            <div className="stat-label-premium">Tasks Handled</div>
          </div>
          <div className="stat-premium">
            <div className="stat-number-premium">3-6</div>
            <div className="stat-label-premium">Months Saved</div>
          </div>
        </div>
        
        <div className="hero-actions" style={{marginTop: '64px'}}>
          <button className="btn-premium btn-premium-primary" onClick={() => setStage('payment')}>
            Get Started
          </button>
          <button className="btn-premium btn-premium-secondary" onClick={() => setStage('loa')}>
            Generate Letter
          </button>
        </div>
      </section>

      {stage === 'overview' && (
        <>
          <section className="content-section">
            <h2 className="section-title">What We Handle</h2>
            
            <div className="services-premium-grid">
              <div className="service-premium-card">
                <h3>Death Registration</h3>
                <p>Book and attend registrar appointments, obtain death certificates</p>
              </div>
              <div className="service-premium-card">
                <h3>Government Notifications</h3>
                <p>Tell Us Once service for DWP, HMRC, DVLA, Passport Office</p>
              </div>
              <div className="service-premium-card">
                <h3>Organization Contact</h3>
                <p>Notify banks, utilities, insurance, pension providers, subscriptions</p>
              </div>
              <div className="service-premium-card">
                <h3>Funeral Coordination</h3>
                <p>Arrange director, venue, flowers, catering, order of service</p>
              </div>
              <div className="service-premium-card">
                <h3>Probate Support</h3>
                <p>Guide through probate, gather documents, liaise with solicitors</p>
              </div>
              <div className="service-premium-card">
                <h3>Account Closures</h3>
                <p>Close accounts, transfer utilities, cancel memberships</p>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-premium">
              <div className="step-premium">
                <div className="step-number-premium">01</div>
                <h3>Initial Consultation</h3>
                <p>We understand your situation and what you need</p>
              </div>
              <div className="step-premium">
                <div className="step-number-premium">02</div>
                <h3>We Take Over</h3>
                <p>Handle all calls, paperwork, and coordination</p>
              </div>
              <div className="step-premium">
                <div className="step-number-premium">03</div>
                <h3>Regular Updates</h3>
                <p>Keep you informed every step of the way</p>
              </div>
            </div>
          </section>
        </>
      )}

      {stage === 'loa' && (
        <section className="content-section">
          <h2 className="section-title">Letter of Authority</h2>
          <p className="section-subtitle">Generate your Letter of Authority to authorize us to act on your behalf</p>
          
          <div className="form-premium">
            <div className="form-row-premium">
              <input
                type="text"
                placeholder="Your Full Name"
                className="input-premium"
                value={loaData.executorName}
                onChange={(e) => setLoaData({...loaData, executorName: e.target.value})}
              />
              <input
                type="text"
                placeholder="Your Address"
                className="input-premium"
                value={loaData.executorAddress}
                onChange={(e) => setLoaData({...loaData, executorAddress: e.target.value})}
              />
            </div>
            <div className="form-row-premium">
              <input
                type="text"
                placeholder="Deceased Full Name"
                className="input-premium"
                value={loaData.deceasedName}
                onChange={(e) => setLoaData({...loaData, deceasedName: e.target.value})}
              />
              <input
                type="text"
                placeholder="Deceased Address"
                className="input-premium"
                value={loaData.deceasedAddress}
                onChange={(e) => setLoaData({...loaData, deceasedAddress: e.target.value})}
              />
            </div>
            <div className="form-row-premium">
              <input
                type="date"
                placeholder="Date of Death"
                className="input-premium"
                value={loaData.deathDate}
                onChange={(e) => setLoaData({...loaData, deathDate: e.target.value})}
              />
              <input
                type="text"
                placeholder="Your Relationship"
                className="input-premium"
                value={loaData.relationship}
                onChange={(e) => setLoaData({...loaData, relationship: e.target.value})}
              />
            </div>
            <div style={{display: 'flex', gap: '16px', marginTop: '32px'}}>
              <button className="btn-premium btn-premium-primary" onClick={downloadLOA}>
                Download Letter
              </button>
              <button className="btn-premium btn-premium-secondary" onClick={() => setStage('overview')}>
                Back
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === 'payment' && (
        <section className="content-section">
          <h2 className="section-title">Get Started</h2>
          
          <div className="payment-premium-card">
            <h3>Concierge Service</h3>
            <div className="price-premium">£1,000</div>
            <p style={{fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px'}}>
              Fixed fee. Complete peace of mind. Often repaid through our savings.
            </p>
            <button className="btn-premium btn-premium-primary" style={{width: '100%'}} onClick={startCheckout}>
              Proceed to Payment
            </button>
            <button className="btn-premium btn-premium-secondary" style={{width: '100%', marginTop: '16px'}} onClick={() => setStage('overview')}>
              Back
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

// ==================== ABOUT ====================
function About() {
  return (
    <div className="page-premium">
      <section className="content-section" style={{paddingTop: '100px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 64px)', 
          fontWeight: 700, 
          color: '#FFFFFF', 
          textAlign: 'center', 
          marginBottom: '32px',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.12) 0%, rgba(70, 130, 180, 0.12) 100%)',
          padding: '32px 40px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.25)'
        }}>About AfterLife</h1>
        <p style={{
          fontSize: 'clamp(18px, 2vw, 24px)', 
          color: '#FFFFFF', 
          textAlign: 'center', 
          marginBottom: '60px',
          fontWeight: 500,
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '20px 32px',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          Compassionate guidance and intelligent support when you need it most
        </p>

        {/* Who We Are */}
        <div style={{
          marginBottom: '60px', 
          textAlign: 'left',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', 
            fontWeight: 700, 
            color: '#FFFFFF', 
            marginBottom: '24px'
          }}>Who We Are</h2>
          <p style={{
            fontSize: '18px', 
            color: '#FFFFFF', 
            marginBottom: '20px', 
            lineHeight: '1.8',
            fontWeight: 500
          }}>
            AfterLife was born from a simple but profound realisation: the moment someone dies shouldn't 
            be followed by confusion, overwhelm, and an impossible administrative maze. We exist to change that.
          </p>
          <p style={{
            fontSize: '18px', 
            color: '#FFFFFF', 
            marginBottom: '30px', 
            lineHeight: '1.8',
            fontWeight: 500
          }}>
            We're a team of technologists, bereavement specialists, and compassionate humans who understand 
            that grief is hard enough without the added burden of not knowing what to do next. We've combined 
            cutting-edge AI technology with deep expertise in end-of-life procedures to create something that 
            has never existed before—a truly intelligent, personalised guide through one of life's most 
            difficult experiences.
          </p>
          
          <div style={{
            background: 'rgba(135, 206, 235, 0.1)',
            border: '1px solid rgba(135, 206, 235, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <p style={{fontSize: '20px', fontStyle: 'italic', color: '#FFFFFF', margin: 0, fontWeight: 500}}>
              "We believe that everyone deserves clarity, support, and dignity when navigating loss. 
              No one should feel lost in the system during their most vulnerable moments."
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div style={{
          marginBottom: '60px', 
          textAlign: 'left',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', 
            fontWeight: 700, 
            color: '#FFFFFF', 
            marginBottom: '24px'
          }}>What Makes Us Different</h2>
          <p style={{
            fontSize: '18px', 
            color: '#FFFFFF', 
            marginBottom: '30px', 
            lineHeight: '1.8',
            fontWeight: 500
          }}>
            Traditional bereavement resources are static—long documents, generic checklists, and one-size-fits-all 
            advice. But every death is different. Every family is different. Every situation requires a 
            different path.
          </p>
          
          <h3 style={{fontSize: '24px', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Intelligent, Interactive Guidance
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            Our platform doesn't just give you information—it walks with you. From the first hour after death 
            through probate completion, AfterLife asks the right questions at the right time, adapting to your 
            specific circumstances: religion, location, type of death, family structure, and dozens of other factors 
            that determine what you actually need to do.
          </p>

          <h3 style={{fontSize: '24px', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Comprehensive Yet Compassionate
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            We cover everything: medical certification, religious requirements, death registration, funeral planning, 
            probate, estate administration, and beyond. But we never overwhelm you. We show you only what matters 
            now, saving complex tasks for when you're ready. Our system understands the difference between "urgent" 
            and "feels urgent"—helping you prioritise what genuinely matters.
          </p>

          <h3 style={{fontSize: '24px', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Real-World Practical Tools
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            We generate the documents you need. We calculate the costs you'll face. We connect you with verified 
            professionals. We track your progress so you never lose your place. We translate legal complexity 
            into clear, actionable steps.
          </p>

          <h3 style={{fontSize: '24px', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Always Available Concierge Support
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500, marginBottom: '20px'}}>
            Sometimes, technology isn't enough. When you're overwhelmed, confused, or simply need a human voice, 
            our concierge service provides personalised support. We can take tasks off your plate, answer complex 
            questions, and guide you through decisions that feel impossible to make alone.
          </p>
        </div>

        {/* Our Core Values */}
        <div style={{
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 className="section-title" style={{fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '40px'}}>Our Core Values</h2>
          <div className="feature-grid-premium">
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>Compassion First</h3>
              <p>
                We understand that you're reading this during one of the hardest times of your life. 
                Every feature, every word, every interaction is designed with empathy and respect for 
                what you're experiencing.
              </p>
            </div>
            
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>Radical Clarity</h3>
              <p>
                Grief is confusing enough. We eliminate ambiguity. Our guidance is specific, actionable, 
                and honest about what matters now versus what can wait. No jargon. No assumptions. 
                Just clear direction.
              </p>
            </div>
            
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>Cultural Respect</h3>
              <p>
                Death rituals and requirements vary enormously across religions and cultures. We honour 
                that diversity. Whether you're Muslim, Jewish, Hindu, Sikh, Christian, secular, or anything 
                else, our platform adapts to your needs and traditions.
              </p>
            </div>
            
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>Privacy & Security</h3>
              <p>
                You're sharing sensitive information about your loved one and your family. We treat that 
                with the utmost care. Your data is encrypted, secure, and never shared without your 
                explicit permission.
              </p>
            </div>
            
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>Evidence-Based Expertise</h3>
              <p>
                Our guidance is grounded in actual UK law, current regulations, and real-world procedures. 
                We work with legal experts, funeral professionals, and government bodies to ensure our 
                information is accurate and up-to-date.
              </p>
            </div>
            
            <div className="feature-card-premium">
              <h3 style={{color: '#87ceeb', marginBottom: '12px'}}>No Wrong Door</h3>
              <p>
                Whether you find us in the first hour after death or six months into probate, we meet 
                you where you are. Our platform assesses your current situation and guides you forward 
                from there—no judgement, no prerequisites.
              </p>
            </div>
          </div>
        </div>

        {/* The Problem We're Solving */}
        <div style={{
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px 50px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 style={{fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '24px', fontWeight: 700, color: '#FFFFFF'}}>The Problem We're Solving</h2>
          <p style={{marginBottom: '20px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            Every year in the UK, over 600,000 people die. Behind each death are bereaved families facing an 
            overwhelming labyrinth of legal, administrative, financial, and practical tasks—all whilst processing 
            profound grief.
          </p>
          <p style={{marginBottom: '20px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            The current system assumes you know what to do. It assumes you understand the difference between a 
            Medical Examiner and a Coroner. It assumes you know which deadline is real and which is flexible. 
            It assumes you can navigate probate law, inheritance tax calculations, and estate administration 
            whilst emotionally devastated.
          </p>
          <p style={{marginBottom: '20px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            That assumption is wrong. And it's cruel.
          </p>
          <p style={{marginBottom: '30px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            Most people have never dealt with death before. They don't know where to start. They don't know 
            what's urgent and what can wait. They don't know if they're doing it right. They're terrified of 
            making mistakes that will have legal or financial consequences.
          </p>
          
          <div style={{
            background: 'rgba(135, 206, 235, 0.1)',
            border: '1px solid rgba(135, 206, 235, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <p style={{fontSize: '1.15rem', fontStyle: 'italic', color: '#FFFFFF', margin: 0}}>
              We built AfterLife because no one should have to figure this out alone. No one should feel 
              lost in the system when they're already lost in grief.
            </p>
          </div>
        </div>

        {/* How We Build Trust */}
        <div style={{
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px 50px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 style={{fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '24px', fontWeight: 700, color: '#FFFFFF'}}>How We Build Trust</h2>
          
          <h3 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Transparency in Technology
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500, marginBottom: '20px'}}>
            We use AI to power our platform, but we're clear about what that means. Our AI guides you through 
            decision trees, generates personalised timelines, and helps you understand complex procedures. 
            But for legal and financial advice, we always recommend consulting qualified professionals—and we 
            help you find them.
          </p>

          <h3 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Verified Professional Network
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500, marginBottom: '20px'}}>
            Every funeral director, solicitor, and specialist we recommend is vetted. We check credentials, 
            read reviews, and verify that they understand the sensitive nature of bereavement work. We never 
            take referral fees that might compromise our recommendations.
          </p>

          <h3 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Real Testimonials, Real Impact
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500, marginBottom: '20px'}}>
            We measure our success not in metrics but in moments—the single mother who navigated her husband's 
            death without feeling overwhelmed. The son who honoured his Muslim father's burial requirements 
            within 24 hours despite coroner involvement. The daughter who completed probate without hiring 
            expensive solicitors because our guidance was clear enough to follow.
          </p>

          <h3 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: '#87ceeb', fontWeight: 600}}>
            Continuous Improvement
          </h3>
          <p style={{fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500, marginBottom: '20px'}}>
            Laws change. Procedures evolve. We stay current. Our content is reviewed quarterly by legal and 
            bereavement experts. When regulations change, our platform updates immediately. When users tell 
            us something wasn't clear, we rewrite it.
          </p>
        </div>

        {/* Our Commitment to You */}
        <div style={{
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.08) 0%, rgba(70, 130, 180, 0.08) 100%)',
          padding: '40px 50px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135, 206, 235, 0.2)'
        }}>
          <h2 style={{fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '24px', fontWeight: 700, color: '#FFFFFF'}}>Our Commitment to You</h2>
          <p style={{marginBottom: '20px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
            If you're here, you're probably dealing with something impossibly hard. We want you to know:
          </p>
          <div style={{marginLeft: '20px'}}>
            <p style={{marginBottom: '15px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
              <strong style={{color: '#87ceeb'}}>You are not alone.</strong> Thousands of people use AfterLife every month, and every single 
              one of them felt as overwhelmed as you might feel right now. That feeling is normal. It doesn't 
              mean you're failing.
            </p>
            <p style={{marginBottom: '15px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
              <strong style={{color: '#87ceeb'}}>You don't have to do everything at once.</strong> Our platform will help you distinguish 
              between genuine deadlines and things that just feel urgent. We'll show you what needs your attention 
              today and what can wait until you have more capacity.
            </p>
            <p style={{marginBottom: '15px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
              <strong style={{color: '#87ceeb'}}>You don't have to understand everything.</strong> Legal and administrative systems are 
              intentionally complex. It's not your fault if you don't know what "Letters of Administration" means 
              or how Inheritance Tax works. That's exactly why we exist—to translate complexity into clarity.
            </p>
            <p style={{marginBottom: '15px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
              <strong style={{color: '#87ceeb'}}>You can delegate.</strong> If you reach a point where you're overwhelmed, our concierge 
              service can take tasks off your plate. Sometimes the kindest thing you can do for yourself is ask 
              for help.
            </p>
            <p style={{marginBottom: '15px', fontSize: '18px', color: '#FFFFFF', lineHeight: '1.8', fontWeight: 500}}>
              <strong style={{color: '#87ceeb'}}>This will get easier.</strong> Not the grief—that takes its own time. But the administrative 
              burden will lighten. The confusion will clear. You will get through this. We'll be here every step 
              of the way.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(70, 130, 180, 0.15) 100%)',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          marginTop: '60px',
          border: '2px solid rgba(135, 206, 235, 0.4)',
          backdropFilter: 'blur(12px)'
        }}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '20px', color: '#FFFFFF'}}>Ready to Begin?</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '30px', color: '#FFFFFF'}}>
            Let us guide you through this. One question at a time. One step at a time.<br />
            We're here whenever you need us.
          </p>
          <button 
            className="btn-premium-primary"
            onClick={() => window.location.hash = '#/ai-guide'}
            style={{
              padding: '16px 48px',
              fontSize: '18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  )
}

// ==================== PAYMENT STATUS ====================
function PaymentSuccess() {
  const [status, setStatus] = useState('checking')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    
    if (sessionId) {
      pollPaymentStatus(sessionId)
    }
  }, [])

  const pollPaymentStatus = async (sessionId, currentAttempt = 0) => {
    if (currentAttempt >= 5) {
      setStatus('timeout')
      return
    }

    try {
      const { data } = await axios.get(`${API}/payments/checkout/status/${sessionId}`)
      
      if (data.payment_status === 'paid') {
        setStatus('success')
      } else if (data.status === 'expired') {
        setStatus('expired')
      } else {
        setTimeout(() => pollPaymentStatus(sessionId, currentAttempt + 1), 2000)
        setAttempts(currentAttempt + 1)
      }
    } catch (e) {
      console.error('Status check failed:', e)
      setStatus('error')
    }
  }

  return (
    <div className="payment-status-page">
      {status === 'checking' && (
        <div className="status-card">
          <div className="spinner"></div>
          <h2>Confirming Payment...</h2>
          <p>Please wait while we verify your payment (Attempt {attempts + 1}/5)</p>
        </div>
      )}
      {status === 'success' && (
        <div className="status-card success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Thank you. We'll be in touch shortly.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="status-card error">
          <h2>Payment Error</h2>
          <p>Please contact support.</p>
        </div>
      )}
    </div>
  )
}

function PaymentCancelled() {
  return (
    <div className="payment-status-page">
      <div className="status-card">
        <h2>Payment Cancelled</h2>
        <p>Your payment was not completed. You can try again anytime.</p>
      </div>
    </div>
  )
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer>
      <p>© 2025 AfterLife · Compassionate Support Through Bereavement</p>
    </footer>
  )
}

export default App
