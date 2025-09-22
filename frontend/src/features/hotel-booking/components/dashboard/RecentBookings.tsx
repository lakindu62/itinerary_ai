"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Booking } from '../../types/booking.types';
import { formatDate, formatPrice } from '../../utils/formatters';

interface RecentBookingsProps {
  bookings: Booking[];
  onViewAll?: () => void;
}

export default function RecentBookings({ bookings, onViewAll }: RecentBookingsProps) {
  const recentBookings = bookings.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-dark-brown">Recent Bookings</CardTitle>
        {onViewAll && (
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="font-semibold text-dark-brown">
                    Booking #{booking.id.slice(-6)}
                  </p>
                  <Badge 
                    variant={booking.paymentStatus ? "default" : "secondary"}
                    className={booking.paymentStatus ? "bg-green-100 text-green-800" : ""}
                  >
                    {booking.paymentStatus ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Room {booking.roomId.slice(-6)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-dark-brown">
                  {formatPrice(booking.totalPrice)}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.currency}
                </p>
              </div>
            </div>
          ))}
          
          {recentBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent bookings found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}