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
  const [lineChartTimeRange, setLineChartTimeRange] = useState("90d");
  const [barChartTimeRange, setBarChartTimeRange] = useState("all"); // New state for bar chart

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
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - days);
        return date;
    };

    let startDate;
    if (lineChartTimeRange === "7d") {
        startDate = getDaysAgo(7);
    } else if (lineChartTimeRange === "30d") {
        startDate = getDaysAgo(30);
    } else { // "90d"
        startDate = getDaysAgo(90);
    }

    return analytics.revenueOverTime.filter(item => new Date(item.date) >= startDate);
  }, [analytics, lineChartTimeRange]);

  // New memoized filter for the bar chart data
  const filteredEventPerformanceData = useMemo(() => {
    if (!analytics?.eventPerformance) return [];
    if (barChartTimeRange === "all") {
      return analytics.eventPerformance;
    }
    const now = new Date();
    const getDaysAgo = (days: number) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - days);
        return date;
    };

    let startDate;
    if (barChartTimeRange === "7d") {
        startDate = getDaysAgo(7);
    } else if (barChartTimeRange === "30d") {
        startDate = getDaysAgo(30);
    } else { // "90d"
        startDate = getDaysAgo(90);
    }

    return analytics.eventPerformance.filter(item => new Date(item.startDate) >= startDate);
  }, [analytics, barChartTimeRange]);

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
          
          <div className="flex justify-end mb-4">
              <Select value={barChartTimeRange} onValueChange={setBarChartTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <RevenueBarChart data={filteredEventPerformanceData} />
          
          <div>
            <div className="flex justify-end mb-4">
              <Select value={lineChartTimeRange} onValueChange={setLineChartTimeRange}>
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
              description={`Showing revenue for the last ${lineChartTimeRange === '90d' ? '90' : lineChartTimeRange === '30d' ? '30' : '7'} days`}
            />
          </div>

          <EventsDataTable data={analytics.eventPerformance} />
        </div>
      </div>
    </main>
  );
}
