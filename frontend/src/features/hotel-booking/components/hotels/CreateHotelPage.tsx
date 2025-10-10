"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Plus } from 'lucide-react';
import HotelForm from './HotelForm';
import { useHotels } from '../../hooks/useHotels';

export default function CreateHotelPage() {
  const router = useRouter();
  const { createHotel, isCreating } = useHotels();

  console.log('🏨 Create Hotel Page loaded:', {
    timestamp: '2025-09-25 08:47:17',
    user: 'NadPerz'
  });

  const handleSuccess = () => {
    console.log('✅ Hotel created successfully, redirecting...');
    router.push('/dashboard/hotels');
  };

  const handleCancel = () => {
    console.log('❌ Hotel creation cancelled');
    router.push('/dashboard/hotels');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/hotels')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
          
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Hotel</h1>
          </div>
          
          <p className="text-gray-600">
            Add a new hotel to your portfolio (images stored in hotel-bucket)
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>👤 User: NadPerz</span>
            <span>•</span>
            <span>📅 2025-09-25 08:47:17</span>
            <span>•</span>
            <span>💾 Images stored in hotel-bucket</span>
          </div>
        </div>
        
        {/* Hotel Form - Pass only valid props */}
        <HotelForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}