'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getHashtagById } from '@/features/event/lib/event-api';
import HashtagForm from '@/features/event/hashtags/HashtagForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Hashtag {
  id: string;
  hashtagName: string;
}

const EditHashtagPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [hashtag, setHashtag] = useState<Hashtag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHashtag = async () => {
      if (!getToken) return;
      try {
        setLoading(true);
        const data = await getHashtagById(id, getToken);
        setHashtag(data);
      } catch (err) {
        setError('Failed to load hashtag.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHashtag();
    }
  }, [id, getToken]);

  const handleSuccess = () => {
    router.push('/admin/event/hashtags');
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
          <CardTitle>{hashtag ? 'Edit Hashtag' : 'Create Hashtag'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading hashtag...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <HashtagForm hashtag={hashtag || undefined} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditHashtagPage;
