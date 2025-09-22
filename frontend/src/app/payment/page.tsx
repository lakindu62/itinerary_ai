import { Suspense } from 'react';
import PaymentPage from '@/features/hotel-booking/components/payments/PaymentPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface PaymentPageProps {
  searchParams: {
    bookingId?: string;
  };
}

export default function PaymentPageRoute({ searchParams }: PaymentPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentPage bookingId={searchParams.bookingId} />
      </Suspense>
    </div>
  );
}