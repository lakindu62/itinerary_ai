import { Suspense } from 'react';
import ReservationsOverview from '@/features/hotel-booking/components/reservations/ReservationsOverview';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function ReservationsPage() {
  console.log('📅 Loading Reservations Page for NadPerz at 2025-09-27 01:20:40');
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReservationsOverview />
    </Suspense>
  );
}