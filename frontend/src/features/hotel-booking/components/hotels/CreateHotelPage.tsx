"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import HotelForm from './HotelForm';
import { useHotels } from '../../hooks/useHotels';

export default function CreateHotelPage() {
  const router = useRouter();
  const { createHotel } = useHotels();

  const handleSuccess = () => {
    router.push('/dashboard/hotels');
  };

  const handleSubmit = async (data: any) => {
    await createHotel(data);
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
          <h1 className="text-3xl font-bold text-gray-800">Create New Hotel</h1>
          <p className="text-gray-600">Add a new hotel to your portfolio</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <HotelForm 
            onSuccess={handleSuccess}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}