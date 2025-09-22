"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCards from './StatsCards';
import RevenueChart from './RevenueChart';
import RecentBookings from './RecentBookings';
import QuickActions from './QuickActions';
import AlertsPanel from './AlertsPanel';
import { useBookings } from '../../hooks/useBookings';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function DashboardOverview() {
  const { bookings, conflicts, isLoading: bookingsLoading } = useBookings();
  const { analytics, revenue, isLoading: analyticsLoading } = useAnalytics();

  if (bookingsLoading || analyticsLoading) {
    return <LoadingSpinner />;
  }

  // Ensure all properties exist with fallback values
  const stats = {
    totalRevenue: revenue?.total || 0,
    revenueGrowth: revenue?.growth || 0,
    totalBookings: bookings?.length || 0,
    bookingGrowth: analytics?.bookingGrowth || 0,
    occupancyRate: analytics?.occupancyRate || 0,
    occupancyGrowth: analytics?.occupancyGrowth || 0,
    conflicts: conflicts?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, NadPerz! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your hotels today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Alerts Panel */}
      {(conflicts?.length || 0) > 0 && (
        <AlertsPanel conflicts={conflicts} />
      )}

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={revenue?.monthlyData || []} />
            <RecentBookings bookings={(bookings || []).slice(0, 5)} />
          </div>
          <QuickActions conflictsCount={conflicts?.length || 0} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Occupancy chart coming soon...
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Paradise Resort #{i + 1}</p>
                        <p className="text-sm text-gray-600">{85 - i * 5}% occupancy</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(15000 - i * 2000).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">this month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <RecentBookings 
            bookings={(bookings || []).slice(0, 10)} 
            onViewAll={() => window.location.href = '/bookings'}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}