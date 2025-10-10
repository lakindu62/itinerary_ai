import { Suspense } from 'react';
import ReservationDetails from '@/features/hotel-booking/components/reservations/ReservationDetails';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface ReservationDetailPageProps {
  params: {
    id: string;
  };
}

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  console.log('📋 Loading Reservation Details Page for NadPerz:', {
    reservationId: params.id.slice(-8),
    timestamp: '2025-09-27 04:31:28',
    user: 'NadPerz'
  });
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReservationDetails reservationId={params.id} />
    </Suspense>
  );
}