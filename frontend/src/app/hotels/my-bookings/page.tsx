"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  MapPin,
  Users,
  Search,
  Eye,
  X,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useUserBookings } from '@/features/hotel-booking/hooks/useBookings';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';
import { format, parseISO, isAfter, addDays } from 'date-fns';

export default function MyBookingsPage() {
  const router = useRouter();
  const { userBookings, isLoading, cancelBooking, isCancelling } = useUserBookings('NadPerz');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  console.log('📅 My Bookings Page loaded:', {
    bookingCount: userBookings.length,
    timestamp: '2025-09-25 11:18:45',
    user: 'NadPerz'
  });

  const filteredBookings = userBookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotelCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      console.log('❌ Cancelling booking:', {
        bookingId,
        timestamp: '2025-09-25 11:18:45',
        user: 'NadPerz'
      });

      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully!');
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canCancelBooking = (booking: any) => {
    const checkInDate = parseISO(booking.checkIn);
    const twentyFourHoursBefore = addDays(checkInDate, -1);
    return booking.canCancel && isAfter(twentyFourHoursBefore, new Date()) && booking.status === 'confirmed';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/hotels')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your hotel reservations and view booking history</p>
          <p className="text-sm text-gray-500 mt-1">
            Viewed by NadPerz • 2025-09-25 11:18:45 UTC
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by hotel, room, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {userBookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {userBookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {userBookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                ${userBookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
                  .reduce((sum, b) => sum + b.totalPrice, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No Matching Bookings' : 'No Bookings Yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'Start exploring and book your next perfect stay!'}
              </p>
              <Button onClick={() => router.push('/hotels')}>
                Explore Hotels
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.hotelName}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.hotelCity}, {booking.hotelCountry}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {booking.roomName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${getStatusColor(booking.status)} flex items-center`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </Badge>
                      <div className="text-lg font-semibold text-gray-900 mt-2">
                        ${booking.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booking ID: {booking.id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Check-in</div>
                      <div className="font-medium">
                        {format(parseISO(booking.checkIn), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">After 3:00 PM</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Check-out</div>
                      <div className="font-medium">
                        {format(parseISO(booking.checkOut), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">Before 11:00 AM</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Guests</div>
                      <div className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.guests}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Nights</div>
                      <div className="font-medium">
                        {Math.ceil((parseISO(booking.checkOut).getTime() - parseISO(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Booked on {format(parseISO(booking.createdAt), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Downloading booking details...')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      {canCancelBooking(booking) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                          disabled={isCancelling}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      
                      {booking.status === 'confirmed' && !canCancelBooking(booking) && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          Cannot cancel within 24h
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/hotels')} size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Book Another Stay
          </Button>
        </div>
      </div>
    </div>
  );
}