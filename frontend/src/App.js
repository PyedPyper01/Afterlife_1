import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ answers: { jurisdiction: 'england-wales', religion: '', postcode: '' } });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const sendChatMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { role: 'user', content: userInput };
    const newMessages = [...chatMessages, newMessage];
    setChatMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput, 
          context: context,
          history: chatMessages 
        })
      });
      
      const data = await response.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-8 relative">
        <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
          <button onClick={() => alert('Crisis Support: Call 116 123 (Samaritans)')} className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-red-600 transition font-semibold">📞 Crisis Support</button>
          <button onClick={() => setCurrentPage('documents')} className="bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:bg-gray-50 transition font-semibold border-2">📄 Documents</button>
        </div>
        <button onClick={() => setCurrentPage('chat')} className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition z-50 w-16 h-16 flex items-center justify-center text-2xl">💬</button>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4"><div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl">❤️</div></div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-3" style={{color: '#7c3aed'}}>AfterLife</h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-2">Compassionate guidance through bereavement</p>
            <p className="text-base sm:text-lg text-gray-600">Complete platform with AI guidance, marketplace, and memorial pages</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div onClick={() => setCurrentPage('journey')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">💬</div>
              <h3 className="text-xl font-bold mb-2 text-center">AI Guidance</h3>
              <p className="text-gray-600 text-center text-sm">24/7 intelligent assistant</p>
            </div>
            <div onClick={() => setCurrentPage('marketplace')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">🛒</div>
              <h3 className="text-xl font-bold mb-2 text-center">Marketplace</h3>
              <p className="text-gray-600 text-center text-sm">Find verified suppliers</p>
            </div>
            <div onClick={() => setCurrentPage('memorial')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">❤️</div>
              <h3 className="text-xl font-bold mb-2 text-center">Memorial Pages</h3>
              <p className="text-gray-600 text-center text-sm">Create free tribute pages</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-8 text-center">
            <p className="text-yellow-900"><strong>In Crisis?</strong> Call <strong>116 123</strong> (Samaritans 24/7) or visit <a href="https://www.cruse.org.uk" className="underline">Cruse Bereavement</a></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button onClick={() => setCurrentPage('journey')} className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-md">Start Guided Journey</button>
            <button onClick={() => setCurrentPage('chat')} className="bg-white border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-md">Chat with AI Assistant</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setCurrentPage('home')} className="mb-6 text-purple-600 hover:text-purple-700 font-semibold text-lg">← Back</button>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-3xl font-bold mb-4">AI Assistant</h2>
            <p className="text-gray-600 mb-4">I can help with UK bereavement procedures, finding suppliers, and more</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input type="text" placeholder="Postcode (e.g., SW1A 1AA)" value={context.answers.postcode} onChange={(e) => setContext({...context, answers: {...context.answers, postcode: e.target.value}})} className="p-2 border rounded" />
              <select value={context.answers.jurisdiction} onChange={(e) => setContext({...context, answers: {...context.answers, jurisdiction: e.target.value}})} className="p-2 border rounded">
                <option value="england-wales">England/Wales</option>
                <option value="scotland">Scotland</option>
                <option value="northern-ireland">Northern Ireland</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="mb-6">Ask me anything!</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['What do I need to do first?', 'Find me a funeral director', 'How do I register a death?', 'Tell me about probate'].map(q => (
                      <button key={q} onClick={() => setUserInput(q)} className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 text-sm">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-purple-100 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {loading && <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]"><div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}</div></div>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Type your message..." className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none" />
              <button onClick={sendChatMessage} disabled={loading} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50">Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setCurrentPage('home')} className="mb-6 text-purple-600 font-semibold">← Back</button>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
          <p className="text-gray-600">Page content for {currentPage}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
