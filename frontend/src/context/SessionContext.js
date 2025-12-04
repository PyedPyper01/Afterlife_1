import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

const API_BASE = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('session_id');
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  const createSession = async () => {
    try {
      const response = await axios.post(`${API_BASE}/sessions`, {
        current_step: 0,
        user_responses: {}
      });
      const newSessionId = response.data.id;
      setSessionId(newSessionId);
      localStorage.setItem('session_id', newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <SessionContext.Provider value={{ sessionId, createSession }}>
      {children}
    </SessionContext.Provider>
  );
}
