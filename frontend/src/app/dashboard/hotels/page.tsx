import { Suspense } from 'react';
import DashboardHotelsPage from '@/features/hotel-booking/components/dashboard/DashboardHotelsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function DashboardHotelsPageRoute() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardHotelsPage />
    </Suspense>
  );
}