'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById } from '@/features/event/lib/event-api'; // Your existing function
import SingleEventView from '@/features/event/components/SingleEventView';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// 1. DEFINE the detailed type here, inside the page file.
type SingleEventType = {
  id: string;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  imagesUrl?: string[];
  venue: { venueName: string; address: string; city: string; state: string; zipCode: string; };
  organizer: { organizerName: string; };
  category: { categoryName: string; };
  hashtags: { hashtag: { name:string } }[];
  ticketPrice: number;
  eventStatus: 'active' | 'inactive' | 'completed';
};

const SingleEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // 2. USE the new type for your component's state.
  const [event, setEvent] = useState<SingleEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          // 3. CAST the result to your new type using "as".
          const eventData = await getEventById(id) as SingleEventType;
          setEvent(eventData);
        } catch (err) {
          setError('Failed to load event. It may not exist or an error occurred.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  return (
    <div className="bg-[#E3E2F7] min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-gray-700 hover:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        {loading && <div className="text-center py-10">Loading Event...</div>}
        {error && <div className="text-center py-10 text-red-600 bg-white rounded-xl p-8">{error}</div>}
        {!loading && event && (
          <SingleEventView event={event} />
        )}
      </div>
    </div>
  );
};

export default SingleEventPage;