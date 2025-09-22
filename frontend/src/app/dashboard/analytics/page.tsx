import { Suspense } from 'react';
import AnalyticsPage from '@/features/hotel-booking/components/dashboard/AnalyticsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function AnalyticsPageRoute() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnalyticsPage />
    </Suspense>
  );
}