"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Shield, Loader2 } from 'lucide-react';
import StripeProvider from './StripeProvider';
import CheckoutForm from './CheckoutForm';
import { useCreatePaymentIntentMutation } from '../../services/api/hotelBookingApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  bookingDetails 
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (isOpen) {
      createPaymentIntent({ amount: bookingDetails.totalPrice * 100 })
        .unwrap()
        .then((response) => setClientSecret(response.clientSecret))
        .catch((error) => console.error('Failed to create payment intent:', error));
    }
  }, [isOpen, bookingDetails.totalPrice, createPaymentIntent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Complete Your Payment</h2>
            <p className="text-gray-600 mt-1">Secure checkout powered by Stripe</p>
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
            <div className="space-y-8">
              {clientSecret ? (
                <StripeProvider>
                  <CheckoutForm />
                </StripeProvider>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </div>

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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-6 text-center text-sm text-gray-600 rounded-b-2xl">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
