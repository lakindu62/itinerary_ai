'use client';

import React from 'react';
import { TripGrid } from '@/features/itinerary/components/TripGrid';
import { useGetMyItinerariesQuery } from '@/features/itinerary/api/itinerary.api';

const MyTripsPage = () => {
    const { data: itineraries, isLoading, error } = useGetMyItinerariesQuery({});

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Trips</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                            <div className="p-4 bg-white rounded-b-lg">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Trips</h1>
                <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading trips</h3>
                    <p className="text-gray-600">Something went wrong. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Trips</h1>
            <TripGrid itineraries={itineraries || []} />
        </div>
    );
};

export default MyTripsPage;