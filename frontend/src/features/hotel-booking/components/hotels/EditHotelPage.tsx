"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import HotelForm from './HotelForm';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useHotel, useHotels } from '../../hooks/useHotels';

interface EditHotelPageProps {
  hotelId: string;
}

export default function EditHotelPage({ hotelId }: EditHotelPageProps) {
  const router = useRouter();
  const { data: hotel, isLoading } = useHotel(hotelId);
  const { updateHotel } = useHotels();

  const handleSuccess = () => {
    router.push('/dashboard/hotels');
  };

  const handleSubmit = async (data: any) => {
    await updateHotel({ id: hotelId, data });
  };

  if (isLoading) return <LoadingSpinner />;

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Hotel not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Edit Hotel</h1>
          <p className="text-gray-600">{hotel.title}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <HotelForm 
            initialData={hotel}
            isEdit={true}
            hotelId={hotelId}
            onSuccess={handleSuccess}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}