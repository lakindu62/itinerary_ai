import { Suspense } from 'react';
import AllBookingsPage from '@/features/hotel-booking/components/bookings/AllBookingsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function BookingsPageRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <AllBookingsPage />
      </Suspense>
    </div>
  );
}