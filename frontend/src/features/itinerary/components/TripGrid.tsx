import React from 'react';
import { ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { TripCard } from './TripCard';

interface TripGridProps {
  itineraries: ItineraryDto[];
}

export const TripGrid: React.FC<TripGridProps> = ({ itineraries }) => {
  if (itineraries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
        <p className="text-gray-600">Start planning your next adventure!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {itineraries.map((itinerary) => (
        <TripCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
};
