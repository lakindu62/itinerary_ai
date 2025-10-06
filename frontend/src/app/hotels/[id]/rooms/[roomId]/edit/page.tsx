"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '@/features/hotel-booking/hooks/useRooms';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import RoomForm from '@/features/hotel-booking/components/rooms/RoomForm';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bed } from 'lucide-react';

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string; // hotel_1758728256298_xe3lzcniw
  const roomId = params.roomId as string; // room_1758736640894_2okk0iq4

  console.log('🏠 Edit Room Page DEBUG:', { 
    hotelId, 
    roomId, 
    url: window.location.href,
    params: params 
  });

  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { data: room, isLoading: isLoadingRoom, error: roomError } = useRoom(roomId);

  const handleSuccess = () => {
    console.log('✅ Room updated successfully, returning to hotel details');
    router.push(`/hotels/${hotelId}`);
  };

  const handleCancel = () => {
    console.log('❌ Room edit cancelled, returning to hotel details');
    router.push(`/hotels/${hotelId}`);
  };

  if (isLoadingHotel || isLoadingRoom) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading room details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Room Not Found</h1>
            <p className="text-gray-600 mb-4">
              Could not find room with ID: {roomId}
            </p>
            <Button onClick={() => router.push(`/hotels/${hotelId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotel Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h1>
            <Button onClick={() => router.push('/dashboard/hotels')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/hotels/${hotelId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {hotel.title}
          </Button>
          
          <div className="flex items-center space-x-2 mb-2">
            <Bed className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
          </div>
          
          <p className="text-gray-600">
            Update &quot;{room.title}&quot; in {hotel.title}
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>👤 User: NadPerz</span>
            <span>•</span>
            <span>📅 September 24, 2025</span>
            <span>•</span>
            <span>⏰ 18:31 UTC</span>
            <span>•</span>
            <span>💾 Images stored in room-bucket</span>
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🔍 DEBUG INFO:</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>Hotel ID:</strong> {hotelId}</p>
            <p><strong>Room ID:</strong> {roomId}</p>
            <p><strong>Hotel Found:</strong> {hotel ? 'Yes' : 'No'}</p>
            <p><strong>Room Found:</strong> {room ? 'Yes' : 'No'}</p>
            <p><strong>Expected:</strong> Room Edit Form (NOT Hotel Edit Form)</p>
          </div>
        </div>
        
        <RoomForm
          selectedHotelId={hotelId}
          hotelId={hotelId}
          room={room} // Pass existing room for editing
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}