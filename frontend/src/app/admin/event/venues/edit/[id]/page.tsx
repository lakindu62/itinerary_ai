'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getVenueById } from '@/features/event/lib/event-api';
import VenueForm from '@/features/event/venues/VenueForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Venue {
  id: string;
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  coordinates: [number, number];
  facilities: string[];
}

const EditVenuePage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!getToken) return;
      try {
        setLoading(true);
        const data = await getVenueById(id, getToken);
        setVenue(data);
      } catch (err) {
        setError('Failed to load venue.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id, getToken]);

  const handleSuccess = () => {
    router.push('/admin/event/venues');
  };

  return (
    <div className="min-h-screen p-4">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-700 hover:bg-gray-200"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{venue ? 'Edit Venue' : 'Create Venue'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading venue...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <VenueForm venue={venue || undefined} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVenuePage;
