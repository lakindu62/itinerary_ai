'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getCategoryById } from '@/features/event/lib/event-api';
import CategoryForm from '@/features/event/categories/CategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

const EditCategoryPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!getToken) return;
      try {
        setLoading(true);
        const data = await getCategoryById(id, getToken);
        setCategory(data);
      } catch (err) {
        setError('Failed to load category.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, getToken]);

  const handleSuccess = () => {
    router.push('/admin/event/categories');
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
          <CardTitle>{category ? 'Edit Category' : 'Create Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading category...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <CategoryForm category={category || undefined} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategoryPage;
