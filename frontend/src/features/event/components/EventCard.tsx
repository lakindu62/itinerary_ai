
'use client';

import { getSignedGetUrl } from '@/lib/media.api';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DateTime } from 'luxon';

// Define the type for a single event based on expected data structure
type Event = {
  id: string;
  eventName: string;
  description: string;
  startDate: string;
  startTime: string;
  imagesUrl?: string[];
  venue?: {
    venueName: string;
    city: string;
    state: string;
  };
  ticketPrice: number;
  eventStatus: 'active' | 'inactive' | 'completed'; // Example statuses
};

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format date and time using Luxon
  const formattedDateTime = DateTime.fromISO(event.startDate)
    .set({ hour: parseInt(event.startTime.split(':')[0]), minute: parseInt(event.startTime.split(':')[1]) })
    .toFormat("EEE, MMM d - h:mm a ZZZZ");

  const [imageSignedUrl, setImageSignedUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (event.imagesUrl?.[0]) {
        setImageLoading(true);
        setImageError(false);
        try {
          const url = await getSignedGetUrl(event.imagesUrl[0]);
          setImageSignedUrl(url);
        } catch (error) {
          console.error('Failed to get signed image URL', error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      } else {
        setImageLoading(false); // No image to load
      }
    };

    fetchImageUrl();
  }, [event.imagesUrl]);

  const getStatusBadge = () => {
    try {
      const now = DateTime.now();
      const start = DateTime.fromISO(`${event.startDate}T${event.startTime}`);
      const end = DateTime.fromISO(`${event.endDate}T${event.endTime}`);

      if (!start.isValid || !end.isValid) {
        return <Badge variant="outline">Scheduled</Badge>;
      }

      if (now < start) {
        if (event.eventStatus === 'inactive') {
          return <Badge className="bg-purple-100 text-purple-800">Almost Full</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      }
      
      if (now >= start && now < end) {
        return <Badge className="bg-red-100 text-red-800">Happening Now</Badge>;
      }
      
      return <Badge variant="secondary">Completed</Badge>;

    } catch (e) {
      console.error("Error determining event time status:", e);
      return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full items-center">
      {/* Event Image Container */}
      <div className="w-full md:w-1/3 flex-shrink-0 p-4">
        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Loading...</div>
          )}
          {!imageLoading && (imageError || !imageSignedUrl) && (
            <div className="w-full h-full flex items-center justify-center">
              <img src="/images/placeholder.svg" alt="Placeholder" className="w-full h-full object-cover" />
            </div>
          )}
          {!imageLoading && !imageError && imageSignedUrl && (
            <img
              src={imageSignedUrl}
              alt={event.eventName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      {/* Event Info */}
      <div className="flex-1 flex flex-col justify-between p-6 pt-0 md:pt-6 self-stretch">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{event.eventName}</h2>
            {getStatusBadge()}
          </div>
          <p className="text-gray-600 mb-4">{event.description}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            <p>{formattedDateTime}</p>
            <p>{event.venue?.city || 'Online'}</p>
            <p className="font-semibold">{event.ticketPrice > 0 ? `From Rs.${event.ticketPrice}` : 'Free'}</p>
          </div>
          <Button className="bg-[#5B30D6] hover:bg-[#4a26b3] text-white font-bold rounded-lg px-6">
            Get Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
