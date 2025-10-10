"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Clock,
  XCircle,
  CheckCircle,
  Loader2,
  MessageSquare,
  CreditCard,
  RotateCcw // FIXED: Using RotateCcw instead of RefundIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';

interface CancellationProcessProps {
  reservationId: string;
}

interface BookingForCancellation {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelCountry?: string;
  roomId: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  canCancel: boolean;
  nights: number;
  daysUntilCheckIn: number;
}

export default function CancellationProcess({ reservationId }: CancellationProcessProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingForCancellation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [cancellationFee, setCancellationFee] = useState(0);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current context for NadPerz - UPDATED TO CURRENT TIME
  const currentTimestamp = '2025-09-27 05:11:08';
  const currentUser = 'NadPerz';

  console.log('❌ Cancel Reservation Page - NadPerz:', {
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
      console.log('❌ Fetching booking for cancellation - NadPerz:', {
        bookingId: reservationId.slice(-8),
        timestamp: currentTimestamp,
        user: currentUser
      });

      setIsLoading(true);
      const allBookings = await bookingsApi.getAll();
      const foundBooking = allBookings.find(b => b.id === reservationId);
      
      if (foundBooking) {
        const checkInDate = new Date(foundBooking.checkIn);
        const checkOutDate = new Date(foundBooking.checkOut);
        const currentDate = new Date();
        
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        const bookingForCancellation: BookingForCancellation = {
          ...foundBooking,
          nights,
          daysUntilCheckIn
        };

        // Calculate cancellation policy
        const { refund, fee } = calculateCancellationPolicy(foundBooking.totalPrice, daysUntilCheckIn);
        setRefundAmount(refund);
        setCancellationFee(fee);

        console.log('✅ Booking loaded for cancellation - NadPerz:', {
          bookingId: bookingForCancellation.id.slice(-8),
          guestName: bookingForCancellation.guestName,
          daysUntilCheckIn,
          refundAmount: refund,
          cancellationFee: fee,
          canCancel: bookingForCancellation.canCancel,
          timestamp: currentTimestamp
        });

        setBooking(bookingForCancellation);
      } else {
        console.error('❌ Booking not found for cancellation - NadPerz:', reservationId.slice(-8));
      }
    } catch (error) {
      console.error('❌ Error fetching booking for cancellation - NadPerz:', error);
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCancellationPolicy = (totalPrice: number, daysUntilCheckIn: number) => {
    // Cancellation policy logic
    if (daysUntilCheckIn >= 7) {
      // 7+ days: Full refund minus 5% processing fee
      const fee = totalPrice * 0.05;
      const refund = totalPrice - fee;
      return { refund, fee };
    } else if (daysUntilCheckIn >= 3) {
      // 3-6 days: 50% refund
      const fee = totalPrice * 0.50;
      const refund = totalPrice - fee;
      return { refund, fee };
    } else if (daysUntilCheckIn >= 1) {
      // 1-2 days: 25% refund
      const fee = totalPrice * 0.75;
      const refund = totalPrice - fee;
      return { refund, fee };
    } else {
      // Same day or past: No refund
      return { refund: 0, fee: totalPrice };
    }
  };

  const getCancellationPolicyText = (daysUntilCheckIn: number) => {
    if (daysUntilCheckIn >= 7) {
      return {
        title: "Free Cancellation Available",
        description: "Cancel 7+ days before check-in for a full refund (minus 5% processing fee)",
        color: "text-green-600"
      };
    } else if (daysUntilCheckIn >= 3) {
      return {
        title: "Moderate Cancellation Fee",
        description: "Cancel 3-6 days before check-in for 50% refund",
        color: "text-orange-600"
      };
    } else if (daysUntilCheckIn >= 1) {
      return {
        title: "High Cancellation Fee",
        description: "Cancel 1-2 days before check-in for 25% refund",
        color: "text-red-600"
      };
    } else {
      return {
        title: "No Refund Available",
        description: "Same day or past check-in date - no refund available",
        color: "text-red-600"
      };
    }
  };

  const handleCancelReservation = async () => {
    if (!booking || !confirmationChecked || (refundAmount > 0 && !refundConfirmed)) {
      setError('Please confirm all required fields');
      return;
    }

    if (!cancellationReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }

    try {
      console.log('❌ NadPerz cancelling reservation:', {
        bookingId: booking.id.slice(-8),
        reason: cancellationReason,
        refundAmount,
        cancellationFee,
        timestamp: currentTimestamp
      });

      setIsCancelling(true);
      setError(null);

      // Cancel the booking
      const success = await bookingsApi.cancel(booking.id);
      
      if (success) {
        console.log('✅ Reservation cancelled successfully by NadPerz');
        
        // Redirect to cancellation confirmation
        router.push(`/dashboard/reservations/${reservationId}?cancelled=true`);
      } else {
        throw new Error('Failed to cancel reservation');
      }

    } catch (error) {
      console.error('❌ Error cancelling reservation - NadPerz:', error);
      setError('Failed to cancel reservation. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleGoBack = () => {
    console.log('🔙 NadPerz going back from cancellation:', {
      bookingId: booking?.id.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${reservationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading cancellation details...</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>👤 User: {currentUser}</p>
              <p>⏰ {currentTimestamp} UTC</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !booking.canCancel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Cannot Cancel Reservation</h1>
            <p className="text-gray-600 mb-4">
              This reservation cannot be cancelled or has already been cancelled.
            </p>
            <Button onClick={() => router.push('/dashboard/reservations')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reservations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const policyInfo = getCancellationPolicyText(booking.daysUntilCheckIn);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-red-600">
                Cancel Reservation #{booking.id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Cancellation by <span className="font-semibold text-blue-600">{currentUser}</span>
              </p>
            </div>
          </div>
          
          <Badge variant="destructive" className="text-lg px-4 py-2">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Cancellation Process
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Reservation Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="font-medium">{booking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{booking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-medium">{booking.hotelName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium">{booking.roomName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nights</p>
                    <p className="font-medium">{booking.nights}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Time Until Check-in</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {booking.daysUntilCheckIn > 0 
                      ? `${booking.daysUntilCheckIn} days` 
                      : booking.daysUntilCheckIn === 0 
                        ? 'Today' 
                        : 'Past check-in date'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className={`${policyInfo.color} flex items-center space-x-2`}>
                  <AlertTriangle className="h-5 w-5" />
                  <span>Cancellation Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${policyInfo.color}`}>
                      {policyInfo.title}
                    </h3>
                    <p className="text-gray-700 mt-1">{policyInfo.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-200">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <DollarSign className="h-6 w-6 mx-auto text-red-600 mb-2" />
                      <p className="text-sm text-gray-600">Cancellation Fee</p>
                      <p className="text-xl font-bold text-red-600">${cancellationFee.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <RotateCcw className="h-6 w-6 mx-auto text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Refund Amount</p>
                      <p className="text-xl font-bold text-green-600">${refundAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {refundAmount > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        💳 Refund will be processed to the original payment method within 5-7 business days.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Cancellation Reason *</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation (required for our records)..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This information helps us improve our service and may be shared with the hotel.
                </p>
              </CardContent>
            </Card>

            {/* Confirmation Checkboxes */}
            <Card>
              <CardHeader>
                <CardTitle>Confirmation Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirm-cancellation"
                    checked={confirmationChecked}
                    onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
                  />
                  <label htmlFor="confirm-cancellation" className="text-sm cursor-pointer">
                    <strong>I understand that this cancellation is final and cannot be undone.</strong> 
                    The reservation will be immediately cancelled and the guest will be notified.
                  </label>
                </div>

                {refundAmount > 0 && (
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirm-refund"
                      checked={refundConfirmed}
                      onCheckedChange={(checked) => setRefundConfirmed(checked as boolean)}
                    />
                    <label htmlFor="confirm-refund" className="text-sm cursor-pointer">
                      <strong>I confirm the refund amount of ${refundAmount.toFixed(2)}</strong> will be processed 
                      to the original payment method within 5-7 business days.
                    </label>
                  </div>
                )}

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> The guest will receive an automatic email notification about this cancellation. 
                    You may want to contact them personally to explain the situation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Cancellation Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Original Amount</span>
                    <span className="text-sm font-medium">${booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span className="text-sm">Cancellation Fee</span>
                    <span className="text-sm font-medium">-${cancellationFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Refund Amount</span>
                      <span className="font-bold text-lg text-green-600">
                        ${refundAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.paymentId && (
                  <div className="pt-4 border-t text-xs text-gray-500">
                    <p><strong>Payment ID:</strong> {booking.paymentId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Final Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="destructive"
                  className="w-full" 
                  onClick={handleCancelReservation}
                  disabled={
                    isCancelling || 
                    !confirmationChecked || 
                    (refundAmount > 0 && !refundConfirmed) ||
                    !cancellationReason.trim()
                  }
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Reservation
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={handleGoBack}
                  disabled={isCancelling}
                >
                  Keep Reservation
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{booking.guestEmail}</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => window.open(`mailto:${booking.guestEmail}?subject=Reservation%20${booking.id.slice(-8)}%20Cancellation`)}
                  >
                    Send Email
                  </Button>
                </div>
                {booking.guestPhone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{booking.guestPhone}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => window.open(`tel:${booking.guestPhone}`)}
                    >
                      Call Guest
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-2">Cancellation Session</p>
                  <p><strong>Initiated by:</strong> {currentUser}</p>
                  <p><strong>Current time:</strong> {currentTimestamp} UTC</p>
                  <p><strong>Reservation ID:</strong> {booking.id}</p>
                  <p><strong>Days until check-in:</strong> {booking.daysUntilCheckIn}</p>
                  <p><strong>Can cancel:</strong> {booking.canCancel ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}