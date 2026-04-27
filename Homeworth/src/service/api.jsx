import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Update this to your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      // If /health doesn't exist, try a simple GET to base URL
      const response = await api.get('/');
      return { status: 'ok' };
    }
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await api.get('/properties');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await api.get(`/properties/user/${userId}`);
    return response.data;
  },

  create: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  update: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getAll: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recommendations/${id}`);
    return response.data;
  },

  create: async (recommendationData) => {
    const response = await api.post('/recommendations', recommendationData);
    return response.data;
  },

  update: async (id, recommendationData) => {
    const response = await api.put(`/recommendations/${id}`, recommendationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recommendations/${id}`);
    return response.data;
  },
};

export default api;
