'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalyticsQuery } from '../../hooks/useBusinessProfile';
import { BarChart3, Eye, Video, FileText, Menu, TrendingUp, Loader2, RotateCw } from 'lucide-react';
import { BusinessAnalytics } from '../../api/business-profile.api';

export default function Analytics() {
  const { data: analytics, isLoading, error } = useAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-5 w-5 bg-muted animate-pulse rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted animate-pulse rounded-lg"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">Failed to load analytics data.</p>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>No Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>No analytics data is currently available.</p>
            <p className="text-sm mt-2">Check back later or contact support if this persists.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }> = [
    {
      title: "Total Views",
      value: (analytics?.totalViews ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Total Posts",
      value: (analytics?.totalPosts ?? 0).toLocaleString(),
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Total Videos",
      value: (analytics?.totalVideos ?? 0).toLocaleString(),
      icon: Video,
      color: "text-purple-500",
    },
    {
      title: "Menu Items",
      value: (analytics?.totalMenuItems ?? 0).toLocaleString(),
      icon: Menu,
      color: "text-orange-500",
    },
    {
      title: "Recent Visits",
      value: (analytics?.recentVisits ?? 0).toLocaleString(),
      icon: BarChart3,
      color: "text-pink-500",
    },
    {
      title: "Growth Rate",
      value: "+5%",
      icon: TrendingUp,
      color: "text-emerald-500",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-gray-500">
            Chart coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}