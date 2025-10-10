
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EventCard from '@/features/event/components/EventCard';
import { getEvents } from '@/features/event/lib/event-api';
import { ChevronLeft } from 'lucide-react';

// Define the type for a single event to be used in the component state
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
  eventStatus: 'active' | 'inactive' | 'completed';
};

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getEvents();
        setEvents(eventsData as Event[]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="bg-[#E3E2F7] px-4 sm:px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-700 hover:bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <main className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            <div className="space-y-6">
              {loading && <p className="text-center text-gray-500">Loading events...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {!loading && !error && events.length === 0 && (
                <p className="text-center text-gray-500">No events found.</p>
              )}
              {!loading && !error && events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <EventCard event={event} />
                  {index < events.length - 1 && (
                    <hr className="border-t border-purple-200 my-6" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
