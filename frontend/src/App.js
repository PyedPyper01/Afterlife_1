import React from 'react';
import { SessionProvider } from './context/SessionContext';
import WhenSomeoneGuide from './components/WhenSomeoneGuide';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <div className="App">
        <WhenSomeoneGuide />
      </div>
    </SessionProvider>
  );
}

export default App;
