'use client';

import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      {/* Image Header */}
      <div className="w-full h-48 md:h-100 rounded-lg bg-gray-200 mb-8 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Image...</div>
        ) : imageSignedUrl ? (
          <img src={imageSignedUrl} alt={event.eventName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.eventName}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {event.hashtags?.map(({ hashtag }) => (
              hashtag && (
                  <Badge key={hashtag.name} variant="secondary">#{hashtag.name}</Badge>
                       )
            ))}
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>
          
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-5 h-5 text-purple-600" />
              <span>{event.venue.venueName}, {event.venue.city}</span>
            </div>
          </div>
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