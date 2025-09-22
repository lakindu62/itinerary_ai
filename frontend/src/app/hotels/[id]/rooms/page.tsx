import { Suspense } from 'react';
import HotelRoomsPage from '@/features/hotel-booking/components/rooms/HotelRoomsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface HotelRoomsPageProps {
  params: {
    id: string;
  };
}

export default function HotelRoomsPageRoute({ params }: HotelRoomsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <HotelRoomsPage hotelId={params.id} />
      </Suspense>
    </div>
  );
}