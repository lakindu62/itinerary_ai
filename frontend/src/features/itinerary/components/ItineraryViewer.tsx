'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@frontend/components/ui/resizable';
import ItineraryDisplay from './ItineraryDisplay';
import MapComponent from './MapComponent';
import { ActivityDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { useGetPublicItineraryBySlugQuery } from '../api/itinerary.api';

interface ItineraryViewerProps {
    itinerarySlug: string;

}

const ItineraryViewer: React.FC<ItineraryViewerProps> = ({
    itinerarySlug,

}) => {
    const { data: itinerary, error, isLoading } = useGetPublicItineraryBySlugQuery(itinerarySlug);


    const [selectedPlace, setSelectedPlace] = useState<ActivityDto | null>(null);
    const mapPanelRef = useRef<HTMLDivElement | null>(null);
    const [mapPanelWidth, setMapPanelWidth] = useState<number>(0);

    // Observe map panel width to size the Sheet to remaining viewport width
    useEffect(() => {
        if (!mapPanelRef.current) return;
        const element = mapPanelRef.current;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setMapPanelWidth(width);
            }
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    if (isLoading) return <div>Loading itinerary...</div>;
    if (error) return <div>Error loading itinerary.</div>;
    if (!itinerary) return <div>No itinerary found for slug: {itinerarySlug}</div>;
    return (
        <div className={`h-full bg-card pt-2 rounded-t-3xl`}>
            <div className="h-full bg-card rounded-[30px]">
                <ResizablePanelGroup className='border bg-background  rounded-[30px]' direction="horizontal">
                    {/* Itinerary Panel */}
                    <ResizablePanel defaultSize={50} minSize={25}>
                        <div className="flex-1  bg-card h-full" style={{ minHeight: '300px' }}>
                            <ItineraryDisplay
                                itinerary={itinerary!}
                                context={undefined}
                                onPlaceSelect={setSelectedPlace}
                                selectedPlace={selectedPlace}
                                mapPanelWidth={mapPanelWidth}
                            />
                        </div>
                    </ResizablePanel>

                    {/* Resizable Handle */}
                    <ResizableHandle />

                    {/* Map Panel */}
                    <ResizablePanel
                        onResize={(e) => setMapPanelWidth(e)}
                        defaultSize={50}
                        minSize={25}
                    >
                        <div className="h-full" ref={mapPanelRef}>
                            <MapComponent
                                itinerary={itinerary}
                                selectedPlace={selectedPlace}
                                onPlaceSelect={setSelectedPlace}
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default ItineraryViewer;
