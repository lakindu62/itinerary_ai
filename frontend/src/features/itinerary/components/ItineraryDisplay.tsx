import React, { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Download, Settings, Share2 } from 'lucide-react';


import { ActivityDto, ConversationContextDto, isEventActivity, isHotelActivity, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import Image from 'next/image';
import ActivitySheet from './ActivitySheet';
import { ItinerarySettings } from './ItinerarySettings';

interface ItineraryDisplayProps {
  itinerary: ItineraryDto;
  context?: ConversationContextDto;
  onPlaceSelect: (activity: ActivityDto | null) => void;
  selectedPlace: ActivityDto | null;
  mapPanelWidth?: number;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  context,
  onPlaceSelect,
  selectedPlace,
  mapPanelWidth
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  // Remove expandedDays, setExpandedDays, toggleDayExpansion
  const [showAllTips, setShowAllTips] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Convert activity to place for map selection (no shape change needed)
  const convertActivityToPlace = (activity: ActivityDto): ActivityDto => activity;

  const handleActivityClick = (activity: ActivityDto, dayNumber: number, activityIndex: number) => {
    const place = convertActivityToPlace(activity);
    onPlaceSelect(place);
    setSelectedKey(`${dayNumber}-${activityIndex}`);
    setIsSheetOpen(true);
  };

  return (
    <ScrollArea ref={containerRef} className="flex-1 h-full relative ">
      <div className="h-full flex flex-col bg-background border-none">
        <div className="p-4 border  m-4 pt-4 pb-10 pl-6 pr-4 rounded-3xl">
          <div className='flex justify-between '>
            <div></div>
            {/* Icons for Share, Download, and Settings */}
            <div className="flex items-center gap-3 mb-4">
              <Button className='bg-black/5 dark:bg-white/5' size="icon" variant="ghost" aria-label="Share">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button className='bg-black/5 dark:bg-white/5' size="icon" variant="ghost" aria-label="Download">
                <Download className="w-5 h-5" />
              </Button>
              <ItinerarySettings />
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-xl">{itinerary.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{itinerary.summary}</p>

          {context?.destination && (
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{context.destination}</span>
              {/* <span>•</span> */}
              <span>{itinerary.days.length} days</span>
              <span>•</span>
              <span>{itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activities</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Accommodation */}
          {itinerary.days.some(day => day.activities.some(activity => activity.type === 'hotel')) && (
            <Card className="p-3 bg-blue-950">
              <h4 className="font-medium text-sm text-gray-300 mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Accommodation
              </h4>
              <p className="text-xs text-gray-400">{itinerary.accommodation}</p>
            </Card>
          )}

          {/* Days */}
          <div className="space-y-3">
            {itinerary.days.map((day) => (
              <Card key={day.dayNumber} className="overflow-hidden rounded-3xl">
                <div className="p-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                          {day.dayNumber}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Day {day.dayNumber}</h3>
                        {day.date && (
                          <p className="text-xs text-muted-foreground">{day.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {day.activities.length} activities
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t bg-muted/20">
                  <div className="p-3 space-y-2">
                    {day.activities.map((activity, activityIndex) => (
                      <Card
                        key={activityIndex}
                        className={`p-3 cursor-pointer transition-all hover:shadow-sm ${selectedKey === `${day.dayNumber}-${activityIndex}`
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                          }`}
                        onClick={() => handleActivityClick(activity, day.dayNumber, activityIndex)}
                      >
                        <div className="flex items-start space-x-3">
                          {(isHotelActivity(activity) || isEventActivity(activity)) && (
                            <div className="flex-shrink-0 mt-1">
                              <Image
                                className="rounded-lg"
                                width={100}
                                height={100}
                                alt={activity.name || 'activity image'}
                                src={activity.additionalDetails.imageUrl || '/images/placeholder.svg'}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="font-medium text-sm line-clamp-1">
                                {activity.name}
                              </h5>
                            </div>

                            <p className="text-xs text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            <div className='flex justify-between'>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {activity.address}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className=" text-xs border border-blue-800 ">
                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tips */}
          {itinerary.tips.length > 0 && (
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Travel Tips</h4>
                {itinerary.tips.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTips(!showAllTips)}
                    className="text-xs h-auto p-1"
                  >
                    {showAllTips ? 'Show Less' : `Show All ${itinerary.tips.length}`}
                  </Button>
                )}
              </div>
              <ul className="space-y-2">
                {(showAllTips ? itinerary.tips : itinerary.tips.slice(0, 3))
                  .map((tip, index) => (
                    <li key={index} className="flex text-xs">
                      <span className="text-muted-foreground mr-2 flex-shrink-0">•</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Minimal shadcn Sheet opened on activity click */}
      <div className=''>
        <ActivitySheet
          containerRef={containerRef}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          selectedPlace={selectedPlace!}
          mapPanelWidth={mapPanelWidth}
        />
      </div>
    </ScrollArea >
  );
};

export default ItineraryDisplay;