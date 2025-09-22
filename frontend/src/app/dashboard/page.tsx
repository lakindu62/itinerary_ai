import { Suspense } from 'react';
import DashboardOverview from '@/features/hotel-booking/components/dashboard/DashboardOverview';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardOverview />
    </Suspense>
  );
}