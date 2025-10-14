import { useState, useEffect } from 'react';

const mockAnalyticsData = {
  revenueData: {
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    revenueGrowth: 15,
    averageBookingValue: 350,
  },
  bookingStats: {
    totalBookings: 357,
    activeBookings: 42,
    occupancyRate: 78,
  },
  hotelStats: {
    totalHotels: 12,
    totalRooms: 480,
    averageRating: 4.6,
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 },
  ],
};

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  return { ...analyticsData, isLoading };
}
