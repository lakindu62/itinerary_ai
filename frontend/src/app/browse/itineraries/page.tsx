//TODO - Optimise for SEO
'use client'

import React from 'react';
import { MapPin, Calendar, Clock, Hotel, Utensils, MapPinned, Star, Lightbulb } from 'lucide-react';
import { ActivityDto, isHotelActivity, isEventActivity } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { useGetPublicItinerariesQuery } from '@frontend/features/itinerary/api/itinerary.api';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@frontend/components/ui/button';

const Page = () => {
    const { data: publicItineraries, error, isLoading } = useGetPublicItinerariesQuery();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-muted-foreground">Loading itineraries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card rounded-lg shadow-lg p-8 max-w-md border border-border">
                    <div className="text-destructive text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-2">Error Loading Itineraries</h2>
                    <p className="text-muted-foreground">We couldn&apos;t load the public itineraries. Please try again later.</p>
                </div>
            </div>
        );
    }

    if (!publicItineraries || publicItineraries.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <MapPin className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">No Itineraries Yet</h2>
                    <p className="text-muted-foreground">Check back soon for exciting travel plans!</p>
                </div>
            </div>
        );
    }

    const getActivityIcon = (type: ActivityDto['type']) => {
        switch (type) {
            case 'hotel':
                return <Hotel className="w-5 h-5" />;
            case 'restaurant':
                return <Utensils className="w-5 h-5" />;
            case 'attraction':
                return <MapPinned className="w-5 h-5" />;
            case 'event':
                return <Star className="w-5 h-5" />;
            default:
                return <MapPin className="w-5 h-5" />;
        }
    };

    const getActivityColor = (type: ActivityDto['type']) => {
        switch (type) {
            case 'hotel':
                return 'bg-chart-4/10 text-chart-4 border border-chart-4/20';
            case 'restaurant':
                return 'bg-chart-5/10 text-chart-5 border border-chart-5/20';
            case 'attraction':
                return 'bg-chart-2/10 text-chart-2 border border-chart-2/20';
            case 'event':
                return 'bg-chart-1/10 text-chart-1 border border-chart-1/20';
            default:
                return 'bg-muted text-muted-foreground border border-border';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className=" shadow-sm ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* <h1 className="text-4xl font-bold text-card-foreground mb-2">Public Itineraries</h1>
                    <p className="text-lg text-muted-foreground">Discover and explore curated travel experiences</p> */}
                </div>
            </div>

            {/* Itineraries Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {publicItineraries.map((itinerary) => (
                        <div key={itinerary.id} className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border">
                            {/* Itinerary Header */}
                            <div className="bg-primary p-6 text-primary-foreground">
                                <div className='flex justify-between'>
                                    <h2 className="text-2xl font-bold mb-2">{itinerary.title}</h2>
                                    <Link className=' h-fit ' href={`/browse/itineraries/${itinerary.slug}`}>
                                        <Button>View</Button>
                                    </Link>
                                </div>
                                <p className="text-primary-foreground/80 mb-4">{itinerary.summary}</p>
                                <div className="flex items-center gap-4 text-sm">

                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {itinerary.days.length} {itinerary.days.length === 1 ? 'day' : 'days'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Days */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    {itinerary.days.slice(0, 1).map((day) => (
                                        <div key={day.dayNumber} className="border-l-4 border-primary pl-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <h3 className="text-lg font-semibold text-card-foreground">
                                                    Day {day.dayNumber} - {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {day.destination}
                                            </p>

                                            {/* Activities */}
                                            <div className="space-y-3">
                                                {day.activities.slice(0, 2).map((activity, idx) => (
                                                    <div key={idx} className={`rounded-lg p-3 ${getActivityColor(activity.type)}`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 mt-1">
                                                                {getActivityIcon(activity.type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{activity.time}</span>
                                                                </div>
                                                                <h4 className="font-semibold text-sm mb-1">{activity.name}</h4>
                                                                <p className="text-xs mb-1 opacity-90">{activity.description}</p>
                                                                <p className="text-xs opacity-75">{activity.address}</p>

                                                                {/* Additional details for hotel */}
                                                                {isHotelActivity(activity) && activity.additionalDetails.imageUrl && (
                                                                    <div className="mt-2">
                                                                        <Image
                                                                            width={500}
                                                                            height={500}
                                                                            src={activity.additionalDetails.imageUrl}
                                                                            alt={activity.name}
                                                                            className="w-full h-32 object-cover rounded"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Additional details for event */}
                                                                {isEventActivity(activity) && (
                                                                    <div className="mt-2 text-xs">
                                                                        {activity.additionalDetails.startDate && (
                                                                            <p>
                                                                                <span className="font-medium">Event Date: </span>
                                                                                {activity.additionalDetails.startDate}
                                                                                {activity.additionalDetails.endDate && ` - ${activity.additionalDetails.endDate}`}
                                                                            </p>
                                                                        )}
                                                                        {activity.additionalDetails.startTime && (
                                                                            <p>
                                                                                <span className="font-medium">Time: </span>
                                                                                {activity.additionalDetails.startTime}
                                                                                {activity.additionalDetails.endTime && ` - ${activity.additionalDetails.endTime}`}
                                                                            </p>
                                                                        )}
                                                                        {activity.additionalDetails.imageUrl && (
                                                                            <Image
                                                                                width={500}
                                                                                height={500}
                                                                                src={activity.additionalDetails.imageUrl}
                                                                                alt={activity.name}
                                                                                className="w-full h-32 object-cover rounded mt-2"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {day.activities.length > 2 && (
                                                    <div className="flex items-center justify-between mt-3 px-2">
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            and {day.activities.length - 2} more, {day.activities.length} activities in total
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tips Section */}
                                {itinerary.tips && itinerary.tips.length > 0 && (
                                    <div className="mt-6 bg-chart-4/10 border border-chart-4/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb className="w-5 h-5 text-chart-4" />
                                            <h4 className="font-semibold text-card-foreground">Travel Tips</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {itinerary.tips.map((tip, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="text-chart-4 font-bold">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;