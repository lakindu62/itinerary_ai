import { Suspense } from 'react';
import EditHotelPage from '@/features/hotel-booking/components/hotels/EditHotelPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface EditHotelRouteProps {
  params: {
    id: string;
  };
}

export default function EditHotelRoute({ params }: EditHotelRouteProps) {
  console.log('✏️ Edit Hotel Route loaded:', {
    hotelId: params.id,
    timestamp: '2025-09-26 11:51:53',
    user: 'NadPerz'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading hotel editor...</p>
          <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-26 11:51:53</p>
        </div>
      }>
        {/* Your existing EditHotelPage component doesn't need hotelId prop 
            because it gets it from useParams() internally */}
        <EditHotelPage />
      </Suspense>
    </div>
  );
}