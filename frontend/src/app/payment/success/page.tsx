import { Suspense } from 'react';
import PaymentSuccessPage from '@/features/hotel-booking/components/payments/PaymentSuccessPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface PaymentSuccessProps {
  searchParams: {
    bookingId?: string;
    paymentIntentId?: string;
  };
}

export default function PaymentSuccessPageRoute({ searchParams }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentSuccessPage 
          bookingId={searchParams.bookingId}
          paymentIntentId={searchParams.paymentIntentId}
        />
      </Suspense>
    </div>
  );
}