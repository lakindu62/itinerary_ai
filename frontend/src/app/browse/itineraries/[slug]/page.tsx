
import React from "react";
import { useGetPublicItineraryBySlugQuery } from "@/features/itinerary/api/itinerary.api";
import ItineraryViewer from "@frontend/features/itinerary/components/ItineraryViewer";

interface PageProps {
    params: { slug: string };
}

const Page = async ({ params }: PageProps) => {
    const { slug } = await params;
    

    return (
        <div className="h-[calc(100vh-70px)]">
            <ItineraryViewer itinerarySlug={slug} />
        </div>
    );
};

export default Page;