import { useState, useEffect } from 'react';
import { stepProgressApi } from '../services/api';
import { useSession } from '../context/SessionContext';

export const useStepProgress = (stepId) => {
  const { session } = useSession();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProgress = async (stepData) => {
    if (!session) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const progressData = {
        session_id: session.id,
        step_id: stepId,
        step_name: stepId,
        completed_tasks: stepData.completedTasks || {},
        step_data: stepData
      };
      
      const result = await stepProgressApi.create(progressData);
      setProgress(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to save progress');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updateData) => {
    if (!session || !stepId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await stepProgressApi.update(session.id, stepId, updateData);
      setProgress(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update progress');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load existing progress when session or stepId changes
  useEffect(() => {
    const loadProgress = async () => {
      if (!session) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const allProgress = await stepProgressApi.getBySession(session.id);
        const stepProgress = allProgress.find(p => p.step_id === stepId);
        setProgress(stepProgress || null);
      } catch (err) {
        setError(err.message || 'Failed to load progress');
        console.error('Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session && stepId) {
      loadProgress();
    }
  }, [session, stepId]);

  return {
    progress,
    loading,
    error,
    saveProgress,
    updateProgress
  };
};