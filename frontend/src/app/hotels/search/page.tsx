import { Suspense } from 'react';
import HotelSearch from '@/features/hotel-booking/components/hotels/HotelSearch';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

interface SearchPageProps {
  searchParams: {
    city?: string;
    country?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <HotelSearch initialParams={searchParams} />
      </Suspense>
    </div>
  );
}