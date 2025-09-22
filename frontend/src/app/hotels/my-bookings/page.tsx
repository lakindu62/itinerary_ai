import { Suspense } from 'react';
import MyBookingsPage from '@/features/hotel-booking/components/bookings/MyBookingsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function MyBookingsPageRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <MyBookingsPage />
      </Suspense>
    </div>
  );
}