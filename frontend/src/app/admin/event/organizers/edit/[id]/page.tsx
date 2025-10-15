'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getOrganizerById } from '@/features/event/lib/event-api';
import OrganizerForm from '@/features/event/organizers/OrganizerForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const EditOrganizerPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!getToken) return;
      try {
        setLoading(true);
        const data = await getOrganizerById(id, getToken);
        setOrganizer(data);
      } catch (err) {
        setError('Failed to load organizer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrganizer();
    }
  }, [id, getToken]);

  const handleSuccess = () => {
    router.push('/admin/event/organizers');
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
          <CardTitle>{organizer ? 'Edit Organizer' : 'Create Organizer'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading organizer...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <OrganizerForm organizer={organizer || undefined} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOrganizerPage;
