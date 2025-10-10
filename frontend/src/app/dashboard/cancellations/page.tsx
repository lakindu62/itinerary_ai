import { Suspense } from 'react';
import CancellationManagement from '@/features/hotel-booking/components/cancellations/CancellationManagement';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function CancellationsPage() {
  console.log('❌ Loading Cancellations Management for NadPerz at 2025-09-27 01:20:40');
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CancellationManagement />
    </Suspense>
  );
}