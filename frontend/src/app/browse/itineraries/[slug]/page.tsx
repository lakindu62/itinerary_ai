
import React from "react";
import PublicItinerary from "@frontend/features/itinerary/components/PublicItinerary";

interface PageProps {
    params: { slug: string };
}

const Page = async ({ params }: PageProps) => {
    const { slug } = await params;


    return (
        <div className="h-[calc(100vh-70px)]">
            <PublicItinerary slug={slug} />
        </div>
    );
};

export default Page;