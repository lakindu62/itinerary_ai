"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Shield,
  CreditCard,
  Lock,
  Loader2,
  MapPin
} from 'lucide-react';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import { useRoom } from '@/features/hotel-booking/hooks/useRooms';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';
import { stripeService } from '@/features/hotel-booking/services/stripe/stripe.service';
import { bookingsApi } from '@/features/hotel-booking/services/api/bookings.api';
import { format } from 'date-fns';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hotelId = searchParams.get('hotelId') || '';
  const roomId = searchParams.get('roomId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '2');
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  
  const { data: hotel } = useHotel(hotelId);
  const { data: room } = useRoom(roomId);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardHolder: 'NadPerz',
    email: 'nadperz@example.com',
    phone: '+1 (555) 123-4567',
    specialRequests: ''
  });

  console.log('💳 Booking Payment Page loaded:', {
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    timestamp: '2025-09-25 11:50:46',
    user: 'NadPerz'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardHolder) {
      alert('Please fill in all payment fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('💳 Processing Stripe payment:', {
        amount: totalPrice,
        hotel: hotel?.title,
        room: room?.title,
        checkIn,
        checkOut,
        guests,
        timestamp: '2025-09-25 11:50:46',
        user: 'NadPerz'
      });

      // Process payment with Stripe service
      const paymentResult = await stripeService.processPayment({
        amount: totalPrice * 100, // Convert to cents
        currency: 'usd',
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardHolder: formData.cardHolder,
        description: `Hotel booking - ${hotel?.title}`,
        metadata: {
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests: guests.toString()
        }
      });

      if (paymentResult.success) {
        console.log('✅ Payment successful:', paymentResult.paymentId);
        
        // Create booking record
        const bookingData = {
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests,
          totalPrice,
          guestInfo: {
            name: formData.cardHolder,
            email: formData.email,
            phone: formData.phone
          },
          specialRequests: formData.specialRequests
        };

        console.log('📅 Creating booking record:', bookingData);
        const booking = await bookingsApi.create(bookingData);
        
        // Update booking with payment ID and confirm
        await bookingsApi.updateStatus(booking.id, 'confirmed');
        
        console.log('🎉 Booking confirmed, redirecting to success page');
        
        // Redirect to booking success page
        const confirmationData = {
          bookingId: booking.id,
          paymentId: paymentResult.paymentId,
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests: guests.toString(),
          totalPrice: totalPrice.toString(),
          guestName: formData.cardHolder,
          guestEmail: formData.email
        };
        
        const queryParams = new URLSearchParams(confirmationData).toString();
        router.push(`/booking/success?${queryParams}`);
      } else {
        console.error('❌ Payment failed:', paymentResult.error);
        alert(`Payment failed: ${paymentResult.error}`);
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading booking details...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 11:50:46</p>
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
            onClick={() => router.push(`/hotels/${hotelId}/book`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Booking
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Secure checkout powered by Stripe</p>
            <p className="text-sm text-gray-500 mt-1">
              Booking by NadPerz • 2025-09-25 11:50:46 UTC
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="mr-1 h-4 w-4" />
                  Secured with SSL encryption
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number *</label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="font-mono"
                  />
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    ✅ Test Card: 4242 4242 4242 4242 (Pre-filled for demo)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                    <Input
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0,2) + '/' + value.substring(2,4);
                        }
                        handleInputChange('expiryDate', value);
                      }}
                      maxLength={5}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV *</label>
                    <Input
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                  <Input
                    placeholder="NadPerz"
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="nadperz@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                  <Input
                    placeholder="Late check-in, early check-out, etc."
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-20 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center text-white font-bold">
                      🏨
                    </div>
                    <div>
                      <h4 className="font-semibold">{hotel.title}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hotel.city}, {hotel.country}
                      </div>
                      <Badge className="mt-1 bg-yellow-500 text-black">⭐ 4.5</Badge>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="font-medium mb-2">{room.title}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">{format(new Date(checkIn), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{format(new Date(checkOut), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span className="font-medium">{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span>${room.roomPrice}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights</span>
                    <span>{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Payment ${totalPrice}
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center space-y-1">
                    <div className="flex items-center justify-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Your payment is secured with 256-bit SSL encryption
                    </div>
                    <div>✅ Free cancellation until 24 hours before check-in</div>
                    <div>🔒 Demo mode: Use pre-filled test card 4242 4242 4242 4242</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500">
              Secure payment processing by NadPerz • 2025-09-25 11:50:46 UTC
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Hotel ID: {hotelId.slice(-8)} | Room ID: {roomId.slice(-8)} | Total: ${totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading payment page...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 11:50:46</p>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}