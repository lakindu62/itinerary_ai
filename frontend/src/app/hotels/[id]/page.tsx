import { Suspense } from 'react';
import HotelDetailsPage from '@/features/hotel-booking/components/hotels/HotelDetailsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface HotelDetailPageProps {
  params: {
    id: string;
  };
}

export default function HotelDetailPage({ params }: HotelDetailPageProps) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <HotelDetailsPage hotelId={params.id} />
      </Suspense>
    </div>
  );
}