"use client";

import { Download, Share2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDesignLoadingProps {
    className?: string;
}

export default function TripDesignLoading({ className }: TripDesignLoadingProps) {
    return (
        <div className={cn(
            "h-full flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-b ",
            className
        )}>
            {/* Profile Picture */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <video
                        autoPlay
                        muted
                        loop
                        className="absolute rounded-full inset-0 w-full h-full object-cover"
                    >
                        <source src="/home/homepage-bg-video.mp4" type="video/mp4" />
                    </video>
                </div>

            </div>

            {/* Main Text */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-200 mb-3">
                    Designing your trip...
                </h1>
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
            </div>

            {/* Feature List */}
            <div className="space-y-5 text-center">
                {/* Hidden gems - very faint */}
                <div className="flex items-center justify-center space-x-3 text-gray-300 opacity-30">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Add hidden gems, not tourist traps</span>
                </div>

                {/* Download PDF - clearer */}
                <div className="flex items-center justify-center space-x-3 text-gray-500">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download itinerary pdf</span>
                </div>

                {/* Share - clearer */}
                <div className="flex items-center justify-center space-x-3 text-gray-500">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share with your companions</span>
                </div>

                {/* Save time - clearer */}
                <div className="flex items-center justify-center space-x-3 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Save hours of planning</span>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"
                    style={{ width: '60%' }} />
            </div>
        </div>
    );
}
