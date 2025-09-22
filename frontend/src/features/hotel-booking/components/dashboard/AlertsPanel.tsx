"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Users, X } from 'lucide-react';
import { Booking } from '../../types/booking.types';

interface AlertsPanelProps {
  conflicts: Booking[];
}

export default function AlertsPanel({ conflicts }: AlertsPanelProps) {
  const alerts = [
    {
      id: 1,
      type: 'conflict',
      title: 'Booking Conflicts Detected',
      message: `${conflicts.length} booking conflicts need immediate attention`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      action: 'Resolve',
      href: '/bookings/conflicts'
    },
    {
      id: 2,
      type: 'pending',
      title: 'Pending Payments',
      message: '5 bookings awaiting payment confirmation',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      action: 'Review',
      href: '/bookings?status=pending'
    },
    {
      id: 3,
      type: 'capacity',
      title: 'High Occupancy Alert',
      message: 'Paradise Resort is 95% booked for next weekend',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: 'View',
      href: '/dashboard/hotels'
    }
  ];

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-orange-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Alerts & Notifications
          <Badge variant="destructive" className="ml-2">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${alert.bgColor} ${alert.borderColor}`}
          >
            <div className="flex items-center space-x-3">
              <alert.icon className={`h-5 w-5 ${alert.color}`} />
              <div>
                <p className="font-medium text-gray-800">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = alert.href}
                className="bg-white"
              >
                {alert.action}
              </Button>
              <Button size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}