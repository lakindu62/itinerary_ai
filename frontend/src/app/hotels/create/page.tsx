import { Suspense } from 'react';
import HotelForm from '@/features/hotel-booking/components/hotels/HotelForm';
import ApiTest from '@/components/debug/ApiTest';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function CreateHotelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Hotel</h1>
          <p className="text-gray-600 mt-2">
            Add a new hotel property to your portfolio
          </p>
        </div>
        
        {/* Temporary API Test - Remove this after testing */}
        {/* <div className="mb-6">
          <ApiTest />
        </div> */}
        
        <Suspense fallback={<LoadingSpinner />}>
          <HotelForm />
        </Suspense>
      </div>
    </div>
  );
}



// TODO: Add Clerk auth protection
// import { auth } from '@clerk/nextjs';
// import { redirect } from 'next/navigation';

  // TODO: Uncomment when Clerk is ready
  // const { userId } = auth();
  // if (!userId) {
  //   redirect('/sign-in');
  // }