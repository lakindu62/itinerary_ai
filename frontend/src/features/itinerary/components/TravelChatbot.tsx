import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';
import ItineraryDisplay from './ItineraryDisplay';
import { Card } from '@/components/ui/card';

export interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  description: string;
  rating?: number;
  photos?: string[];
  address?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  places: Place[];
}

export interface Itinerary {
  id: string;
  destination: string;
  duration: number;
  days: ItineraryDay[];
  totalPlaces: number;
}

const TravelChatbot = () => {
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <div className="h-screen bg-background">
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
            <Card className="px-4 py-2 ">
              <div className='flex gap-4 items-center justify-center '>
                <span className="text-sm font-medium">{currentItinerary.destination}</span>
                <span className="text-xs text-muted-foreground">{currentItinerary.duration} days • {currentItinerary.totalPlaces} places</span>
              </div> </Card>
          )}
        </div>
      </header>

      <div className="h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={30}>
            <div className="h-full flex flex-col">
              <ChatInterface onItineraryGenerated={setCurrentItinerary} />
              {currentItinerary && (
                <div className="flex-1 border-t" style={{ minHeight: '300px' }}>
                  <ItineraryDisplay
                    itinerary={currentItinerary}
                    onPlaceSelect={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={65} minSize={40}>
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