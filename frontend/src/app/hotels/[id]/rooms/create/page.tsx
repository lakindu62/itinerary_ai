import { Suspense } from 'react';
import CreateRoomPage from '@/features/hotel-booking/components/rooms/CreateRoomPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface CreateRoomPageProps {
  params: {
    id: string;
  };
}

export default function CreateRoomPageRoute({ params }: CreateRoomPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <CreateRoomPage hotelId={params.id} />
      </Suspense>
    </div>
  );
}