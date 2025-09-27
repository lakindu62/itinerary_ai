'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { 
  Star, 
  Reply, 
  Flag, 
  Eye, 
  EyeOff,
  ThumbsUp,
  MessageSquare,
  User,
  Calendar,
  Filter
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface Review {
  id: string
  customerName: string
  customerEmail?: string
  rating: number
  title: string
  comment: string
  createdAt: string
  isApproved: boolean
  isPublic: boolean
  businessReply?: string
  repliedAt?: string
  helpful: number
  orderNumber?: string
  category: 'food' | 'service' | 'ambiance' | 'overall'
  photos?: string[]
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=user_123')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      } else {
        console.error('Failed to load reviews')
        setReviews([])
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (reviewId: string, reply: string) => {
    setLoading(true)
    try {
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              businessReply: reply,
              repliedAt: new Date().toISOString()
            }
          : review
      ))
      toast.success('Reply posted successfully!')
      setReplyDialogOpen(false)
      setReplyText('')
      setSelectedReview(null)
    } catch (error) {
      console.error('Error posting reply:', error)
      toast.error('Failed to post reply')
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (reviewId: string, isApproved: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isApproved: !isApproved }
        : review
    ))
    toast.success(`Review ${!isApproved ? 'approved' : 'rejected'}!`)
  }

  const togglePublic = async (reviewId: string, isPublic: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isPublic: !isPublic }
        : review
    ))
    toast.success(`Review ${!isPublic ? 'made public' : 'made private'}!`)
  }

  const openReplyDialog = (review: Review) => {
    setSelectedReview(review)
    setReplyText(review.businessReply || '')
    setReplyDialogOpen(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStatusColor = (isApproved: boolean, isPublic: boolean) => {
    if (!isApproved) return 'destructive'
    if (isPublic) return 'default'
    return 'secondary'
  }

  const getStatusText = (isApproved: boolean, isPublic: boolean) => {
    if (!isApproved) return 'Pending'
    if (isPublic) return 'Public'
    return 'Private'
  }

  const filteredReviews = reviews.filter(review => {
    if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) return false
    if (filterStatus !== 'all') {
      if (filterStatus === 'approved' && !review.isApproved) return false
      if (filterStatus === 'pending' && review.isApproved) return false
      if (filterStatus === 'public' && !review.isPublic) return false
      if (filterStatus === 'private' && review.isPublic) return false
    }
    if (filterCategory !== 'all' && review.category !== filterCategory) return false
    return true
  })

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <p className="text-gray-600">Manage customer reviews and ratings</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{averageRating}</p>
              </div>
              <div className="flex">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{reviews.filter(r => !r.isApproved).length}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">
                  {reviews.length > 0 
                    ? Math.round((reviews.filter(r => r.businessReply).length / reviews.length) * 100)
                    : 0}%
                </p>
              </div>
              <Reply className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="ambiance">Ambiance</SelectItem>
            <SelectItem value="overall">Overall</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.customerName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.orderNumber && (
                        <>
                          <span>•</span>
                          <span>Order #{review.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {review.category}
                  </Badge>
                  <Badge variant={getStatusColor(review.isApproved, review.isPublic)}>
                    {getStatusText(review.isApproved, review.isPublic)}
                  </Badge>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className="font-semibold">{review.title}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {review.businessReply && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Reply className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">Business Reply</span>
                    <span className="text-xs text-gray-500">
                      {review.repliedAt && new Date(review.repliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.businessReply}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful} helpful</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleApproval(review.id, review.isApproved)}
                  >
                    {review.isApproved ? 'Reject' : 'Approve'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublic(review.id, review.isPublic)}
                  >
                    {review.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReplyDialog(review)}
                  >
                    <Reply className="h-4 w-4" />
                    {review.businessReply ? 'Edit Reply' : 'Reply'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-gray-600">No reviews match your current filters</p>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReview?.businessReply ? 'Edit Reply' : 'Reply to Review'}
            </DialogTitle>
            <DialogDescription>
              Respond to {selectedReview?.customerName}'s review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {selectedReview && renderStars(selectedReview.rating)}
                </div>
                <span className="font-semibold">{selectedReview?.title}</span>
              </div>
              <p className="text-sm text-gray-700">{selectedReview?.comment}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank you for your feedback..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedReview && handleReply(selectedReview.id, replyText)}
                disabled={!replyText.trim() || loading}
              >
                {loading ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}