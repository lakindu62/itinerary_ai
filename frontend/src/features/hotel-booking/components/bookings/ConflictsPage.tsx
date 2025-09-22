"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatPrice } from '../../lib/formatters';

export default function ConflictsPage() {
  const { conflicts, isLoading } = useBookings();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Booking Conflicts</h1>
        <p className="text-gray-600">Resolve conflicts between internal and external bookings</p>
      </div>

      {conflicts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Conflicts Found
            </h3>
            <p className="text-gray-600">
              All bookings are properly synchronized. Great job!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conflicts.map((booking) => (
            <Card key={booking.id} className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-red-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Conflict Detected
                  </CardTitle>
                  <Badge variant="destructive">
                    {booking.source} Booking
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Booking Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>ID: {booking.id}</p>
                      <p>Room: {booking.roomId}</p>
                      <p>Dates: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                      <p>Amount: {formatPrice(booking.totalPrice)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Conflict Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Source: {booking.source}</p>
                      <p>External ID: {booking.externalBookingId || 'N/A'}</p>
                      <p>Status: Not Resolved</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Available Actions</h4>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Contact Guest
                    </Button>
                    <Button size="sm" variant="outline">
                      Find Alternative Room
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Cancel Booking
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Mark Resolved
                    </Button>
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