"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentPageProps {
  bookingId?: string;
}

export default function PaymentPage({ bookingId }: PaymentPageProps) {
  const router = useRouter();

  if (!bookingId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Payment Request</h1>
        <p className="text-gray-600 mb-8">No booking ID provided</p>
        <Button onClick={() => router.push('/hotels')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => router.back()} 
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Complete Payment</h1>
          <p className="text-gray-600">Booking ID: {bookingId}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Payment integration coming soon...</p>
              <p className="text-sm text-gray-400">Stripe integration will be implemented here</p>
              <Button 
                className="mt-6"
                onClick={() => router.push(`/payment/success?bookingId=${bookingId}`)}
              >
                Simulate Payment Success
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}