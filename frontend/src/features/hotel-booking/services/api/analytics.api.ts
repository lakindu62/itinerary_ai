import api from '@/lib/api';

export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
  },

  // Get revenue data
  getRevenueData: async (period: 'month' | 'year' = 'month') => {
    const response = await api.get(`/analytics/revenue?period=${period}`);
    return response.data.data;
  },

  // Get booking stats
  getBookingStats: async () => {
    const response = await api.get('/analytics/bookings');
    return response.data.data;
  },

  // Get occupancy data
  getOccupancyData: async () => {
    const response = await api.get('/analytics/occupancy');
    return response.data.data;
  },
};