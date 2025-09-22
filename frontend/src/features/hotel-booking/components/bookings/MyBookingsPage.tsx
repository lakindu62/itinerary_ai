"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatPrice } from '../../lib/formatters';

export default function MyBookingsPage() {
  const { myBookings, isLoading } = useBookings();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-600">View and manage your hotel reservations</p>
      </div>

      {myBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring amazing hotels and make your first booking!
            </p>
            <Button onClick={() => window.location.href = '/hotels'}>
              Browse Hotels
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Booking #{booking.id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <Badge 
                    variant={booking.paymentStatus ? "default" : "secondary"}
                    className={booking.paymentStatus ? "bg-green-100 text-green-800" : ""}
                  >
                    {booking.paymentStatus ? 'Confirmed' : 'Pending Payment'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Hotel ID: {booking.hotelId.slice(-8)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">Room ID: {booking.roomId.slice(-8)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/bookings/${booking.id}`}
                    >
                      View Details
                    </Button>
                    {!booking.paymentStatus && (
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/payment?bookingId=${booking.id}`}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}