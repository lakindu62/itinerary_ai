import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"

export function ItinerarySettings() {
    const [selectedVisibility, setSelectedVisibility] = useState<string | undefined>(undefined);
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button className='bg-black/5 dark:bg-white/5' size="icon" variant="ghost" aria-label="Settings">
                    <Settings className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 " align="start">
                <DropdownMenuItem className="flex justify-between">
                    <div>Privacy</div>
                    <div><SelectDemo selectedVisibility={selectedVisibility} setSelectedVisibility={setSelectedVisibility} /></div>
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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ItineraryVisibilityDto } from "@shared/types/itinerary/chat-itinerary.response.dto"

import { useState } from "react"
import { Badge } from "@frontend/components/ui/badge";

export function SelectDemo({ selectedVisibility, setSelectedVisibility }) {

    console.log("🚀 ~ SelectDemo ~ selectedVisibility:", selectedVisibility)

    return (
        <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
        >
            <SelectTrigger
                style={{ backgroundColor: 'transparent' }}
                className="w-[100px] py-0 my-0 text-xs text-white bg-transparent rounded-full"
                icon={null}
            >
                <SelectValue defaultChecked defaultValue={ItineraryVisibilityDto.PRIVATE} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.entries(ItineraryVisibilityDto).map(([key, value]) => (
                        <SelectItem value={value} key={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
