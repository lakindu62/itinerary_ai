import { Suspense } from 'react';
import CreateHotelPage from '@/features/hotel-booking/components/hotels/CreateHotelPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

// TODO: Add Clerk auth protection
// import { auth } from '@clerk/nextjs';
// import { redirect } from 'next/navigation';

export default async function CreateHotelPageRoute() {
  // TODO: Uncomment when Clerk is ready
  // const { userId } = auth();
  // if (!userId) {
  //   redirect('/sign-in');
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <CreateHotelPage />
      </Suspense>
    </div>
  );
}