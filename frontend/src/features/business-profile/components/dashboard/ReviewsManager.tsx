'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarIcon, Loader2, MessageCircle, User, Calendar, CheckCircle, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API functions - replace with actual API calls
const mockReviewsApi = {
  getReviews: async () => {
    // Mock data
    return [
      {
        id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        rating: 5,
        title: 'Excellent Service!',
        content: 'Had an amazing experience. The food was delicious and the service was outstanding.',
        isApproved: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        rating: 4,
        title: 'Great Place',
        content: 'Really enjoyed our visit. Will definitely come back.',
        isApproved: false,
        createdAt: new Date().toISOString()
      }
    ];
  },
  approveReview: async (id: string) => {
    // Mock approval
    return { success: true };
  },
  rejectReview: async (id: string) => {
    // Mock rejection
    return { success: true };
  },
  deleteReview: async (id: string) => {
    // Mock deletion
    return { success: true };
  }
};

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsManager() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'approved' | 'pending'>('all');
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['business-reviews'],
    queryFn: mockReviewsApi.getReviews,
    retry: 1,
  });

  const approveMutation = useMutation({
    mutationFn: mockReviewsApi.approveReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-reviews'] });
      toast.success('Review approved successfully');
    },
    onError: () => toast.error('Failed to approve review'),
  });

  const rejectMutation = useMutation({
    mutationFn: mockReviewsApi.rejectReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-reviews'] });
      toast.success('Review rejected successfully');
    },
    onError: () => toast.error('Failed to reject review'),
  });

  const deleteMutation = useMutation({
    mutationFn: mockReviewsApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-reviews'] });
      toast.success('Review deleted successfully');
    },
    onError: () => toast.error('Failed to delete review'),
  });

  const filteredReviews = reviews.filter((review: Review) => {
    if (selectedTab === 'approved') return review.isApproved;
    if (selectedTab === 'pending') return !review.isApproved;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading reviews</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter((r: Review) => r.isApproved).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <X className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter((r: Review) => !r.isApproved).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews Management</CardTitle>
            <div className="flex gap-2">
              {(['all', 'approved', 'pending'] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={selectedTab === tab ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reviews found for the selected filter.
              </div>
            ) : (
              filteredReviews.map((review: Review) => (
                <Card key={review.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{review.userName}</span>
                          <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!review.isApproved && (
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate(review.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectMutation.mutate(review.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {review.isApproved ? 'Unapprove' : 'Reject'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(review.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{review.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}