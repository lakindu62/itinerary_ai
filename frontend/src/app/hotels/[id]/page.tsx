"use client";

import { useParams } from 'next/navigation';
import { useHotel } from '@/features/hotel-booking/hooks/useHotels';
import HotelDetailsPage from '@/features/hotel-booking/components/hotels/HotelDetailsPage';

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.id as string;
  
  console.log('🔍 DEBUGGING - Hotel Detail Page Loading');
  console.log('🔍 Hotel ID from params:', hotelId);
  console.log('🔍 Current URL:', window.location.href);
  console.log('🔍 This should show HOTEL DETAILS, not room creation');
  
  const { data: hotel, isLoading, error } = useHotel(hotelId);

  console.log('🔍 Hotel data:', { hotel, isLoading, error });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h2 className="font-bold text-yellow-800">DEBUG INFO:</h2>
        <p className="text-yellow-700">Hotel ID: {hotelId}</p>
        <p className="text-yellow-700">Page: Hotel Details (should NOT be room creation)</p>
        <p className="text-yellow-700">Hotel Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p className="text-yellow-700">Hotel Found: {hotel ? 'Yes' : 'No'}</p>
      </div>
       */}
      <HotelDetailsPage 
        hotel={hotel} 
        isLoading={isLoading} 
        error={error}
      />
    </div>
  );
}