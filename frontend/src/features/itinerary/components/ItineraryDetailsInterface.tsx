import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { ConversationContextDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import ItineraryDisplay from './ItineraryDisplay';
const ItineraryDetailsInterface = ({
    itinerary,
    context,
    onPlaceSelect,
    selectedPlace,
    mapPanelWidth
}: {
    itinerary: ItineraryDto;
    context?: ConversationContextDto;
    onPlaceSelect: (activity: ActivityDto | null) => void;
    selectedPlace: ActivityDto | null;
    mapPanelWidth?: number;
}) => {


    return (
        <div><Tabs defaultValue="account" className="w-full">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="flex-1  h-50" style={{ minHeight: '300px' }}>
                <ItineraryDisplay
                    itinerary={itinerary}
                    context={context}
                    onPlaceSelect={onPlaceSelect}
                    selectedPlace={selectedPlace}
                    mapPanelWidth={mapPanelWidth}
                />
            </TabsContent>
        </Tabs></div>
    )
}
export default ItineraryDetailsInterface