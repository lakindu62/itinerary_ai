import { Suspense } from 'react';
import CancellationProcess from '@/features/hotel-booking/components/reservations/CancellationProcess';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface CancelReservationPageProps {
  params: {
    id: string;
  };
}

export default function CancelReservationPage({ params }: CancelReservationPageProps) {
  console.log('❌ Loading Cancel Reservation Page for NadPerz:', {
    reservationId: params.id.slice(-8),
    timestamp: '2025-09-27 05:03:24',
    user: 'NadPerz'
  });
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CancellationProcess reservationId={params.id} />
    </Suspense>
  );
}