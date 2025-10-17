'use client'
import React from 'react'
import { useGetItineraryByTokenQuery } from '../api/itinerary.api';
import ItineraryViewer from './ItineraryViewer';

const SharedItinerary = ({ token }: { token: string }) => {
    const { data: itinerary, isLoading, error } = useGetItineraryByTokenQuery(token);
    console.log("🚀 ~ Page ~ itinerary:", itinerary?.slug)

    if (isLoading) return <div className="h-[calc(100vh-70px)] flex items-center justify-center">Loading itinerary...</div>;
    if (error) return <div className="h-[calc(100vh-70px)] flex items-center justify-center">Failed to load shared itinerary.</div>;
    if (!itinerary) return <div className="h-[calc(100vh-70px)] flex items-center justify-center">Itinerary not found.</div>;

    return (
        <div className="h-[calc(100vh-70px)]">
            <ItineraryViewer itinerary={itinerary} />
        </div>
    );
}

export default SharedItinerary