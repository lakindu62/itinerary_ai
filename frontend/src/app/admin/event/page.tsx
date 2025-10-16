'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getBusinessAnalytics } from '@/features/event/lib/event-api';
import { SectionCards } from '@/features/event/components/section-cards';
import { ChartAreaInteractive } from '@/features/event/components/chart-area-interactive';
import { RevenueBarChart } from '@/features/event/components/revenue-bar-chart';
import { EventsDataTable } from '@/features/event/components/events-data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsData {
  totalRevenue: number;
  totalGuests: number;
  eventCount: number;
  averageSellThrough: number;
  eventPerformance: any[];
  revenueOverTime: { date: string; revenue: number }[];
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!getToken) return;
      try {
        setLoading(true);
        const data = await getBusinessAnalytics(getToken);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [getToken]);

  const filteredRevenueData = useMemo(() => {
    if (!analytics?.revenueOverTime) return [];

    const getDaysAgo = (days: number) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0); // Normalize to the start of the day
        date.setDate(date.getDate() - days);
        return date;
    };

    let startDate;
    if (timeRange === "7d") {
        startDate = getDaysAgo(7);
    } else if (timeRange === "30d") {
        startDate = getDaysAgo(30);
    } else { // "90d"
        startDate = getDaysAgo(90);
    }

    return analytics.revenueOverTime.filter(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0); // Normalize to the start of the day
        return itemDate >= startDate;
    });
  }, [analytics, timeRange]);

  if (loading) {
    return <div className="p-4">Loading Dashboard...</div>;
  }

  if (!analytics) {
    return <div className="p-4">Failed to load analytics data.</div>;
  }

  return (
    <main className="@container/main p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <SectionCards 
            totalRevenue={analytics.totalRevenue}
            totalGuests={analytics.totalGuests}
            eventCount={analytics.eventCount}
            averageSellThrough={analytics.averageSellThrough}
          />
          
          <RevenueBarChart data={analytics.eventPerformance} />
          
          <div>
            <div className="flex justify-end mb-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartAreaInteractive 
              data={filteredRevenueData} 
              title="Revenue Over Time"
              description={`Showing revenue for the last ${timeRange === '90d' ? '90' : timeRange === '30d' ? '30' : '7'} days`}
            />
          </div>

          <EventsDataTable data={analytics.eventPerformance} />
        </div>
      </div>
    </main>
  );
}
