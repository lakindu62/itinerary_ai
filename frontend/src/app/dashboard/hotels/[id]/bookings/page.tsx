import { Suspense } from 'react';
import HotelBookingManagement from '@/features/hotel-booking/components/bookings/HotelBookingManagement';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface HotelBookingsPageProps {
  params: {
    id: string;
  };
}

export default function HotelBookingsPage({ params }: HotelBookingsPageProps) {
  console.log(`🏨 Loading Hotel Bookings for ${params.id} - NadPerz at 2025-09-27 01:20:40`);
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HotelBookingManagement hotelId={params.id} />
    </Suspense>
  );
}