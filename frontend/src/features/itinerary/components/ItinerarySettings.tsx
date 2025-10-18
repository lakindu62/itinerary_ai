import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,

    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import { useUpdateItineraryVisibilityMutation } from "@/features/itinerary/api/itinerary.api"
import { ItineraryVisibilityEnum } from "@shared/types/itinerary/chat-itinerary.response.dto"
import { useEffect, useState } from "react"

export function ItinerarySettings({ itineraryId, visibility }: { itineraryId: string, visibility?: string }) {
    console.log("🚀 ~ ItinerarySettings ~ itineraryId:", itineraryId)
    const [selectedVisibility, setSelectedVisibility] = useState<string | undefined>(visibility ?? ItineraryVisibilityEnum.PRIVATE);
    const [updateVisibility] = useUpdateItineraryVisibilityMutation();

    useEffect(() => {
        setSelectedVisibility(visibility ?? ItineraryVisibilityEnum.PRIVATE);
    }, [visibility]);
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button className='bg-black/5 dark:bg-white/5' size="icon" variant="ghost" aria-label="Settings" disabled={!itineraryId}>
                    <Settings className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 " align="start">
                <DropdownMenuItem className="flex justify-between">
                    <div>Privacy</div>
                    <div><SelectDemo selectedVisibility={selectedVisibility!} defaultVisibility={visibility ?? ItineraryVisibilityEnum.PRIVATE} setSelectedVisibility={async (v: string) => {
                        setSelectedVisibility(v);
                        try {
                            await updateVisibility({ itineraryId, visibility: v as ItineraryVisibilityEnum }).unwrap();
                        } catch {
                            // no toast per requirement
                        }
                    }} /></div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,

    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// uses ItineraryVisibilityEnum from top-level import


export function SelectDemo({
    selectedVisibility,
    setSelectedVisibility,
    defaultVisibility,
}: {
    selectedVisibility: string | undefined,
    setSelectedVisibility: (v: string) => void,
    defaultVisibility: string
}) {

    console.log("🚀 ~ SelectDemo ~ selectedVisibility:", selectedVisibility)

    return (
        <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
        >
            <SelectTrigger
                style={{ backgroundColor: 'transparent' }}
                className="w-[100px] py-0 my-0 text-xs text-white bg-transparent rounded-full"

            >
                <SelectValue defaultChecked defaultValue={defaultVisibility || ItineraryVisibilityEnum.PRIVATE} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.entries(ItineraryVisibilityEnum).map(([key, value]) => (
                        <SelectItem value={value} key={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
