import { Suspense } from 'react';
import EditReservation from '@/features/hotel-booking/components/reservations/EditReservation';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface EditReservationPageProps {
  params: {
    id: string;
  };
}

export default function EditReservationPage({ params }: EditReservationPageProps) {
  console.log('✏️ Loading Edit Reservation Page for NadPerz:', {
    reservationId: params.id.slice(-8),
    timestamp: '2025-09-27 04:47:50',
    user: 'NadPerz'
  });
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditReservation reservationId={params.id} />
    </Suspense>
  );
}