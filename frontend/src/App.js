import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Marketplace state
  const [postcode, setPostcode] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // Journey state
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // AI Chat handler
  const sendChatMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { role: 'user', content: userInput };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, history: chatMessages })
      });
      
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Marketplace search handler
  const searchSuppliers = async () => {
    if (!postcode.trim()) return;
    setSearching(true);
    
    try {
      const url = `${API_URL}/api/suppliers/search?postcode=${encodeURIComponent(postcode)}`;
      console.log('Searching:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Search response:', data);
      
      if (data.suppliers && data.suppliers.length > 0) {
        setSuppliers(data.suppliers);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuppliers([]);
    } finally {
      setSearching(false);
    }
  };

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AfterLife
            </h1>
            <p className="text-2xl text-gray-600 mb-2">Compassionate guidance through bereavement</p>
            <p className="text-lg text-gray-500">Complete platform with AI guidance, marketplace, and memorial pages</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div 
              onClick={() => setCurrentPage('journey')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-purple-200"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI Guidance</h3>
              <p className="text-gray-600">Step-by-step questions</p>
            </div>

            <div 
              onClick={() => setCurrentPage('marketplace')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-blue-200"
            >
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold mb-3">Marketplace</h3>
              <p className="text-gray-600">Find verified funeral directors & more</p>
            </div>

            <div 
              onClick={() => setCurrentPage('memorial')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-violet-200"
            >
              <div className="text-4xl mb-4">💐</div>
              <h3 className="text-2xl font-bold mb-3">Memorial Pages</h3>
              <p className="text-gray-600">Create free tribute pages</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-8">
            <p className="text-amber-900">
              <strong>In Crisis?</strong> Contact Samaritans at <strong>116 123</strong> (24/7)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('journey')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg"
            >
              Start Guided Journey
            </button>
            <button 
              onClick={() => setCurrentPage('chat')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Chat with AI Assistant
            </button>
            <button 
              onClick={() => setCurrentPage('documents')}
              className="bg-white border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-md"
            >
              Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AI Chat Page
  if (currentPage === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-3xl font-bold mb-2">AI Assistant</h2>
            <p className="text-gray-600">Ask me anything about bereavement, legal steps, or finding services</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="mb-6">Start a conversation by typing a message below</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setUserInput("What do I need to do first?")}
                      className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      What do I need to do first?
                    </button>
                    <button 
                      onClick={() => setUserInput("How do I register a death?")}
                      className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      How do I register a death?
                    </button>
                    <button 
                      onClick={() => setUserInput("Find me a funeral director")}
                      className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      Find me a funeral director
                    </button>
                    <button 
                      onClick={() => setUserInput("What is probate?")}
                      className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      What is probate?
                    </button>
                  </div>
                </div>
              )}

              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-purple-100 ml-auto max-w-[80%]' 
                      : 'bg-gray-100 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}

              {loading && (
                <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
              />
              <button 
                onClick={sendChatMessage}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Marketplace Page
  if (currentPage === 'marketplace') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Marketplace</h2>
            <p className="text-gray-600 mb-6">Find verified funeral directors, florists, and other services near you</p>

            <div className="flex gap-4">
              <input 
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter your postcode (e.g., SW1A 1AA)"
                className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none text-lg"
              />
              <button 
                onClick={searchSuppliers}
                disabled={searching}
                className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {suppliers.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {suppliers.map((supplier, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{supplier.name}</h3>
                    {supplier.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{supplier.type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-gray-500 mb-3">{supplier.address}</p>
                  {supplier.phone && (
                    <p className="text-purple-600 font-semibold">📞 {supplier.phone}</p>
                  )}
                  {supplier.distance_miles !== undefined && (
                    <p className="text-sm text-gray-500 mt-2">📍 {supplier.distance_miles} miles away</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {suppliers.length === 0 && postcode && !searching && (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-600">No suppliers found. Try searching for a UK postcode.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Memorial Page
  if (currentPage === 'memorial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Create Memorial Page</h2>
            <p className="text-gray-600 mb-8">Create a beautiful, permanent tribute page</p>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Name of Deceased *</label>
                <input type="text" placeholder="Full name" className="w-full p-3 border-2 rounded-lg" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Date of Birth</label>
                  <input type="date" className="w-full p-3 border-2 rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Date of Death</label>
                  <input type="date" className="w-full p-3 border-2 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Biography</label>
                <textarea 
                  placeholder="Share their story..."
                  className="w-full p-3 border-2 rounded-lg h-32"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2">Upload Photos</label>
                <input type="file" multiple accept="image/*" className="w-full p-3 border-2 rounded-lg" />
              </div>

              <button className="w-full bg-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-purple-700">
                Create Memorial Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Documents Page
  if (currentPage === 'documents') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Document Vault</h2>
            <p className="text-gray-600 mb-8">Securely store important documents</p>

            <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold mb-3">Upload a Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Document Type</label>
                  <select className="w-full p-3 border-2 rounded-lg">
                    <option>Death Certificate</option>
                    <option>Will</option>
                    <option>Insurance Documents</option>
                    <option>Bank Statements</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Choose File</label>
                  <input type="file" className="w-full p-3 border-2 rounded-lg" />
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                  Upload Document
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-xl">Your Documents</h3>
              <div className="text-center text-gray-500 py-8">
                <p>No documents uploaded yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guided Journey Page
  if (currentPage === 'journey') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              {[1,2,3,4,5].map(num => (
                <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200'
                }`}>
                  {num}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                style={{width: `${(step / totalSteps) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step {step} of {totalSteps}</h2>
            
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Where did the death occur?</h3>
                <div className="space-y-2">
                  {['At home', 'Hospital', 'Care home', 'Hospice', 'Public place', 'Other'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => setStep(2)}
                      className="w-full p-4 text-left border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your relationship to the deceased?</h3>
                <div className="space-y-2">
                  {['Spouse/Partner', 'Child', 'Parent', 'Sibling', 'Friend', 'Other'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => setStep(3)}
                      className="w-full p-4 text-left border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Religious/cultural preferences?</h3>
                <div className="space-y-2">
                  {['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Secular/None', 'Other'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => setStep(4)}
                      className="w-full p-4 text-left border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Budget considerations?</h3>
                <div className="space-y-2">
                  {['Low (under £2,000)', 'Medium (£2,000-£4,000)', 'High (£4,000-£7,000)', 'Premium (over £7,000)', 'Unsure'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => setStep(5)}
                      className="w-full p-4 text-left border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Your Personalized Guidance</h3>
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <h4 className="font-bold mb-3 text-lg">Immediate Actions</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Register the death within 5 days (England/Wales)</li>
                    <li>• Contact a funeral director</li>
                    <li>• Notify close family and friends</li>
                    <li>• Secure the deceased's property</li>
                    <li>• Locate the Will (if one exists)</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setCurrentPage('marketplace')}
                  className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700"
                >
                  View Marketplace for Services
                </button>
                <button 
                  onClick={() => setCurrentPage('chat')}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Chat with AI Assistant
                </button>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 border-2 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                ← Back
              </button>
              {step < totalSteps && (
                <button 
                  onClick={() => setStep(Math.min(totalSteps, step + 1))}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Skip →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
