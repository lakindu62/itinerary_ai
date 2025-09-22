import { Suspense } from 'react';
import EditHotelPage from '@/features/hotel-booking/components/hotels/EditHotelPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface EditHotelPageProps {
  params: {
    id: string;
  };
}

export default function EditHotelPageRoute({ params }: EditHotelPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <EditHotelPage hotelId={params.id} />
      </Suspense>
    </div>
  );
}