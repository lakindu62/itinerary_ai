"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '../../hooks/useRooms'; // Fixed import path
import { useHotel } from '../../hooks/useHotels'; // Fixed import path
import BookingForm from './BookingForm';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bed } from 'lucide-react';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  
  const hotelId = params.hotelId as string;
  const roomId = params.roomId as string;

  console.log('📅 Booking Page loaded:', {
    hotelId,
    roomId,
    timestamp: '2025-09-25 09:09:07',
    user: 'NadPerz'
  });

  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { data: room, isLoading: isLoadingRoom, error: roomError } = useRoom(roomId);

  const handleSuccess = () => {
    console.log('✅ Booking completed successfully:', {
      hotelId,
      roomId,
      timestamp: '2025-09-25 09:09:07',
      user: 'NadPerz'
    });
    router.push(`/bookings/confirmation?hotelId=${hotelId}&roomId=${roomId}`);
  };

  const handleCancel = () => {
    console.log('❌ Booking cancelled:', {
      hotelId,
      roomId,
      timestamp: '2025-09-25 09:09:07',
      user: 'NadPerz'
    });
    router.push(`/hotels/${hotelId}`);
  };

  if (isLoadingHotel || isLoadingRoom) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading booking details...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 09:09:07</p>
          </div>
        </div>
      </div>
    );
  }

  if (roomError || !hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Not Available</h1>
            <p className="text-gray-600 mb-2">
              {!hotel ? 'Hotel not found' : !room ? 'Room not found' : 'Unable to load booking details'}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Error occurred at: 2025-09-25 09:09:07 | User: NadPerz
            </p>
            <Button onClick={() => router.push('/hotels')}>
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
            <h1 className="text-3xl font-bold text-gray-900">Book Room</h1>
          </div>
          
          <p className="text-gray-600">
            Booking "{room.title}" at {hotel.title}
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>👤 User: NadPerz</span>
            <span>•</span>
            <span>📅 2025-09-25 09:09:07</span>
            <span>•</span>
            <span>🏨 Hotel: {hotel.title}</span>
            <span>•</span>
            <span>🏠 Room: {room.title}</span>
          </div>
        </div>
        
        {/* Room Details Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Room Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{room.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{room.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span>{room.guestCount} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beds:</span>
                  <span>{room.bedCount} bed{room.bedCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span>{room.bathroomCount} bathroom{room.bathroomCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night:</span>
                  <span className="font-semibold text-green-600">${room.roomPrice}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Room Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {room.freeWifi && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📶 WiFi</span>
                )}
                {room.tv && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">📺 TV</span>
                )}
                {room.airCondition && (
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">❄️ AC</span>
                )}
                {room.balcony && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">🏞️ Balcony</span>
                )}
                {room.roomService && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">🛎️ Room Service</span>
                )}
                {room.cityView && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">🏙️ City View</span>
                )}
                {room.oceanView && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌊 Ocean View</span>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <p>Room ID: {room.id.slice(-8)}</p>
                <p>Hotel: {hotel.title}</p>
                <p>Location: {hotel.city}, {hotel.state}, {hotel.country}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <BookingForm
          roomId={roomId}
          hotelId={hotelId}
          roomPrice={room.roomPrice}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
        
        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white rounded-lg border text-center">
          <p className="text-xs text-gray-500">
            Booking session started by NadPerz at 2025-09-25 09:09:07 UTC
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Hotel ID: {hotel.id.slice(-8)} | Room ID: {room.id.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}