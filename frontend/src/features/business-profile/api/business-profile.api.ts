import axios from 'axios';

// Custom API Error type
class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Debug flag for development
const DEBUG = process.env.NODE_ENV === 'development';

// Get auth token from localStorage or return a mock token for development
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    
    // For development, return a mock token or get from Clerk session storage
    const clerkToken = localStorage.getItem('__clerk_db_jwt');
    if (clerkToken) return clerkToken;

    // Alternatively, you might want to get it from a cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    return authCookie ? authCookie.split('=')[1].trim() : null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
  },
  validateStatus: (status: number) => {
    return status >= 200 && status < 500;
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (DEBUG) {
      console.log('Request config:', { 
        url: config.url, 
        method: config.method, 
        hasToken: !!token,
        tokenLength: token?.length 
      });
    }
    
    // Only add token if it's not HTML content
    if (token && config.headers && !token.includes('<!DOCTYPE')) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token?.includes('<!DOCTYPE')) {
      console.error('Invalid token detected (HTML content), skipping authorization');
      // For development, we can skip auth or use a mock token
      if (DEBUG) {
        config.headers.Authorization = `Bearer mock_token_for_dev`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors and improve error reporting
api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log('API Response:', { 
        status: response.status, 
        url: response.config.url,
        method: response.config.method 
      });
    }
    return response;
  },
  async (error) => {
    if (DEBUG) {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        data: error.response?.data
      });
    }

    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new ApiError(`API endpoint not found: ${error.config?.url}`, 404, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('__clerk_db_jwt');
      throw new ApiError('Authentication required', 401, error.response?.data);
    }
    
    if (error.code === 'ECONNREFUSED' || !error.response) {
      throw new ApiError('Backend server is not running or unreachable', 500, null);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (DEBUG) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error('❌ [API] Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // Only try to get token on client side
      try {
        const token = await fetch('/api/get-token').then(res => res.text());
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and debugging
api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`✅ [API] Response:`, {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Detailed error logging
    if (DEBUG) {
      console.error('❌ [API] Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        isNetworkError: error.message === 'Network Error',
      });
    }

    // Handle specific error types
    if (error.message === 'Network Error') {
      console.error('[API] Network Error: Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
    } else if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    // Create enhanced error with detailed information
    const enhancedError = new ApiError(
      error.response?.data?.message || error.message || 'An unexpected error occurred',
      error.response?.status,
      error.response?.data
    );
    
    return Promise.reject(enhancedError);
  }
);

import { BusinessMedia, CreateMediaDTO } from '../types/media.types';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface BusinessAnalytics {
  totalViews: number;
  totalPosts: number;
  totalVideos: number;
  totalMenuItems: number;
  recentVisits: number;
}

export const businessProfileApi = {
  // Media (Sliders, Posts, Videos)
  createMedia: async (data: CreateMediaDTO) => {
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.businessProfileId) formData.append('businessProfileId', data.businessProfileId);

      // Append each file to the form data
      data.media.forEach((file: File) => {
        formData.append('media', file);
      });

      const response = await api.post('/business/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minute timeout
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating media:', error.response?.data || error.message);
      if (error.message === 'Network Error') {
        throw new Error('Failed to upload media. Please check your internet connection and try again with a smaller file size if the issue persists.');
      }
      throw error;
    }
  },

  getMedia: async (type: BusinessMedia['type']) => {
    try {
      const response = await api.get(`/business/media?type=${type}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting media:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteMedia: async (id: string) => {
    try {
      const response = await api.delete(`/business/media/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting media:', error.response?.data || error.message);
      throw error;
    }
  },

  // Menu Items
  createMenuItem: async (data: Omit<MenuItem, 'id'>) => {
    try {
      const response = await api.post('/business-profile/menu', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating menu item:', error.response?.data || error.message);
      throw error;
    }
  },

  getMenuItems: async () => {
    try {
      const response = await api.get('/business-profile/menu');
      return response.data;
    } catch (error: any) {
      console.error('Error getting menu items:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteMenuItem: async (id: string) => {
    try {
      const response = await api.delete(`/business-profile/menu/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting menu item:', error.response?.data || error.message);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (): Promise<BusinessAnalytics> => {
    try {
      const response = await api.get('/api/business/analytics');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching analytics:', error.response?.data || error.message);
      throw error;
    }
  }
};