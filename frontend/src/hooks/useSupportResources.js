import { useState, useEffect } from 'react';
import { supportResourcesApi } from '../services/api';

export const useSupportResources = (category = null, type = null) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await supportResourcesApi.getAll(category, type);
        setResources(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch support resources');
        console.error('Error fetching support resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [category, type]);

  return { resources, loading, error };
};

export const useSupportResourcesByCategory = () => {
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await supportResourcesApi.getAll();
        setAllResources(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch support resources');
        console.error('Error fetching support resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  // Group resources by category
  const resourcesByCategory = allResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return { 
    resourcesByCategory, 
    allResources, 
    loading, 
    error 
  };
};