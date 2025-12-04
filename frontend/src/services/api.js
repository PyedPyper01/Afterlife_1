import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// User Session API
export const sessionApi = {
  create: async (sessionData) => {
    const response = await apiClient.post('/sessions', sessionData);
    return response.data;
  },
  
  get: async (sessionId) => {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
  },
  
  update: async (sessionId, updateData) => {
    const response = await apiClient.put(`/sessions/${sessionId}`, updateData);
    return response.data;
  }
};

// Assessment API
export const assessmentApi = {
  create: async (assessmentData) => {
    const response = await apiClient.post('/assessments', assessmentData);
    return response.data;
  },
  
  getBySession: async (sessionId) => {
    const response = await apiClient.get(`/assessments/${sessionId}`);
    return response.data;
  }
};

// Step Progress API
export const stepProgressApi = {
  create: async (progressData) => {
    const response = await apiClient.post('/step-progress', progressData);
    return response.data;
  },
  
  getBySession: async (sessionId) => {
    const response = await apiClient.get(`/step-progress/${sessionId}`);
    return response.data;
  },
  
  update: async (sessionId, stepId, updateData) => {
    const response = await apiClient.put(`/step-progress/${sessionId}/${stepId}`, updateData);
    return response.data;
  }
};

// Support Resources API
export const supportResourcesApi = {
  getAll: async (category = null, type = null) => {
    const params = {};
    if (category) params.category = category;
    if (type) params.type = type;
    
    const response = await apiClient.get('/support-resources', { params });
    return response.data;
  }
};

// Guidance Data API
export const guidanceDataApi = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/guidance-data', { params: filters });
    return response.data;
  },
  
  getByCategory: async (category, filters = {}) => {
    const response = await apiClient.get(`/guidance-data/${category}`, { params: filters });
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;