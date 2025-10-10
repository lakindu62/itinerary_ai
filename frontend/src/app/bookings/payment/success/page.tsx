"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Download,
  Share,
  Home
} from 'lucide-react';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import { useRoom } from '@/features/hotel-booking/hooks/useRooms';
import { format } from 'date-fns';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookingId = searchParams.get('bookingId') || '';
  const paymentId = searchParams.get('paymentId') || '';
  const hotelId = searchParams.get('hotelId') || '';
  const roomId = searchParams.get('roomId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';
  const totalPrice = searchParams.get('totalPrice') || '0';
  const guestName = searchParams.get('guestName') || '';
  const guestEmail = searchParams.get('guestEmail') || '';
  
  const { data: hotel } = useHotel(hotelId);
  const { data: room } = useRoom(roomId);

  console.log('✅ Payment Success Page loaded:', {
    bookingId,
    paymentId,
    hotelId,
    roomId,
    timestamp: '2025-09-25 11:18:45',
    user: 'NadPerz'
  });

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-gray-600">Loading confirmation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Your booking has been confirmed</p>
          <p className="text-sm text-gray-500">
            Confirmed by NadPerz • 2025-09-25 11:18:45 UTC
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Booking ID: {bookingId.slice(-8).toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Payment ID: {paymentId.slice(-8).toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Booking Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <div className="font-medium">{format(new Date(checkIn), 'MMM dd, yyyy')}</div>
                    <div className="text-gray-500">After 3:00 PM</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <div className="font-medium">{format(new Date(checkOut), 'MMM dd, yyyy')}</div>
                    <div className="text-gray-500">Before 11:00 AM</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Guests:</span>
                    <div className="font-medium">{guests} {parseInt(guests) === 1 ? 'guest' : 'guests'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Nights:</span>
                    <div className="font-medium">
                      {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Room Details</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium">{room.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{room.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Guest Name:</span>
                    <div className="font-medium">{guestName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <div className="font-medium">{guestEmail}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{hotel.title}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.city}, {hotel.state}, {hotel.country}
                    </div>
                    <Badge className="mt-2 bg-yellow-500 text-black">⭐ 4.5</Badge>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Free cancellation until 24 hours before check-in</li>
                      <li>• Check-in starts at 3:00 PM</li>
                      <li>• Check-out is before 11:00 AM</li>
                      <li>• Valid ID required at check-in</li>
                      <li>• Confirmation email sent to {guestEmail}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span>${room.roomPrice}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Nights</span>
                    <span>{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  <div>Payment Method: Card ending in 4242</div>
                  <div>Payment ID: {paymentId}</div>
                  <div>Transaction Date: 2025-09-25 11:18:45 UTC</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/hotels/my-bookings')}>
            <Calendar className="mr-2 h-4 w-4" />
            View My Bookings
          </Button>
          <Button onClick={() => router.push('/hotels')} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Book Another Stay
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Thank You for Your Booking!</h3>
            <p className="text-gray-600 text-sm">
              A confirmation email has been sent to {guestEmail}. 
              Your booking is confirmed and ready!
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Payment processed by NadPerz • 2025-09-25 11:18:45 UTC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading success page...</div>}>
      <SuccessContent />
    </Suspense>
  );
}