"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Bed,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  CreditCard,
  Building,
  Bath,
  Wifi,
  Car
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';

interface ReservationDetailsProps {
  reservationId: string;
}

interface BookingDetails {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelCountry?: string;
  hotelAddress?: string;
  roomId: string;
  roomName?: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
  nights: number;
  roomPrice: number;
}

export default function ReservationDetails({ reservationId }: ReservationDetailsProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Current context for NadPerz
  const currentTimestamp = '2025-09-27 04:31:28';
  const currentUser = 'NadPerz';

  console.log('📋 Reservation Details Page - NadPerz:', {
    reservationId: reservationId.slice(-8),
    timestamp: currentTimestamp,
    user: currentUser,
    utc: true
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [reservationId]);

  const fetchBookingDetails = async () => {
    try {
      console.log('📋 Fetching booking details for NadPerz:', {
        bookingId: reservationId.slice(-8),
        timestamp: currentTimestamp,
        user: currentUser
      });

      setIsLoading(true);
      
      // Get all bookings and find the specific one (since we don't have a getById method)
      const allBookings = await bookingsApi.getAll();
      const foundBooking = allBookings.find(b => b.id === reservationId);
      
      if (foundBooking) {
        // Calculate additional details
        const checkInDate = new Date(foundBooking.checkIn);
        const checkOutDate = new Date(foundBooking.checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const roomPrice = nights > 0 ? foundBooking.totalPrice / nights : foundBooking.totalPrice;

        const enrichedBooking: BookingDetails = {
          ...foundBooking,
          nights,
          roomPrice,
          hotelAddress: `${foundBooking.hotelCity || 'City'}, ${foundBooking.hotelCountry || 'Country'}`,
          roomType: foundBooking.roomName || 'Standard Room'
        };

        console.log('✅ Booking details loaded for NadPerz:', {
          bookingId: enrichedBooking.id.slice(-8),
          status: enrichedBooking.status,
          guestName: enrichedBooking.guestName,
          hotelName: enrichedBooking.hotelName,
          nights: enrichedBooking.nights,
          timestamp: currentTimestamp
        });

        setBooking(enrichedBooking);
      } else {
        console.error('❌ Booking not found for NadPerz:', reservationId.slice(-8));
        setBooking(null);
      }
    } catch (error) {
      console.error('❌ Error fetching booking details for NadPerz:', error);
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return;

    try {
      console.log('🔄 NadPerz updating booking status:', {
        bookingId: booking.id.slice(-8),
        currentStatus: booking.status,
        newStatus,
        timestamp: currentTimestamp
      });

      setIsUpdating(true);
      const success = await bookingsApi.updateStatus(booking.id, newStatus);
      
      if (success) {
        console.log('✅ Booking status updated by NadPerz');
        await fetchBookingDetails(); // Refresh data
      } else {
        console.error('❌ Failed to update booking status for NadPerz');
      }
    } catch (error) {
      console.error('❌ Error updating booking status for NadPerz:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    console.log('✏️ NadPerz navigating to edit booking:', {
      bookingId: booking?.id.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${reservationId}/edit`);
  };

  const handleCancel = () => {
    console.log('❌ NadPerz navigating to cancel booking:', {
      bookingId: booking?.id.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${reservationId}/cancel`);
  };

  const handleDownloadConfirmation = () => {
    console.log('📄 NadPerz downloading booking confirmation:', {
      bookingId: booking?.id.slice(-8),
      timestamp: currentTimestamp
    });
    // Download functionality would go here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reservation details...</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>👤 User: {currentUser}</p>
              <p>⏰ {currentTimestamp} UTC</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Reservation Not Found</h1>
            <p className="text-gray-600 mb-4">The reservation you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/dashboard/reservations')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reservations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'cancelled': return <Trash2 className="h-5 w-5 text-red-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/reservations')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reservations
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reservation #{booking.id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Managed by <span className="font-semibold text-blue-600">{currentUser}</span>
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleDownloadConfirmation}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {booking.canCancel && booking.status !== 'cancelled' && (
              <Button variant="outline" onClick={handleCancel}>
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(booking.status)}
                  <span>Booking Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`px-3 py-1 ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(booking.updatedAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">{new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-medium font-mono">{booking.id}</p>
                  </div>
                  {booking.paymentId && (
                    <div>
                      <p className="text-sm text-gray-600">Payment ID</p>
                      <p className="font-medium font-mono">{booking.paymentId}</p>
                    </div>
                  )}
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate('cancelled')}
                      disabled={isUpdating}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotel & Room Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Hotel & Room Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-medium">{booking.hotelName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{booking.hotelAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-medium">{booking.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room ID</p>
                    <p className="font-medium font-mono">{booking.roomId.slice(-8)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{booking.guests}</p>
                  </div>
                  <div className="text-center">
                    <Bed className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-600">Nights</p>
                    <p className="font-semibold">{booking.nights}</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-600">Rate/Night</p>
                    <p className="font-semibold">${booking.roomPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Stay Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Check-in</p>
                    <p className="text-lg font-bold text-green-800">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-green-600">3:00 PM</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Check-out</p>
                    <p className="text-lg font-bold text-red-800">
                      {new Date(booking.checkOut).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-red-600">11:00 AM</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">Total Stay Duration</span>
                    <span className="text-lg font-bold text-blue-800">
                      {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Special Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.specialRequests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Guest Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{booking.guestEmail}</p>
                  <a 
                    href={`mailto:${booking.guestEmail}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Send Email
                  </a>
                </div>
                {booking.guestPhone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{booking.guestPhone}</p>
                    <a 
                      href={`tel:${booking.guestPhone}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Call Guest
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Room Rate</span>
                    <span className="text-sm">${booking.roomPrice.toFixed(2)}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nights</span>
                    <span className="text-sm">{booking.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm">${booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-bold text-lg text-green-600">
                        ${booking.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Badge 
                    className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                  >
                    {booking.status === 'confirmed' ? 'Payment Confirmed' : 'Payment Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Reservation
                </Button>
                <Button className="w-full" variant="outline" onClick={handleDownloadConfirmation}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Confirmation
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${booking.guestEmail}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Guest
                </Button>
                {booking.canCancel && booking.status !== 'cancelled' && (
                  <Button 
                    className="w-full" 
                    variant="destructive" 
                    onClick={handleCancel}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Reservation
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">System Information</p>
                  <p><strong>Managed by:</strong> {currentUser}</p>
                  <p><strong>Last viewed:</strong> {currentTimestamp} UTC</p>
                  <p><strong>Booking System:</strong> Active</p>
                  <p><strong>Can Edit:</strong> Yes</p>
                  <p><strong>Can Cancel:</strong> {booking.canCancel ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}