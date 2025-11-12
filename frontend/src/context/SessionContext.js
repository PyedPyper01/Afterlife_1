import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionApi } from '../services/api';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSession = async (initialData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionData = {
        current_step: 0,
        user_responses: initialData
      };
      
      const newSession = await sessionApi.create(sessionData);
      setSession(newSession);
      
      // Store session ID in localStorage for persistence
      localStorage.setItem('whenSomeonesDies_sessionId', newSession.id);
      
      return newSession;
    } catch (err) {
      setError(err.message || 'Failed to create session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (updateData) => {
    if (!session) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedSession = await sessionApi.update(session.id, updateData);
      setSession(updatedSession);
      return updatedSession;
    } catch (err) {
      setError(err.message || 'Failed to update session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const existingSession = await sessionApi.get(sessionId);
      setSession(existingSession);
      return existingSession;
    } catch (err) {
      setError(err.message || 'Failed to load session');
      // Clear invalid session ID from localStorage
      localStorage.removeItem('whenSomeonesDies_sessionId');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    setSession(null);
    setError(null);
    localStorage.removeItem('whenSomeonesDies_sessionId');
  };

  // Try to restore session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('whenSomeonesDies_sessionId');
    if (savedSessionId) {
      loadSession(savedSessionId).catch(() => {
        // If loading fails, just clear the invalid session
        clearSession();
      });
    }
  }, []);

  const value = {
    session,
    loading,
    error,
    createSession,
    updateSession,
    loadSession,
    clearSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};