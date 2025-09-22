"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentSuccessPageProps {
  bookingId?: string;
  paymentIntentId?: string;
}

export default function PaymentSuccessPage({ bookingId, paymentIntentId }: PaymentSuccessPageProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="p-12">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">Your booking has been confirmed</p>
            </div>

            {bookingId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-mono font-bold">{bookingId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/hotels/my-bookings')}>
                <Download className="mr-2 h-4 w-4" />
                View My Bookings
              </Button>
              <Button variant="outline" onClick={() => router.push('/hotels')}>
                <Home className="mr-2 h-4 w-4" />
                Back to Hotels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}