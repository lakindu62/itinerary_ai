import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@frontend/components/ui/resizable';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';
import ItineraryDisplay from './ItineraryDisplay';
import { Card } from '@frontend/components/ui/card';
import { ActivityDto, ConversationContextDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto'



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

const TravelChatbot = () => {
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryDto | null>(null);
  const [context, setContext] = useState<ConversationContextDto>({ stage: 'initial' });
  const [selectedPlace, setSelectedPlace] = useState<ActivityDto | null>(null);

  const handleItineraryUpdate = (itinerary: ItineraryDto | null, newContext: ConversationContextDto) => {
    setCurrentItinerary(itinerary);
    setContext(newContext);
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <header className="border-b bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Travel Planner</h1>
              <p className="text-sm text-muted-foreground">AI-powered itinerary generator</p>
            </div>
          </div>
          {currentItinerary && (
            <Card className="px-4 py-2">
              <div className="flex gap-4 items-center justify-center">
                <span className="text-sm font-medium">{context.destination || currentItinerary.title}</span>
                <span className="text-xs text-muted-foreground">
                  {currentItinerary.days.length} days • {currentItinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activities
                </span>
              </div>
            </Card>
          )}
        </div>
      </header>

      <div className="h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={30}>
            <div className="h-full flex flex-col">
              <ChatInterface
                onItineraryGenerated={handleItineraryUpdate}
                context={context}
              />

            </div>
          </ResizablePanel>
          {currentItinerary &&
            <ResizablePanel defaultSize={35} minSize={30}>

              <div className="flex-1 border-t h-full" style={{ minHeight: '300px' }}>
                <ItineraryDisplay
                  itinerary={currentItinerary}
                  context={context}
                  onPlaceSelect={setSelectedPlace}
                  selectedPlace={selectedPlace}
                />
              </div>

            </ResizablePanel>
          }

          <ResizableHandle />

          <ResizablePanel defaultSize={30} minSize={40}>
            <MapComponent
              itinerary={currentItinerary}
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