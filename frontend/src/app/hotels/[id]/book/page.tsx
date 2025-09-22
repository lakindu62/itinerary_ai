import { Suspense } from 'react';
import BookingPage from '@/features/hotel-booking/components/bookings/BookingPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface BookHotelPageProps {
  params: {
    id: string;
  };
  searchParams: {
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function BookHotelPage({ params, searchParams }: BookHotelPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <BookingPage 
          hotelId={params.id}
          roomId={searchParams.roomId}
          checkIn={searchParams.checkIn}
          checkOut={searchParams.checkOut}
          guests={searchParams.guests}
        />
      </Suspense>
    </div>
  );
}