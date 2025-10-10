"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Users,
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Waves,
  Bed,
  Bath,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import { useRooms } from '@/features/hotel-booking/hooks/useRooms';
import { Room } from '@/features/hotel-booking/types/room.types';
import HotelImageSimple from '@/features/hotel-booking/components/shared/HotelImageSimple';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';
import StripePaymentModal from '@/features/hotel-booking/components/payments/StripePaymentModal';
import { bookingsApi } from '@/features/hotel-booking/services/api/bookings.api';
import { format, addDays, differenceInDays } from 'date-fns';

export default function HotelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;
  
  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { rooms, isLoading: isLoadingRooms } = useRooms(hotelId);
  
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  console.log('📅 Hotel Booking Page with Stripe Modal:', {
    hotelId,
    roomsCount: rooms.length,
    hotelTitle: hotel?.title,
    timestamp: '2025-09-25 13:37:43',
    user: 'NadPerz'
  });

  useEffect(() => {
    const tomorrow = addDays(new Date(), 1);
    const dayAfter = addDays(new Date(), 2);
    setCheckInDate(tomorrow);
    setCheckOutDate(dayAfter);
  }, []);

  const calculateTotalPrice = (room: Room) => {
    if (!checkInDate || !checkOutDate) return room.roomPrice;
    const nights = differenceInDays(checkOutDate, checkInDate);
    return room.roomPrice * Math.max(nights, 1);
  };

  const handleRoomSelect = (room: Room) => {
    console.log('🏠 Room selected for booking:', {
      roomId: room.id,
      roomTitle: room.title,
      price: room.roomPrice,
      timestamp: '2025-09-25 13:37:43',
      user: 'NadPerz'
    });
    setSelectedRoom(room);
    setError(null);
    setSuccess(null);
  };

  const handleBookNow = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate || !hotel) {
      setError('Please select a room and dates');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('📅 Starting booking process with Stripe payment modal:', {
        hotelId,
        hotelTitle: hotel.title,
        roomId: selectedRoom.id,
        roomTitle: selectedRoom.title,
        checkIn: format(checkInDate, 'yyyy-MM-dd'),
        checkOut: format(checkOutDate, 'yyyy-MM-dd'),
        guests: guestCount,
        totalPrice: calculateTotalPrice(selectedRoom),
        timestamp: '2025-09-25 13:37:43',
        user: 'NadPerz'
      });

      // Step 1: Check room availability
      console.log('🔍 Checking room availability...');
      setSuccess('Checking room availability...');
      
      const isAvailable = await bookingsApi.checkAvailability(
        selectedRoom.id,
        format(checkInDate, 'yyyy-MM-dd'),
        format(checkOutDate, 'yyyy-MM-dd')
      );

      if (!isAvailable) {
        setError('This room is not available for the selected dates. Please choose different dates.');
        return;
      }

      // Step 2: Create the booking in backend
      console.log('📅 Creating booking in backend...');
      setSuccess('Creating your reservation...');
      
      const bookingData = {
        hotelId,
        roomId: selectedRoom.id,
        checkIn: format(checkInDate, 'yyyy-MM-dd'),
        checkOut: format(checkOutDate, 'yyyy-MM-dd'),
        guests: guestCount,
        totalPrice: calculateTotalPrice(selectedRoom),
        guestInfo: {
          name: 'NadPerz',
          email: 'nadperz@example.com',
          phone: '+1 (555) 123-4567'
        },
        specialRequests: ''
      };

      const booking = await bookingsApi.create(bookingData);
      console.log('✅ Booking created in backend:', booking.id);
      
      setCurrentBooking(booking);
      setSuccess('Reservation created! Opening payment form...');
      
      // Step 3: Show Stripe payment modal
      setTimeout(() => {
        setShowPaymentModal(true);
        setIsProcessing(false);
        setSuccess(null);
      }, 1000);

    } catch (error: any) {
      console.error('❌ Booking process failed:', {
        message: error.message,
        timestamp: '2025-09-25 13:37:43',
        user: 'NadPerz'
      });
      
      setError(error.message || 'Booking failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('✅ Payment successful, finalizing booking...', paymentResult);
    
    try {
      // Update booking with payment info
      const paymentUpdated = await bookingsApi.updatePaymentStatus(
        currentBooking.id, 
        true, 
        paymentResult.paymentId
      );
      
      if (paymentUpdated) {
        console.log('🎉 Booking completed successfully, redirecting...');
        
        // Close modal and redirect to confirmation
        setShowPaymentModal(false);
        
        const confirmationData = {
          bookingId: currentBooking.id,
          paymentId: paymentResult.paymentId,
          hotelId,
          roomId: selectedRoom!.id,
          checkIn: format(checkInDate!, 'yyyy-MM-dd'),
          checkOut: format(checkOutDate!, 'yyyy-MM-dd'),
          guests: guestCount.toString(),
          totalPrice: calculateTotalPrice(selectedRoom!).toString(),
          guestName: 'NadPerz',
          guestEmail: 'nadperz@example.com'
        };
        
        const queryParams = new URLSearchParams(confirmationData).toString();
        router.push(`/bookings/confirmation?${queryParams}`);
      } else {
        setError('Payment successful but failed to update booking. Please contact support.');
      }
    } catch (error: any) {
      console.error('❌ Failed to finalize booking:', error);
      setError('Payment successful but booking finalization failed. Please contact support.');
    }
  };

  if (isLoadingHotel || isLoadingRooms) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading hotel details...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 13:37:43</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-4">The hotel you're looking for doesn't exist or is no longer available.</p>
            <Button onClick={() => router.push('/hotels')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/hotels')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{hotel.title}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.city}, {hotel.state}, {hotel.country}</span>
                  <Badge className="ml-4 bg-yellow-500 text-black">
                    <Star className="h-3 w-3 mr-1" />
                    4.5
                  </Badge>
                </div>
              </div>
              
              {/* <div className="text-sm text-gray-500 text-right">
                <p>💳 Stripe Payment Integration</p>
                <p>👤 Booking by: NadPerz</p>
                <p>📅 2025-09-25 13:37:43</p>
              </div> */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-800">{success}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Images & Info */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-0">
                  <div className="h-96 relative">
                    <HotelImageSimple
                      imagePath={hotel.image}
                      alt={hotel.title}
                      className="w-full h-full rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {hotel.freeWifi && (
                        <Badge variant="secondary" className="shadow-sm"><Wifi className="h-3 w-3 mr-1" />WiFi</Badge>
                      )}
                      {hotel.freeParking && (
                        <Badge variant="secondary" className="shadow-sm"><Car className="h-3 w-3 mr-1" />Parking</Badge>
                      )}
                      {hotel.coffeeShop && (
                        <Badge variant="secondary" className="shadow-sm"><Coffee className="h-3 w-3 mr-1" />Coffee</Badge>
                      )}
                      {hotel.swimmingPool && (
                        <Badge variant="secondary" className="shadow-sm"><Waves className="h-3 w-3 mr-1" />Pool</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Rooms */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Choose Your Room ({rooms.length} available)</CardTitle>
                  <p className="text-sm text-gray-600">Click on a room to select it for booking</p>
                </CardHeader>
                <CardContent>
                  {rooms.length === 0 ? (
                    <div className="text-center py-8">
                      <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No rooms available for this hotel.</p>
                      <p className="text-sm text-gray-500 mt-1">Please check back later or contact the hotel directly.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rooms.map((room: Room) => (
                        <div
                          key={room.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                            selectedRoom?.id === room.id 
                              ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => handleRoomSelect(room)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-32 h-24 flex-shrink-0">
                              <HotelImageSimple
                                imagePath={room.image}
                                alt={room.title}
                                className="w-full h-full rounded"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">{room.title}</h4>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">
                                    ${calculateTotalPrice(room)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ${room.roomPrice}/night
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {room.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {room.guestCount} guests
                                </div>
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  {room.bedCount} beds
                                </div>
                                <div className="flex items-center">
                                  <Bath className="h-4 w-4 mr-1" />
                                  {room.bathroomCount} bath
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2">
                                {room.freeWifi && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded shadow-sm">📶 WiFi</span>
                                )}
                                {room.tv && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded shadow-sm">📺 TV</span>
                                )}
                                {room.airCondition && (
                                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded shadow-sm">❄️ AC</span>
                                )}
                                {room.balcony && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded shadow-sm">🏞️ Balcony</span>
                                )}
                              </div>
                              
                              {selectedRoom?.id === room.id && (
                                <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800 font-medium">
                                  ✅ Selected for booking
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              {/* Date Selection */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Select Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <Input
                      type="date"
                      value={checkInDate ? format(checkInDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setCheckInDate(new Date(e.target.value))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <Input
                      type="date"
                      value={checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                      min={checkInDate ? format(addDays(checkInDate, 1), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      className="shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="shadow-sm"
                    />
                  </div>
                  
                  {checkInDate && checkOutDate && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="text-sm">
                        <strong>{differenceInDays(checkOutDate, checkInDate)} night(s)</strong>
                      </div>
                      <div className="text-xs text-gray-600">
                        {format(checkInDate, 'MMM dd')} - {format(checkOutDate, 'MMM dd, yyyy')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Summary */}
              {selectedRoom && (
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Hotel:</span>
                        <span className="text-sm font-medium">{hotel.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Room:</span>
                        <span className="text-sm font-medium">{selectedRoom.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Guests:</span>
                        <span className="text-sm font-medium">{guestCount}</span>
                      </div>
                      {checkInDate && checkOutDate && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Nights:</span>
                            <span className="text-sm font-medium">
                              {differenceInDays(checkOutDate, checkInDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Rate:</span>
                            <span className="text-sm font-medium">${selectedRoom.roomPrice}/night</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${calculateTotalPrice(selectedRoom)}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" 
                      size="lg"
                      onClick={handleBookNow}
                      disabled={isProcessing || rooms.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Book Now & Pay
                        </>
                      )}
                    </Button>
                    
                    <div className="text-xs text-gray-500 text-center space-y-1">
                      <div>💳 Stripe Payment Form Opens Next</div>
                      <div>🔒 Secure checkout experience</div>
                      <div>📧 Confirmation sent to NadPerz</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showPaymentModal && selectedRoom && checkInDate && checkOutDate && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          bookingDetails={{
            hotelName: hotel.title,
            roomName: selectedRoom.title,
            checkIn: format(checkInDate, 'MMM dd, yyyy'),
            checkOut: format(checkOutDate, 'MMM dd, yyyy'),
            guests: guestCount,
            nights: differenceInDays(checkOutDate, checkInDate),
            totalPrice: calculateTotalPrice(selectedRoom)
          }}
        />
      )}
    </>
  );
}