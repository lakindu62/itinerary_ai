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
  Home,
  Star,
  Clock
} from 'lucide-react';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import { useRoom } from '@/features/hotel-booking/hooks/useRooms';
import { format } from 'date-fns';

function BookingConfirmationContent() {
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

  console.log('✅ Booking Confirmation Page loaded:', {
    bookingId,
    paymentId,
    hotelId,
    roomId,
    timestamp: '2025-09-25 12:10:52',
    user: 'NadPerz'
  });

  const handleDownloadConfirmation = () => {
    console.log('📄 Downloading booking confirmation:', bookingId);
    const receipt = `
BOOKING CONFIRMATION
====================

Booking ID: ${bookingId}
Payment ID: ${paymentId}
Guest: ${guestName}
Email: ${guestEmail}
Date: 2025-09-25 12:10:52 UTC

Hotel: ${hotel?.title}
Location: ${hotel?.city}, ${hotel?.country}
Room: ${room?.title}

Check-in: ${format(new Date(checkIn), 'MMM dd, yyyy')}
Check-out: ${format(new Date(checkOut), 'MMM dd, yyyy')}
Guests: ${guests}
Total Paid: $${totalPrice}

Status: CONFIRMED ✅
Booked by: NadPerz

Thank you for booking with us!
`;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-confirmation-${bookingId.slice(-8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ Booking confirmation downloaded successfully!');
  };

  const handleShareBooking = () => {
    const shareText = `🏨 My hotel booking is confirmed!\n\n${hotel?.title} in ${hotel?.city}\nCheck-in: ${format(new Date(checkIn), 'MMM dd, yyyy')}\nCheck-out: ${format(new Date(checkOut), 'MMM dd, yyyy')}\n\nBooked by NadPerz ✅`;
    
    if (navigator.share) {
      navigator.share({
        title: `Hotel Booking Confirmed - ${hotel?.title}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      alert('📋 Booking details copied to clipboard!');
    }
  };

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-gray-600">Loading confirmation details...</div>
          <p className="text-xs text-gray-500 mt-2">User: NadPerz | 2025-09-25 12:10:52</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 shadow-lg animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🎉 Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">Your reservation has been successfully created</p>
          <p className="text-sm text-gray-500">
            Confirmed by NadPerz • 2025-09-25 12:10:52 UTC
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 px-4 py-2 shadow-sm">
              📋 Booking: {bookingId.slice(-8).toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 px-4 py-2 shadow-sm">
              💳 Payment: {paymentId.slice(-8).toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-white">
                  <Calendar className="mr-2 h-5 w-5" />
                  Your Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <span className="text-blue-600 font-medium">Check-in:</span>
                    <div className="font-bold text-lg">{format(new Date(checkIn), 'MMM dd, yyyy')}</div>
                    <div className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      After 3:00 PM
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <span className="text-purple-600 font-medium">Check-out:</span>
                    <div className="font-bold text-lg">{format(new Date(checkOut), 'MMM dd, yyyy')}</div>
                    <div className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Before 11:00 AM
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <span className="text-green-600 font-medium">Guests:</span>
                    <div className="font-bold text-lg flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {guests} {parseInt(guests) === 1 ? 'guest' : 'guests'}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <span className="text-orange-600 font-medium">Duration:</span>
                    <div className="font-bold text-lg">
                      {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} nights
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-800">🏠 Room Details</h4>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border">
                    <div className="font-bold text-lg text-gray-800">{room.title}</div>
                    <div className="text-sm text-gray-600 mt-2">{room.description}</div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {room.freeWifi && (
                        <Badge variant="secondary" className="text-xs">📶 WiFi</Badge>
                      )}
                      {room.tv && (
                        <Badge variant="secondary" className="text-xs">📺 TV</Badge>
                      )}
                      {room.airCondition && (
                        <Badge variant="secondary" className="text-xs">❄️ AC</Badge>
                      )}
                      {room.balcony && (
                        <Badge variant="secondary" className="text-xs">🏞️ Balcony</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>👤 Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      N
                    </div>
                    <div>
                      <div className="font-bold text-lg">{guestName}</div>
                      <div className="text-sm text-gray-600">{guestEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-600 font-medium">Booking Status:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      ✅ Confirmed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Information */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-white">
                  <MapPin className="mr-2 h-5 w-5" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{hotel.title}</h3>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{hotel.city}, {hotel.state}, {hotel.country}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        4.5 Rating
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-3">📋 Important Information</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Free cancellation until 24 hours before check-in
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        Check-in starts at 3:00 PM
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        Check-out is before 11:00 AM
                      </li>
                      <li className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-500" />
                        Valid ID required at check-in
                      </li>
                      <li className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-pink-500" />
                        Confirmation email sent to {guestEmail}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-800 mb-2">📞 Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        <span>info@{hotel.title.toLowerCase().replace(/\s/g, '')}.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>💰 Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span className="font-medium">${room.roomPrice}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Nights</span>
                    <span className="font-medium">{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium">Visa ending in 4242</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment ID:</span>
                      <span className="font-mono">{paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction Date:</span>
                      <span>2025-09-25 12:10:52 UTC</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadConfirmation} variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
            <Download className="mr-2 h-4 w-4" />
            Download Confirmation
          </Button>
          <Button onClick={handleShareBooking} variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
            <Share className="mr-2 h-4 w-4" />
            Share Booking
          </Button>
          <Button onClick={() => router.push('/hotels/my-bookings')} size="lg" className="shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600">
            <Calendar className="mr-2 h-4 w-4" />
            View My Bookings
          </Button>
          <Button onClick={() => router.push('/hotels')} variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
            <Home className="mr-2 h-4 w-4" />
            Book Another Stay
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg border-0">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🙏 Thank You for Your Booking!</h3>
            <p className="text-gray-600 mb-4">
              Your reservation is confirmed and we can't wait to welcome you. A detailed confirmation 
              email has been sent to <span className="font-medium text-blue-600">{guestEmail}</span>.
            </p>
            <p className="text-gray-600 mb-4">
              If you have any questions or need assistance, please don't hesitate to contact our 
              support team at any time.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mt-4 border">
              <p className="text-xs text-gray-500">
                Booking confirmed by NadPerz • 2025-09-25 12:10:52 UTC
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Booking Reference: {bookingId} | Payment Reference: {paymentId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingsConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-gray-600">Loading booking confirmation...</div>
          <p className="text-xs text-gray-500 mt-2">User: NadPerz | 2025-09-25 12:10:52</p>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}