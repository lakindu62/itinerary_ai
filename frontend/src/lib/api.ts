import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth header (placeholder for Clerk)
api.interceptors.request.use(async (config) => {
  // TODO: Add Clerk auth token when ready
  // const { getToken } = auth();
  // const token = await getToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  
  // For now, use test user
  config.headers['x-user-id'] = 'test-user-123';
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Redirect to login when Clerk is ready
      console.warn('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

export default api;