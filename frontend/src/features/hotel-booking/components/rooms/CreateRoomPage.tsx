"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RoomForm from './RoomForm';
import { useRooms } from '../../hooks/useRooms';

interface CreateRoomPageProps {
  hotelId: string;
}

export default function CreateRoomPage({ hotelId }: CreateRoomPageProps) {
  const router = useRouter();
  const { createRoom } = useRooms(hotelId);

  const handleSuccess = () => {
    router.push(`/hotels/${hotelId}/rooms`);
  };

  const handleSubmit = async (data: any) => {
    await createRoom({ ...data, hotelId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-800">Create New Room</h1>
          <p className="text-gray-600">Add a new room to your hotel</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <RoomForm 
            hotelId={hotelId}
            onSuccess={handleSuccess}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}