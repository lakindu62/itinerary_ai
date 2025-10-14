import { Suspense } from 'react';

export default function DashboardReviewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Reviews page coming soon!</div>
    </Suspense>
  );
}