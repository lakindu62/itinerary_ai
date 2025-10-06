import { Suspense } from 'react';
import RoomForm from '@/features/hotel-booking/components/rooms/RoomForm';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface CreateRoomPageProps {
  params: {
    id: string; // Hotel ID
  };
}

export default function CreateRoomPage({ params }: CreateRoomPageProps) {
  console.log('🏠 Room Creation Page - Hotel ID:', params.id);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Room</h1>
          <p className="text-gray-600 mt-2">
            Add a new room to this hotel (images stored in room-bucket)
          </p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <RoomForm selectedHotelId={params.id} hotelId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}