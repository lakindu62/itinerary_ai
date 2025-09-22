import { Suspense } from 'react';
import ConflictsPage from '@/features/hotel-booking/components/bookings/ConflictsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function ConflictsPageRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <ConflictsPage />
      </Suspense>
    </div>
  );
}