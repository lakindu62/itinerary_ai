"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
// import StatsCards from '../components/dashboard/StatsCards';
// import RevenueChart from '../components/dashboard/RevenueChart';
// import RecentBookings from '../components/dashboard/RecentBookings';
// import QuickActions from '../components/dashboard/QuickActions';
// import { useBookings } from '../hooks/useBookings';
// import { useAnalytics } from '../hooks/useAnalytics';
// import { generatePDFReport, generateCSVReport } from '../utils/reportGenerator';

// Mock data for now - replace with actual hooks when ready
const useMockBookings = () => ({
  bookings: [],
  myBookings: [],
  conflicts: [],
  isLoading: false
});

const useMockAnalytics = () => ({
  analytics: {
    bookingGrowth: 12.5,
    occupancyRate: 78.3,
    occupancyGrowth: 5.2
  },
  revenue: {
    total: 45000,
    growth: 15.3,
    monthlyData: [
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 15000 },
      { month: 'Mar', revenue: 18000 }
    ]
  }
});

export default function Dashboard() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { bookings, conflicts, isLoading } = useMockBookings();
  const { analytics, revenue } = useMockAnalytics();

  const handleGenerateReport = async (format: 'PDF' | 'CSV') => {
    setIsGeneratingReport(true);
    try {
      // Mock report generation - replace with actual implementation
      console.log(`Generating ${format} report...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      
      if (format === 'PDF') {
        console.log('PDF report generated');
      } else {
        console.log('CSV report generated');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const stats = {
    totalRevenue: revenue.total,
    revenueGrowth: revenue.growth,
    totalBookings: bookings.length,
    bookingGrowth: analytics.bookingGrowth,
    occupancyRate: analytics.occupancyRate,
    occupancyGrowth: analytics.occupancyGrowth,
    conflicts: conflicts.length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, NadPerz! Here's your hotel performance overview.</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleGenerateReport('CSV')}
            variant="outline"
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Button
            onClick={() => handleGenerateReport('PDF')}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards - Mock for now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600">+{stats.revenueGrowth}% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
          <p className="text-sm text-green-600">+{stats.bookingGrowth}% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
          <p className="text-sm text-green-600">+{stats.occupancyGrowth}% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conflicts</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.conflicts}</p>
          <p className="text-sm text-red-600">Needs attention</p>
        </div>
      </div>

      {/* Main Content Grid - Mock for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Chart</h3>
          <p className="text-gray-600">Chart component will go here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <p className="text-gray-600">Recent bookings component will go here</p>
        </div>
      </div>

      {/* Quick Actions - Mock for now */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button 
            onClick={() => window.location.href = '/hotel-booking/hotels/create'}
            variant="outline"
          >
            Create Hotel
          </Button>
          <Button 
            onClick={() => window.location.href = '/hotel-booking/hotels'}
            variant="outline"
          >
            Create Room
          </Button>
          <Button 
            onClick={() => window.location.href = '/hotel-booking/analytics/reports'}
            variant="outline"
          >
            View Reports
          </Button>
          <Button 
            onClick={() => window.location.href = '/hotel-booking/bookings/conflicts'}
            variant="outline"
          >
            View Conflicts ({stats.conflicts})
          </Button>
          <Button 
            onClick={() => window.location.href = '/hotel-booking/analytics/revenue'}
            variant="outline"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}