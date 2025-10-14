'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventByIdPublic, SingleEventType } from '@/features/event/lib/event-api';
import SingleEventView from '@/features/event/components/SingleEventView';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const SingleEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<SingleEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const eventData = await getEventByIdPublic(id) as SingleEventType;
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