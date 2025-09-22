import { Suspense } from 'react';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hotels-specific header/nav can go here */}
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </div>
  );
}