import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,


} from "@/components/ui/sheet";
import { MapPin, Clock } from "lucide-react";
import Image from 'next/image';
import { ActivityDto, isEventActivity, isHotelActivity } from '@shared/types/itinerary/chat-itinerary.response.dto';
import Link from 'next/link';

interface ActivitySheetProps {
    isSheetOpen: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setIsSheetOpen: (open: boolean) => void;
    selectedPlace: ActivityDto;
    mapPanelWidth?: number;
}

const ActivitySheet = ({
    containerRef,
    isSheetOpen,
    setIsSheetOpen,
    selectedPlace,
    mapPanelWidth,
}: ActivitySheetProps) => {
    if (!selectedPlace) return null
    const isHotel = isHotelActivity(selectedPlace);
    const isEvent = isEventActivity(selectedPlace)



    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} >
            {/* Styled overlay */}
            <SheetContent
                container={containerRef}
                overlayClassName='bg-transparent'
                side='bottom'
                className="rounded-t-3xl max-w-none sm:max-w-none p-6 h-[93vh]"

            >
                <div className='bg-gray-900 w-14 h-1.5 absolute top-2 left-1/2 -translate-x-1/2 rounded-full'></div>
                <SheetHeader>
                    <SheetTitle>{selectedPlace?.name || 'Details'}</SheetTitle>
                    {selectedPlace?.description && (
                        <SheetDescription>{selectedPlace.description}</SheetDescription>
                    )}
                </SheetHeader>

                <div className="mt-4 grid gap-2   text-sm">
                    {selectedPlace?.address && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedPlace.address}</span>
                        </div>

                    )}
                    {selectedPlace?.time && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedPlace.time}</span>
                        </div>
                    )}
                    {(isHotelActivity(selectedPlace) || isEventActivity(selectedPlace)) && selectedPlace.additionalDetails.imageUrl && <Image src={selectedPlace.additionalDetails.imageUrl} alt={selectedPlace.name} width={500} height={400} className='rounded-3xl' />}

                </div>
                <Link href={isEvent ? `/events/${selectedPlace.additionalDetails.id}` : isHotel ? 'a' : '#'}>
                    {isHotel
                        ? "Book Hotel"
                        : isEvent
                            ? "Buy Tickets"
                            : ""}
                </Link>

            </SheetContent>
        </Sheet>
    )
}

export default ActivitySheet