import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { useRouter } from 'next/navigation';

interface TripCardProps {
  itinerary: ItineraryDto;
}

export const TripCard: React.FC<TripCardProps> = ({ itinerary }) => {
  const router = useRouter();

  const handleClick = () => {
    console.log("🚀 ~ handleClick ~ itinerary:", itinerary)
    if (itinerary.id) {
      router.push(`/chat/${itinerary.id}`);
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        {/* Placeholder for image - using a simple gray rectangle with icon */}
        <div className="w-full h-48 bg-gray-100 border-b flex items-center justify-center">
          <div className="text-gray-400">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {itinerary.title || 'Untitled Trip'}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {itinerary.summary || 'No summary available'}
        </p>
      </CardContent>
    </Card>
  );
};
