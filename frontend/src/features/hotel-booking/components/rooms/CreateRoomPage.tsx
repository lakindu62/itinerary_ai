"use client";

import { useParams, useRouter } from 'next/navigation';
import { useHotel } from '../../hooks/useHotels';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bed, Plus } from 'lucide-react';
import RoomForm from './RoomForm';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function CreateRoomPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string; // Get hotel ID from URL params

  console.log('🏠 Create Room Page loaded:', {
    hotelId,
    timestamp: '2025-09-25 08:47:17',
    user: 'NadPerz'
  });

  const { data: hotel, isLoading, error } = useHotel(hotelId);

  const handleSuccess = () => {
    console.log('✅ Room created successfully, redirecting...');
    router.push(`/hotels/${hotelId}`);
  };

  const handleCancel = () => {
    console.log('❌ Room creation cancelled');
    router.push(`/hotels/${hotelId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-4">
              The hotel you're trying to add a room to doesn't exist.
            </p>
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Room</h1>
          </div>
          
          <p className="text-gray-600">
            Add a new room to "{hotel.title}" (images stored in room-bucket)
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>👤 User: NadPerz</span>
            <span>•</span>
            <span>📅 2025-09-25 08:47:17</span>
            <span>•</span>
            <span>🏨 Hotel: {hotel.title}</span>
            <span>•</span>
            <span>📍 {hotel.city}, {hotel.country}</span>
          </div>
        </div>
        
        {/* Room Form - Pass correct props */}
        <RoomForm
          selectedHotelId={hotelId} // Use correct prop name
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}