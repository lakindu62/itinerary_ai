"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  CreditCard,
  Shield,
  Lock,
  Loader2,
  CheckCircle,
  AlertTriangle // ← Added missing import
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentResult: any) => void;
  bookingDetails: {
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    totalPrice: number;
  };
}

export default function StripePaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  bookingDetails 
}: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardHolder: 'NadPerz',
    email: 'nadperz@example.com',
    billingAddress: {
      name: 'NadPerz',
      country: 'United States',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value }
    }));
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

  const formatExpiryDate = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      v = v.substring(0,2) + '/' + v.substring(2,4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    const cleanCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length < 13) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    }

    // CVV validation
    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Cardholder name validation
    if (!paymentData.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    // Email validation
    if (!paymentData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 Processing Stripe payment with card details:', {
        cardLast4: paymentData.cardNumber.slice(-4),
        cardHolder: paymentData.cardHolder,
        email: paymentData.email,
        amount: bookingDetails.totalPrice,
        timestamp: '2025-09-26 10:46:48',
        user: 'NadPerz'
      });

      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock payment result (in real implementation, this would come from Stripe)
      const paymentResult = {
        success: true,
        paymentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chargeId: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        card: {
          last4: paymentData.cardNumber.slice(-4),
          brand: 'visa',
          exp_month: paymentData.expiryDate.split('/')[0],
          exp_year: `20${paymentData.expiryDate.split('/')[1]}`
        },
        amount: bookingDetails.totalPrice * 100,
        currency: 'usd',
        receipt_email: paymentData.email
      };

      console.log('✅ Payment processed successfully:', paymentResult);
      onPaymentSuccess(paymentResult);

    } catch (error) {
      console.error('❌ Payment failed:', error);
      setErrors({ general: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'card';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Light overlay with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80"></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Complete Your Payment</h2>
            <p className="text-gray-600 mt-1">Secure checkout powered by Stripe</p>
            <p className="text-sm text-blue-600 mt-1">
              💳 Processing by NadPerz • 2025-09-26 10:46:48 UTC
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="nadperz@example.com"
                      className={`shadow-sm border-2 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-white">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <div className="flex items-center text-green-100 text-sm">
                    <Shield className="mr-1 h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 1234 1234 1234"
                        maxLength={19}
                        className={`font-mono text-lg shadow-sm border-2 ${errors.cardNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                      />
                      <div className="absolute right-3 top-3">
                        {getCardBrand(paymentData.cardNumber) === 'visa' && (
                          <div className="text-blue-600 font-bold text-sm bg-blue-100 px-2 py-1 rounded">VISA</div>
                        )}
                        {getCardBrand(paymentData.cardNumber) === 'mastercard' && (
                          <div className="text-red-600 font-bold text-sm bg-red-100 px-2 py-1 rounded">MC</div>
                        )}
                      </div>
                    </div>
                    {errors.cardNumber && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.cardNumber}
                      </p>
                    )}
                    <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                      💡 Use 4242 4242 4242 4242 for testing (pre-filled)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                      <Input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`font-mono text-lg shadow-sm border-2 ${errors.expiryDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                      <Input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className={`font-mono text-lg shadow-sm border-2 ${errors.cvv ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                    <Input
                      type="text"
                      value={paymentData.cardHolder}
                      onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                      placeholder="NadPerz"
                      className={`shadow-sm border-2 ${errors.cardHolder ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    {errors.cardHolder && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.cardHolder}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-white">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <select
                      value={paymentData.billingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      placeholder="NadPerz"
                      className="shadow-sm border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="shadow-sm border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <Input
                        type="text"
                        value={paymentData.billingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="City"
                        className="shadow-sm border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        value={paymentData.billingAddress.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        placeholder="12345"
                        className="shadow-sm border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4 shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Hotel:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Room:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Check-in:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Check-out:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Guests:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Nights:</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.nights}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-green-600">
                        ${bookingDetails.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {errors.general && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      {errors.general}
                    </div>
                  )}

                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Pay ${bookingDetails.totalPrice.toLocaleString()}
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center">
                      <Shield className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-medium">Secured by 256-bit SSL encryption</span>
                    </div>
                    <div className="text-blue-600 font-medium">💳 Test card: 4242 4242 4242 4242</div>
                    <div>📧 Receipt sent to {paymentData.email}</div>
                    <div className="text-gray-400">
                      Processed by NadPerz • 2025-09-26 10:46:48 UTC
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-6 text-center text-sm text-gray-600 rounded-b-2xl">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">Powered by Stripe</span>
            </div>
            <div>|</div>
            <div>Secure Payment Processing</div>
            <div>|</div>
            <div>NadPerz • 2025-09-26 10:46:48</div>
          </div>
        </div>
      </div>
    </div>
  );
}