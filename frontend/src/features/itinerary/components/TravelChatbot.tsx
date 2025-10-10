'use client'
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@frontend/components/ui/resizable';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';
import ItineraryDisplay from './ItineraryDisplay';

import { ActivityDto, ConversationContextDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto'
import { useGetChatItineraryQuery } from '../api/itinerary.api';



// Helper interface for map display
export interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  description: string;
  rating?: number;
  address?: string;
  time?: string;
  estimatedCost?: number;
  duration?: number;
}

const TravelChatbot = ({ id }: { id?: string }) => {
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryDto | null>(null);
  const [context, setContext] = useState<ConversationContextDto>({ stage: 'initial' });
  const [selectedPlace, setSelectedPlace] = useState<ActivityDto | null>(null);
  const { data: itinerary } = useGetChatItineraryQuery(id || '');

  const handleItineraryUpdate = (itinerary: ItineraryDto | null, newContext: ConversationContextDto) => {
    setCurrentItinerary(itinerary);
    setContext(newContext);
  };

  return (
    <div className="h-screen overflow-hidden bg-background">


      <div className="h-[calc(100vh-80px)] border">
        <ResizablePanelGroup className='border' direction="horizontal">
          <ResizablePanel defaultSize={currentItinerary ? 33 : 50} minSize={25}>
            <div className="h-full flex flex-col">
              <ChatInterface
                onItineraryGenerated={handleItineraryUpdate}
                context={context}
                id={id}
              />

            </div>
          </ResizablePanel>
          {itinerary && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={33} minSize={25}>
                <div className="flex-1 border-t h-full" style={{ minHeight: '300px' }}>
                  <ItineraryDisplay
                    itinerary={itinerary}
                    context={context}
                    onPlaceSelect={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                </div>
              </ResizablePanel>
            </>
          )}

          <ResizableHandle />

          <ResizablePanel defaultSize={currentItinerary ? 34 : 50} minSize={25}>
            <MapComponent
              itinerary={itinerary}
              selectedPlace={selectedPlace}
              onPlaceSelect={setSelectedPlace}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TravelChatbot;