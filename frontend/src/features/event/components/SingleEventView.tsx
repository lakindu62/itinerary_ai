'use client';

import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon, User, Building, Mail, Phone } from 'lucide-react';
import { DateTime } from 'luxon';
import { getSignedGetUrl } from '@/lib/media.api';
import { SingleEventType } from '../lib/event-api';
import OrderSummaryCard from './OrderSummaryCard';
import { Badge } from '@/components/ui/badge';


type SingleEventViewProps = {
  event: SingleEventType;
};

const SingleEventView: React.FC<SingleEventViewProps> = ({ event }) => {
  const [imageSignedUrl, setImageSignedUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (event.imagesUrl?.[0]) {
        try {
          const url = await getSignedGetUrl(event.imagesUrl[0]);
          setImageSignedUrl(url);
        } catch (error) {
          console.error('Failed to get signed image URL', error);
        } finally {
          setImageLoading(false);
        }
      } else {
        setImageLoading(false);
      }
    };
    fetchImageUrl();
  }, [event.imagesUrl]);

  const formattedDate = DateTime.fromISO(event.startDate).toFormat('MMMM d, yyyy');
  const formattedTime = `${DateTime.fromISO(event.startTime).toFormat('h:mm a')} - ${DateTime.fromISO(event.endTime).toFormat('h:mm a')}`;

  // Construct Google Maps URL using coordinates
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
  const mapSrc = event.venue.coordinates
    ? `https://www.google.com/maps/embed/v1/view?key=${mapsApiKey}&center=${event.venue.coordinates.lat},${event.venue.coordinates.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(event.venue.address)}`;

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      {/* Image Header */}
      <div className="w-full h-48 md:h-96 rounded-lg bg-muted mb-8 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Image...</div>
        ) : imageSignedUrl ? (
          <img src={imageSignedUrl} alt={event.eventName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Category Badge */}
          {event.category && 
            <Badge variant="default" className="mb-2 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300">
              {event.category.categoryName}
            </Badge>
          }
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{event.eventName}</h1>
          
          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.hashtags?.map((hashtag) => (
              hashtag && (
                  <Badge key={hashtag.id} variant="secondary">#{hashtag.hashtagName}</Badge>
              )
            ))}
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">{event.description}</p>
          
          {/* Event Details Section */}
          <div className="space-y-6 text-muted-foreground border-t border-border pt-6">
            <div className="flex items-start gap-4">
              <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <span className="text-foreground font-semibold">Date and Time</span>
                <p>{formattedDate} at {formattedTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <span className="text-foreground font-semibold">Location</span>
                <p>{event.venue.venueName}, {event.venue.city}</p>
                <p className="text-sm">{event.venue.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <span className="text-foreground font-semibold">About the Organizer</span>
                <p className="flex items-center gap-2"><Building className="w-4 h-4" /> {event.organizer.organization || event.organizer.organizerName}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {event.organizer.contactEmail}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {event.organizer.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* Location Map Section */}
          {/* <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Location Map</h2>
            <div className="rounded-lg overflow-hidden border">
                <iframe
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={mapSrc}>
                </iframe>
            </div>
          </div> */}

        </div>

        {/* Right Column */}
        <div className="w-full">
          <OrderSummaryCard eventId={event.id} ticketPrice={event.ticketPrice} maxAttendees={event.maxAttendees} />
        </div>
      </div>
    </div>
  );
};

export default SingleEventView;