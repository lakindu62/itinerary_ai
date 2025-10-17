'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, User, Calendar, CheckCircle, X, Reply, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API functions - replace with actual API calls
const mockCommentsApi = {
  getComments: async () => {
    // Mock data
    return [
      {
        id: '1',
        userName: 'Alice Johnson',
        userEmail: 'alice@example.com',
        content: 'Love this place! The atmosphere is amazing.',
        parentCommentId: null,
        isApproved: true,
        createdAt: new Date().toISOString(),
        replies: [
          {
            id: '3',
            userName: 'Business Owner',
            userEmail: 'owner@business.com',
            content: 'Thank you so much for your kind words!',
            parentCommentId: '1',
            isApproved: true,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2',
        userName: 'Bob Wilson',
        userEmail: 'bob@example.com',
        content: 'Great food, but the service could be improved.',
        parentCommentId: null,
        isApproved: false,
        createdAt: new Date().toISOString(),
        replies: []
      }
    ];
  },
  approveComment: async (id: string) => {
    return { success: true };
  },
  rejectComment: async (id: string) => {
    return { success: true };
  },
  deleteComment: async (id: string) => {
    return { success: true };
  },
  replyToComment: async (data: { parentCommentId: string; content: string }) => {
    return { success: true };
  }
};

interface Comment {
  id: string;
  userName: string;
  userEmail: string;
  content: string;
  parentCommentId: string | null;
  isApproved: boolean;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentsManager() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'approved' | 'pending'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['business-comments'],
    queryFn: mockCommentsApi.getComments,
    retry: 1,
  });

  const approveMutation = useMutation({
    mutationFn: mockCommentsApi.approveComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments'] });
      toast.success('Comment approved successfully');
    },
    onError: () => toast.error('Failed to approve comment'),
  });

  const rejectMutation = useMutation({
    mutationFn: mockCommentsApi.rejectComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments'] });
      toast.success('Comment rejected successfully');
    },
    onError: () => toast.error('Failed to reject comment'),
  });

  const deleteMutation = useMutation({
    mutationFn: mockCommentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: () => toast.error('Failed to delete comment'),
  });

  const replyMutation = useMutation({
    mutationFn: mockCommentsApi.replyToComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments'] });
      setReplyingTo(null);
      setReplyContent('');
      toast.success('Reply posted successfully');
    },
    onError: () => toast.error('Failed to post reply'),
  });

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    replyMutation.mutate({
      parentCommentId: commentId,
      content: replyContent
    });
  };

  const filteredComments = comments.filter((comment: Comment) => {
    if (selectedTab === 'approved') return comment.isApproved;
    if (selectedTab === 'pending') return !comment.isApproved;
    return true;
  });

  const totalApproved = comments.filter((c: Comment) => c.isApproved).length;
  const totalPending = comments.filter((c: Comment) => !c.isApproved).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading comments</div>
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
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <X className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Reply className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comments.length > 0 
                ? Math.round((comments.filter((c: Comment) => c.replies && c.replies.length > 0).length / comments.length) * 100)
                : 0
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comments Management</CardTitle>
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
            {filteredComments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments found for the selected filter.
              </div>
            ) : (
              filteredComments.map((comment: Comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{comment.userName}</span>
                          <Badge variant={comment.isApproved ? 'default' : 'secondary'}>
                            {comment.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!comment.isApproved && (
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate(comment.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectMutation.mutate(comment.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {comment.isApproved ? 'Unapprove' : 'Reject'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(comment.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm">{comment.content}</p>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                            disabled={replyMutation.isPending}
                          >
                            {replyMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Reply className="h-4 w-4 mr-1" />
                            )}
                            Post Reply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Show Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {comment.replies.map((reply: Comment) => (
                          <div key={reply.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-3 w-3" />
                              <span className="text-sm font-medium">{reply.userName}</span>
                              <Badge variant="outline" className="text-xs">Reply</Badge>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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