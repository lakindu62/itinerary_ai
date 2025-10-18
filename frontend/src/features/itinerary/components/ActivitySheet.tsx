import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, DollarSign, Edit3 } from "lucide-react";
import Image from 'next/image';
import { ActivityDto, isEventActivity, isHotelActivity } from '@shared/types/itinerary/chat-itinerary.response.dto';
import Link from 'next/link';
import { useUpdateActivityBudgetMutation } from '../api/itinerary.api';

interface ActivitySheetProps {
    isSheetOpen: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setIsSheetOpen: (open: boolean) => void;
    selectedPlace: ActivityDto;
    itineraryId?: string;
    onPlaceUpdated?: (updated: ActivityDto) => void;
}

const ActivitySheet = ({
    containerRef,
    isSheetOpen,
    setIsSheetOpen,
    selectedPlace,
    itineraryId,
    onPlaceUpdated,
}: ActivitySheetProps) => {
    console.log("🚀 ~ ActivitySheet ~ selectedPlace:", selectedPlace)
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetedAmount, setBudgetedAmount] = useState(selectedPlace?.budgetedAmount || 0);
    const [actualSpend, setActualSpend] = useState(selectedPlace?.actualSpend || 0);

    const [updateActivityBudget, { isLoading: isUpdatingBudget }] = useUpdateActivityBudgetMutation();

    // Keep local form state in sync with the latest selected activity when opening the editor
    useEffect(() => {
        if (!selectedPlace) return;
        if (isEditingBudget) {
            setBudgetedAmount(selectedPlace.budgetedAmount || 0);
            setActualSpend(selectedPlace.actualSpend || 0);
        }
    }, [isEditingBudget, selectedPlace]);

    if (!selectedPlace) return null
    const isHotel = isHotelActivity(selectedPlace);
    const isEvent = isEventActivity(selectedPlace)

    const handleBudgetUpdate = async () => {
        if (!itineraryId) return;

        try {
            // For now, we'll use the activity name as a temporary ID
            // In a real implementation, you'd need to pass the activity ID from the parent component
            await updateActivityBudget({
                itineraryId,
                activityId: selectedPlace.id, // Using name as temporary ID
                budgetData: {
                    budgetedAmount: budgetedAmount || undefined,
                    actualSpend: actualSpend || undefined,
                }
            }).unwrap();
            // Optimistically update parent-selected place so UI reflects latest values immediately
            const updated: ActivityDto = {
                ...selectedPlace,
                budgetedAmount: budgetedAmount || undefined,
                actualSpend: actualSpend || undefined,
            };
            onPlaceUpdated?.(updated);
            setIsEditingBudget(false);
        } catch (error) {
            console.error('Failed to update budget:', error);
        }
    };



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



                    {(isHotelActivity(selectedPlace)) && selectedPlace.additionalDetails.imageUrl && <Image src={selectedPlace.additionalDetails.imageUrl} alt={selectedPlace.name} width={500} height={400} className='rounded-3xl' />}
                    {/* Budget Section */}
                    <div className="mt-4 p-2  rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Budget</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingBudget(!isEditingBudget)}
                                className="flex items-center gap-1"
                            >
                                <Edit3 className="w-3 h-3" />
                                {isEditingBudget ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>

                        {isEditingBudget ? (
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="budgetedAmount" className="text-sm">Budgeted Amount</Label>
                                    <Input
                                        id="budgetedAmount"
                                        type="number"
                                        value={budgetedAmount}
                                        onChange={(e) => setBudgetedAmount(Number(e.target.value))}
                                        placeholder="Enter budgeted amount"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="actualSpend" className="text-sm">Actual Spend</Label>
                                    <Input
                                        id="actualSpend"
                                        type="number"
                                        value={actualSpend}
                                        onChange={(e) => setActualSpend(Number(e.target.value))}
                                        placeholder="Enter actual spend"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleBudgetUpdate}
                                        disabled={isUpdatingBudget}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {isUpdatingBudget ? 'Updating...' : 'Save Budget'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditingBudget(false)}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedPlace.budgetedAmount && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Budgeted:</span>
                                        <span className="text-sm font-medium">${selectedPlace.budgetedAmount}</span>
                                    </div>
                                )}
                                {selectedPlace.actualSpend && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Actual:</span>
                                        <span className="text-sm font-medium">${selectedPlace.actualSpend}</span>
                                    </div>
                                )}
                                {!selectedPlace.budgetedAmount && !selectedPlace.actualSpend && (
                                    <p className="text-sm text-muted-foreground">No budget information available</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Button className='absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-40px)]' variant='outline'>
                    <Link href={isEvent ? `/events/${selectedPlace.additionalDetails.id}` : isHotel ? 'a' : '#'}>
                        {isHotel
                            ? "Book Hotel"
                            : isEvent
                                ? "Buy Tickets"
                                : ""}
                    </Link>
                </Button>

            </SheetContent>
        </Sheet>
    )
}

export default ActivitySheet