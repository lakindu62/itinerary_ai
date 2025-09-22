"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatPrice } from '../../lib/formatters';

export default function AllBookingsPage() {
  const { bookings, isLoading } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking =>
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.hotelId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
          <p className="text-gray-600">Manage all hotel reservations</p>
        </div>
        <Button onClick={() => window.location.href = '/bookings/conflicts'}>
          <Calendar className="mr-2 h-4 w-4" />
          View Conflicts
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">
                      Booking #{booking.id.slice(-8).toUpperCase()}
                    </h3>
                    <Badge 
                      variant={booking.paymentStatus ? "default" : "secondary"}
                      className={booking.paymentStatus ? "bg-green-100 text-green-800" : ""}
                    >
                      {booking.paymentStatus ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Hotel: {booking.hotelId.slice(-8)}</p>
                    <p>Room: {booking.roomId.slice(-8)}</p>
                    <p>Dates: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                    <p>Guest: {booking.userId}</p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-2xl font-bold">{formatPrice(booking.totalPrice)}</p>
                  <p className="text-sm text-gray-600">{booking.currency}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/bookings/${booking.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No bookings found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}