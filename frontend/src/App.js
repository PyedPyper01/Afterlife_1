import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import WhenSomeoneGuide from './components/WhenSomeoneGuide';
import { Toaster } from './components/ui/toaster';
import { SessionProvider } from './context/SessionContext';

function App() {
  return (
    <div className="App">
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WhenSomeoneGuide />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </SessionProvider>
    </div>
  );
}

export default App;