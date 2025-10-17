import axios from 'axios';

// Remove /api prefix since your backend doesn't use it
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Clean error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url || 'Unknown URL',
      method: error.config?.method?.toUpperCase() || 'Unknown Method',
      status: error.response?.status || 'No Status',
      message: error.message,
      baseURL: error.config?.baseURL || 'No Base URL',
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
    };

    // Don't spam console for known missing endpoints
    if (error.response?.status === 404 && error.config?.url?.includes('/analytics/')) {
      console.warn(`⚠️ Analytics endpoint not implemented: ${errorInfo.fullURL}`);
    } else {
      console.error('❌ API Response Error:', errorInfo);
    }
    
    return Promise.reject(error);
  }
);

export default api;