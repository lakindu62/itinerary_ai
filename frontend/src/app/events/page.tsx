'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EventCard from '@/features/event/components/EventCard';
import { getAllEventsPublic } from '@/features/event/lib/event-api';
import { ChevronLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the type for a single event to be used in the component state
type Event = {
  id: string;
  eventName: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('eventName');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEventsPublic();
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

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter(event => {
      if (!searchTerm) return true;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      if (filterType === 'eventName') {
        return event.eventName.toLowerCase().includes(lowerCaseSearchTerm);
      }
      if (filterType === 'location' && event.venue) {
        return event.venue.city.toLowerCase().includes(lowerCaseSearchTerm);
      }
      return false;
    });

    return filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [events, searchTerm, filterType]);


  return (
    <div className="bg-background min-h-screen font-sans">
      <div className="bg-[#E3E2F7] dark:bg-muted/40 px-4 sm:px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-muted-foreground hover:bg-accent"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <main className="bg-card rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            {/* Search and Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search for events..."
                  className="pl-10 text-black dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eventName">Event Name</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {loading && <p className="text-center text-gray-500">Loading events...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {!loading && !error && filteredAndSortedEvents.length === 0 && (
                <p className="text-center text-gray-500">No events found matching your criteria.</p>
              )}
              {!loading && !error && filteredAndSortedEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <EventCard event={event} />
                  {index < filteredAndSortedEvents.length - 1 && (
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