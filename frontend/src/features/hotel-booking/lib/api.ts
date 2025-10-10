import axios from 'axios';

// Hotel booking specific API configuration with /api prefix
const HOTEL_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

console.log('🏨 Hotel Booking API Base URL:', HOTEL_API_BASE_URL);
console.log('🕐 Current Date (UTC):', '2025-09-25 12:49:17');
console.log('👤 Current User:', 'NadPerz');

const hotelApi = axios.create({
  baseURL: HOTEL_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Login': 'NadPerz',
    'X-User-ID': 'NadPerz',
    'Authorization': 'Bearer NadPerz-token', // Mock auth token
    'X-Request-Timestamp': '2025-09-25 12:49:17',
  },
  timeout: 30000, // 30 seconds timeout for hotel operations
});

// Request interceptor for hotel booking API
hotelApi.interceptors.request.use(
  (config) => {
    // Add current timestamp and user to all requests
    config.headers['X-Request-Timestamp'] = '2025-09-25 12:49:17';
    config.headers['X-User-Login'] = 'NadPerz';
    config.headers['X-User-ID'] = 'NadPerz';
    config.headers['Authorization'] = 'Bearer NadPerz-token';
    
    console.log(`🏨 Hotel API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📅 Request Time (UTC):', '2025-09-25 12:49:17');
    
    if (config.data) {
      console.log('📦 Request Data:', JSON.stringify(config.data, null, 2));
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Hotel API Request Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: '2025-09-25 12:49:17',
      user: 'NadPerz'
    });
    return Promise.reject(error);
  }
);

// Response interceptor for hotel booking API
hotelApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Hotel API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📅 Response Time (UTC):', '2025-09-25 12:49:17');
    
    if (response.data) {
      const dataCount = Array.isArray(response.data.data) ? response.data.data.length : 'N/A';
      console.log('📊 Response Data Count:', dataCount);
      console.log('📦 Response Data Preview:', JSON.stringify(response.data, null, 2));
    }
    
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url || 'Unknown URL',
      method: error.config?.method?.toUpperCase() || 'Unknown Method',
      status: error.response?.status || 'No Status',
      statusText: error.response?.statusText || 'No Status Text',
      message: error.message || 'No error message',
      baseURL: error.config?.baseURL || 'No Base URL',
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      timestamp: '2025-09-25 12:49:17',
      user: 'NadPerz',
      responseData: error.response?.data || 'No response data',
      requestData: error.config?.data || 'No request data'
    };

    // Handle specific hotel booking API errors
    if (error.response?.status === 404) {
      if (error.config?.url?.includes('/hotels/')) {
        console.warn(`⚠️ Hotel not found: ${errorInfo.fullURL}`, errorInfo);
      } else if (error.config?.url?.includes('/rooms/')) {
        console.warn(`⚠️ Room not found: ${errorInfo.fullURL}`, errorInfo);
      } else if (error.config?.url?.includes('/bookings/')) {
        console.warn(`⚠️ Booking not found: ${errorInfo.fullURL}`, errorInfo);
      } else {
        console.warn(`⚠️ Resource not found: ${errorInfo.fullURL}`, errorInfo);
      }
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication required for hotel booking API:', errorInfo);
    } else if (error.response?.status === 403) {
      console.error('🚫 Access forbidden for hotel booking operation:', errorInfo);
    } else if (error.response?.status === 400) {
      console.error('📝 Bad request - validation error:', errorInfo);
    } else if (error.response?.status === 500) {
      console.error('💥 Hotel booking server error:', errorInfo);
    } else {
      console.error('❌ Hotel API Response Error:', errorInfo);
    }
    
    return Promise.reject(error);
  }
);

// Hotel booking specific API methods
export const hotelBookingApi = {
  // Base API instance
  client: hotelApi,
  
  // Helper method to log API calls
  logApiCall: (operation: string, data?: any) => {
    console.log(`🏨 ${operation}:`, {
      timestamp: '2025-09-25 12:49:17',
      user: 'NadPerz',
      data: data ? JSON.stringify(data, null, 2) : 'No data'
    });
  },
  
  // Helper method for error handling
  handleApiError: (error: any, operation: string) => {
    const errorDetails = {
      timestamp: '2025-09-25 12:49:17',
      user: 'NadPerz',
      operation: operation,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    };
    
    console.error(`❌ ${operation} failed:`, errorDetails);
    throw error;
  }
};

export default hotelApi;