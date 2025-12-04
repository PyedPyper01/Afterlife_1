import { useState, useEffect } from 'react';
import { guidanceDataApi } from '../services/api';

export const useGuidanceData = (category, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let result;
        if (category) {
          result = await guidanceDataApi.getByCategory(category, filters);
        } else {
          result = await guidanceDataApi.getAll(filters);
        }
        
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch guidance data');
        console.error('Error fetching guidance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, JSON.stringify(filters)]);

  return { data, loading, error };
};

export const useImmediateTasks = (location) => {
  const { data, loading, error } = useGuidanceData('immediate_tasks', { location });
  
  return {
    tasks: data && data.length > 0 ? data[0].data : null,
    loading,
    error
  };
};

export const useFuneralPlanning = (religion) => {
  const { data, loading, error } = useGuidanceData('funeral_planning', { religion });
  
  return {
    planningInfo: data && data.length > 0 ? data[0].data : null,
    loading,
    error
  };
};

export const useBudgetGuide = (budget) => {
  const { data, loading, error } = useGuidanceData('budget_guide', { budget });
  
  return {
    budgetInfo: data && data.length > 0 ? data[0].data : null,
    loading,
    error
  };
};