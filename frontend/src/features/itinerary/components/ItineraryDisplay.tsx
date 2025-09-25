import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { Itinerary, Place } from './TravelChatbot';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onPlaceSelect: (place: Place) => void;
  selectedPlace: Place | null;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  onPlaceSelect,
  selectedPlace
}) => {
  const getPlaceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'restaurant': 'bg-accent text-accent-foreground',
      'attraction': 'bg-primary text-primary-foreground',
      'museum': 'bg-travel-green text-travel-green-foreground',
      'park': 'bg-travel-green text-travel-green-foreground',
      'shopping': 'bg-secondary text-secondary-foreground',
      'entertainment': 'bg-accent text-accent-foreground',
      'default': 'bg-muted text-muted-foreground'
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Your Itinerary</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {itinerary.destination} • {itinerary.duration} days
        </p>
      </div>

      <ScrollArea className="flex-1 h-10">
        <div className="p-4 space-y-6">
          {itinerary.days.map((day) => (
            <div key={day.day} className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {day.day}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{day.title}</h3>
              </div>

              <div className="space-y-2 ml-4">
                {day.places.map((place, index) => (
                  <Card
                    key={place.id}
                    className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlace?.id === place.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onPlaceSelect(place)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm truncate pr-2">
                            {place.name}
                          </h4>
                          {place.rating && (
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">
                                {place.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPlaceTypeColor(place.type)}`}
                          >
                            {place.type}
                          </Badge>
                          {place.address && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground truncate">
                                {place.address}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {place.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {place.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total places:</span>
          <span className="font-medium">{itinerary.totalPlaces}</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;