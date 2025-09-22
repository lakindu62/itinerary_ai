"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CalendarDays, 
  Users, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalRevenue: number;
    revenueGrowth: number;
    totalBookings: number;
    bookingGrowth: number;
    occupancyRate: number;
    occupancyGrowth: number;
    conflicts: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: stats.revenueGrowth,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: CalendarDays,
      trend: stats.bookingGrowth,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: Users,
      trend: stats.occupancyGrowth,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Conflicts',
      value: stats.conflicts.toString(),
      icon: AlertTriangle,
      trend: 0,
      color: stats.conflicts > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: stats.conflicts > 0 ? 'bg-red-50' : 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-dark-brown mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
            
            {card.trend !== 0 && (
              <div className="mt-4 flex items-center">
                {card.trend > 0 ? (
                  <TrendingUp className={`h-4 w-4 mr-1 text-green-600`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 mr-1 text-red-600`} />
                )}
                <span className={`text-sm font-medium ${card.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend > 0 ? '+' : ''}{card.trend}% from last month
                </span>
              </div>
            )}

            {card.title === 'Active Conflicts' && stats.conflicts > 0 && (
              <Badge variant="destructive" className="mt-2">
                Needs Attention
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}