import React from 'react'
import { useGetPublicItineraryBySlugQuery } from "@/features/itinerary/api/itinerary.api";
import ItineraryViewer from './ItineraryViewer';

const PublicItinerary = ({ slug }: { slug: string }) => {

    const { data } = useGetPublicItineraryBySlugQuery(slug);

    if (!data) { return <div>No Itinerary</div> }
    return (
        <ItineraryViewer itinerary={data} />
    )
}

export default PublicItinerary