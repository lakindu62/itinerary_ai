import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, ChevronDown, ChevronUp, DollarSign, Users } from 'lucide-react';

import { ActivityDto, ConversationContextDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';




interface ItineraryDisplayProps {
  itinerary: ItineraryDto;
  context: ConversationContextDto;
  onPlaceSelect: (activity: ActivityDto | null) => void;
  selectedPlace: ActivityDto | null;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  context,
  onPlaceSelect,
  selectedPlace
}) => {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1])); // First day expanded by default
  const [showAllTips, setShowAllTips] = useState(false);

  const toggleDayExpansion = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };



  // Convert activity to place for map selection
  const convertActivityToPlace = (activity: ActivityDto, dayNumber: number, activityIndex: number): ActivityDto => ({
    id: `${dayNumber}-${activityIndex}`,
    name: activity.name,
    type: activity.name,
    coordinates: activity.coordinates,
    description: activity.description,
    address: activity.address,
    time: activity.time,
  });




  const handleActivityClick = (activity: ActivityDto, dayNumber: number, activityIndex: number) => {
    const place = convertActivityToPlace(activity, dayNumber, activityIndex);
    onPlaceSelect(place);
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="h-full flex flex-col bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">{itinerary.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{itinerary.summary}</p>

          {context.destination && (
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{context.destination}</span>
              <span>•</span>
              <span>{itinerary.days.length} days</span>
              <span>•</span>
              <span>{itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activities</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Accommodation */}
          {itinerary.accommodation && (
            <Card className="p-3 bg-blue-50/50">
              <h4 className="font-medium text-sm text-gray-800 mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Accommodation
              </h4>
              <p className="text-xs text-gray-600">{itinerary.accommodation}</p>
            </Card>
          )}

          {/* Days */}
          <div className="space-y-3">
            {itinerary.days.map((day) => (
              <Card key={day.dayNumber} className="overflow-hidden">
                <div
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleDayExpansion(day.dayNumber)}
                >
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
                      {expandedDays.has(day.dayNumber) ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedDays.has(day.dayNumber) && (
                  <div className="border-t bg-muted/20">
                    <div className="p-3 space-y-2">
                      {day.activities.map((activity, activityIndex) => (
                        <Card
                          key={activityIndex}
                          className={`p-3 cursor-pointer transition-all hover:shadow-sm ${selectedPlace?.id === `${day.dayNumber}-${activityIndex}`
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                            }`}
                          onClick={() => handleActivityClick(activity, day.dayNumber, activityIndex)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h5 className="font-medium text-sm line-clamp-1">
                                  {activity.name}
                                </h5>

                              </div>

                              <p className="text-xs text-muted-foreground mb-2">
                                {activity.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {activity.address}
                                  </span>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
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
    </ScrollArea>
  );
};

export default ItineraryDisplay;