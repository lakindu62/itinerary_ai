import React from 'react';
import SharedItinerary from '@frontend/features/itinerary/components/SharedItinerary';

interface PageProps {
  params: { token: string };
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { token } = await params;
  return (
    <SharedItinerary token={token} />
  )
};

export default Page;


