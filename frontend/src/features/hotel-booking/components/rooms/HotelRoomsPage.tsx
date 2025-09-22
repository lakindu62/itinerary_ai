"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RoomsList from './RoomsList';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useHotel } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';

interface HotelRoomsPageProps {
  hotelId: string;
}

export default function HotelRoomsPage({ hotelId }: HotelRoomsPageProps) {
  const router = useRouter();
  const { data: hotel, isLoading: hotelLoading } = useHotel(hotelId);
  const { rooms, isLoading: roomsLoading } = useRooms(hotelId);

  if (hotelLoading || roomsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => router.back()} 
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Rooms</h1>
            <p className="text-gray-600">{hotel?.title}</p>
          </div>
        </div>
        
        <Button onClick={() => router.push(`/hotels/${hotelId}/rooms/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Rooms List */}
      <RoomsList hotelId={hotelId} rooms={rooms} showManageActions />
    </div>
  );
}