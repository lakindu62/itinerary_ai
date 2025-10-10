"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building, 
  Calendar,
  DollarSign,
  Download,
  BarChart3,
  PieChart,
  Loader2
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { exportToCSV, downloadCSV } from '../../lib/exportUtils';

export default function AnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');
  
  const { 
    revenueData, 
    bookingStats, 
    hotelStats, 
    monthlyRevenue,
    isLoading 
  } = useAnalytics();

  console.log('📊 Analytics Page loaded:', {
    timestamp: '2025-09-25 09:29:34',
    user: 'NadPerz',
    timeRange,
    dataAvailable: {
      revenue: !!revenueData,
      bookings: !!bookingStats,
      hotels: !!hotelStats,
      monthly: monthlyRevenue.length > 0
    }
  });

  // Create comprehensive analytics data with safe property access
  const analyticsData = {
    // Revenue data with safe access and fallbacks
    totalRevenue: revenueData?.totalRevenue || 0,
    monthlyRevenue: revenueData?.monthlyRevenue || 0,
    revenueGrowth: (revenueData as any)?.revenueGrowth || 0, // Safe type assertion
    averageBookingValue: (revenueData as any)?.averageBookingValue || 0, // Safe type assertion
    
    // Booking data with safe access and fallbacks
    totalBookings: bookingStats?.totalBookings || 0,
    activeBookings: (bookingStats as any)?.activeBookings || 0, // Safe type assertion
    occupancyRate: (bookingStats as any)?.occupancyRate || 0,
    
    // Hotel data with safe access and fallbacks
    totalHotels: hotelStats?.totalHotels || 0,
    totalRooms: hotelStats?.totalRooms || 0,
    averageRating: (hotelStats as any)?.averageRating || (hotelStats as any)?.averageHotelRating || 4.5, // Handle both possible property names
    
    // Calculated metrics
    occupancyGrowth: 5.2, // Mock data for demo
    timestamp: '2025-09-25 09:29:34',
    user: 'NadPerz'
  };

  const handleExportRevenue = async () => {
    setIsExporting(true);
    try {
      console.log('📊 Exporting revenue analytics:', {
        timestamp: '2025-09-25 09:29:34',
        user: 'NadPerz',
        timeRange
      });
      
      // Create array format for CSV export
      const revenueExportData = [{
        exportDate: '2025-09-25 09:29:34',
        exportedBy: 'NadPerz',
        timeRange: timeRange,
        totalRevenue: analyticsData.totalRevenue,
        monthlyRevenue: analyticsData.monthlyRevenue,
        revenueGrowth: analyticsData.revenueGrowth,
        averageBookingValue: analyticsData.averageBookingValue,
        totalBookings: analyticsData.totalBookings,
        totalHotels: analyticsData.totalHotels
      }];
      
      const csvContent = exportToCSV(revenueExportData, 'revenue-analytics');
      downloadCSV(csvContent, 'revenue-analytics');
      
      console.log('✅ Revenue analytics export completed');
    } catch (error) {
      console.error('❌ Revenue export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportOccupancy = async () => {
    setIsExporting(true);
    try {
      console.log('📊 Exporting occupancy analytics:', {
        timestamp: '2025-09-25 09:29:34',
        user: 'NadPerz'
      });
      
      // Create array format for CSV export
      const occupancyExportData = [{
        exportDate: '2025-09-25 09:29:34',
        exportedBy: 'NadPerz',
        timeRange: timeRange,
        occupancyRate: analyticsData.occupancyRate,
        occupancyGrowth: analyticsData.occupancyGrowth,
        totalRooms: analyticsData.totalRooms,
        activeBookings: analyticsData.activeBookings
      }];
      
      const csvContent = exportToCSV(occupancyExportData, 'occupancy-analytics');
      downloadCSV(csvContent, 'occupancy-analytics');
      
      console.log('✅ Occupancy analytics export completed');
    } catch (error) {
      console.error('❌ Occupancy export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGuests = async () => {
    setIsExporting(true);
    try {
      console.log('📊 Exporting guest analytics:', {
        timestamp: '2025-09-25 09:29:34',
        user: 'NadPerz'
      });
      
      // Create array format for CSV export
      const guestExportData = [{
        exportDate: '2025-09-25 09:29:34',
        exportedBy: 'NadPerz',
        timeRange: timeRange,
        totalGuests: analyticsData.totalBookings * 2, // Estimate 2 guests per booking
        avgStayDuration: 3.2, // Mock data
        returnGuests: '15%', // Mock data
        averageRating: analyticsData.averageRating
      }];
      
      const csvContent = exportToCSV(guestExportData, 'guest-analytics');
      downloadCSV(csvContent, 'guest-analytics');
      
      console.log('✅ Guest analytics export completed');
    } catch (error) {
      console.error('❌ Guest export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading analytics...</p>
          <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 09:29:34</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your hotel performance
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Generated by NadPerz at 2025-09-25 09:29:34 UTC
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analyticsData.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(analyticsData.revenueGrowth)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{analyticsData.occupancyGrowth}% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.activeBookings} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on guest feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Revenue Analytics
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Financial performance overview</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportRevenue}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  ${analyticsData.totalRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-green-600">Total Revenue</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  ${analyticsData.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-blue-600">Monthly Revenue</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  ${analyticsData.averageBookingValue.toLocaleString()}
                </div>
                <p className="text-sm text-purple-600">Avg Booking Value</p>
              </div>
            </div>
            <div className="pt-4 text-xs text-gray-500 text-center">
              Revenue data updated by NadPerz at 2025-09-25 09:29:34 UTC
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Occupancy Trends
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Room utilization metrics</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportOccupancy}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Occupancy</span>
                <Badge variant="secondary">{analyticsData.occupancyRate}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <Badge variant="outline">{analyticsData.totalRooms}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Occupied Rooms</span>
                <Badge variant="outline">
                  {Math.round((analyticsData.totalRooms * analyticsData.occupancyRate) / 100)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <Badge variant="secondary" className="text-green-600">
                  +{analyticsData.occupancyGrowth}%
                </Badge>
              </div>
              <div className="pt-2 text-xs text-gray-500 text-center">
                Updated: 2025-09-25 09:29:34 | User: NadPerz
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Guest Analytics
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Customer insights and behavior</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportGuests}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Guests</span>
                <Badge variant="secondary">{analyticsData.totalBookings * 2}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Stay Duration</span>
                <Badge variant="outline">3.2 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Return Guests</span>
                <Badge variant="outline">15%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <Badge variant="secondary">{analyticsData.averageRating} ⭐</Badge>
              </div>
              <div className="pt-2 text-xs text-gray-500 text-center">
                Guest data analyzed by NadPerz | 2025-09-25 09:29:34
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="mr-2 h-5 w-5" />
            Analytics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Report Generated:</span>
              <span className="font-medium ml-2">2025-09-25 09:29:34</span>
            </div>
            <div>
              <span className="text-gray-600">Generated By:</span>
              <span className="font-medium ml-2">NadPerz</span>
            </div>
            <div>
              <span className="text-gray-600">Time Range:</span>
              <span className="font-medium ml-2">{timeRange}</span>
            </div>
            <div>
              <span className="text-gray-600">Data Points:</span>
              <span className="font-medium ml-2">{monthlyRevenue.length} months</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Analytics engine: Hotel Booking System v1.0</span>
              <span>Last data sync: 2025-09-25 09:29:34 UTC</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}