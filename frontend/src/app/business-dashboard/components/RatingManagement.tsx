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
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  ThumbsUp, 
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'
import { sendReviewApprovalNotification, getApprovalMessage } from '@/lib/notifications'

interface Rating {
  id: string
  customerName: string
  customerEmail?: string
  rating: number
  title: string
  comment: string
  category: string
  createdAt: string
  isApproved: boolean
  isPublic: boolean
  businessReply?: string
  repliedAt?: string
  helpful: number
  orderNumber?: string
  photos?: string[]
}

const categories = [
  'Overall Experience',
  'Food Quality',
  'Service',
  'Ambiance',
  'Value for Money',
  'Cleanliness'
]

export default function RatingManagement() {
  const { userId } = useAuth()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRating, setEditingRating] = useState<Rating | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyingToRating, setReplyingToRating] = useState<Rating | null>(null)
  const [replyText, setReplyText] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    title: '',
    comment: '',
    rating: 5,
    category: 'Overall Experience',
    orderNumber: ''
  })

  useEffect(() => {
    if (userId) {
      fetchRatings()
    }
  }, [userId])

  const fetchRatings = async () => {
    if (!userId) {
      console.log('No userId available for fetching ratings')
      return
    }
    
    try {
      setLoading(true)
      console.log('Fetching ratings for userId:', userId)
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        
        // The API returns an object with ratings property directly
        if (data && data.ratings && Array.isArray(data.ratings)) {
          console.log('Found ratings:', data.ratings.length, 'ratings')
          setRatings(data.ratings)
        } else {
          console.log('No ratings found or invalid data structure')
          setRatings([])
        }
      } else {
        console.error('Failed to fetch ratings, status:', response.status)
        setRatings([])
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setRatings([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    try {
      if (editingRating) {
        // Update existing rating
        const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingRating,
            ...formData,
            type: 'rating',
            updatedAt: new Date().toISOString()
          })
        })
        
        if (response.ok) {
          setRatings(ratings.map(r => r.id === editingRating.id ? { ...r, ...formData } : r))
          toast.success('Rating updated successfully!')
        } else {
          toast.error('Failed to update rating')
        }
      } else {
        // Create new rating
        const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'rating',
            ...formData,
            createdAt: new Date().toISOString(),
            isApproved: true, // Auto-approve all ratings
            isPublic: false,
            helpful: 0,
            id: Date.now().toString()
          })
        })
        
        if (response.ok) {
          await fetchRatings()
          toast.success('Rating added successfully!')
        } else {
          toast.error('Failed to add rating')
        }
      }
      
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving rating:', error)
      toast.error('An error occurred while saving the rating')
    }
  }

  const handleDelete = async (ratingId: string) => {
    if (!userId) return
    
    console.log('🗑️ Deleting rating with ID:', ratingId, 'for user:', userId)
    
    try {
      // Use query parameters as expected by the file-based API
      const response = await fetch(`/api/business-profiles?ownerId=${userId}&itemId=${ratingId}&itemType=rating`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('📡 Delete response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Rating deleted successfully:', result.deletedItem)
        setRatings(ratings.filter(r => r.id !== ratingId))
        toast.success('Rating deleted successfully!')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Delete failed:', errorData)
        toast.error(`Failed to delete rating: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('❌ Error deleting rating:', error)
      toast.error('An error occurred while deleting the rating')
    }
  }

  const handleReply = async () => {
    if (!replyingToRating || !replyText.trim() || !userId) return

    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...replyingToRating,
          businessReply: replyText,
          repliedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        setRatings(ratings.map(r => 
          r.id === replyingToRating.id 
            ? { ...r, businessReply: replyText, repliedAt: new Date().toISOString() }
            : r
        ))
        toast.success('Reply posted successfully!')
        setReplyDialogOpen(false)
        setReplyText('')
        setReplyingToRating(null)
      } else {
        toast.error('Failed to post reply')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      toast.error('An error occurred while posting the reply')
    }
  }

  const addSampleData = async () => {
    if (!userId) return

    const sampleRatings = [
      {
        id: `sample_${Date.now()}_1`,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        rating: 5,
        title: 'Excellent service and food!',
        comment: 'Had an amazing experience at this restaurant. The staff was friendly and the food was delicious. Will definitely come back!',
        category: 'Overall Experience',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isApproved: true, // Auto-approve sample data
        isPublic: true,
        helpful: 12,
        orderNumber: 'ORD001'
      },
      {
        id: `sample_${Date.now()}_2`,
        customerName: 'Mike Chen',
        customerEmail: 'mike.c@example.com',
        rating: 4,
        title: 'Great atmosphere',
        comment: 'Love the ambiance here. Perfect for a date night. Food was good but could be better.',
        category: 'Service',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isApproved: true, // Auto-approve sample data
        isPublic: true,
        helpful: 8,
        orderNumber: 'ORD002'
      }
    ]

    try {
      for (const rating of sampleRatings) {
        await fetch(`/api/business-profiles?ownerId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rating)
        })
      }
      
      await fetchRatings()
      toast.success('Sample reviews added! You can now test the approval system.')
    } catch (error) {
      console.error('Error adding sample data:', error)
      toast.error('Failed to add sample data')
    }
  }

  const handleApprovalChange = async (ratingId: string, isApproved: boolean) => {
    if (!userId) return

    try {
      const rating = ratings.find(r => r.id === ratingId)
      if (!rating) return

      const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rating,
          type: 'rating', // Add the type field for API to identify which array to update
          isApproved,
          isPublic: isApproved,
          updatedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        setRatings(ratings.map(r => 
          r.id === ratingId 
            ? { ...r, isApproved, isPublic: isApproved }
            : r
        ))
        
        // Send notification to customer
        if (rating.customerEmail) {
          try {
            const notificationData = {
              customerEmail: rating.customerEmail,
              customerName: rating.customerName,
              businessName: 'Your Business', // You might want to get this from business profile
              reviewTitle: rating.title,
              isApproved,
              message: getApprovalMessage(isApproved, 'Your Business', rating.title).message
            }
            await sendReviewApprovalNotification(notificationData)
            toast.success(`Rating ${isApproved ? 'approved' : 'disapproved'} successfully! Customer has been notified.`)
          } catch (notificationError) {
            console.error('Failed to send notification:', notificationError)
            toast.success(`Rating ${isApproved ? 'approved' : 'disapproved'} successfully! (Note: Customer notification failed)`)
          }
        } else {
          toast.success(`Rating ${isApproved ? 'approved' : 'disapproved'} successfully!`)
        }
      } else {
        toast.error('Failed to update rating status')
      }
    } catch (error) {
      console.error('Error updating rating approval:', error)
      toast.error('An error occurred while updating the rating')
    }
  }

  const handleEdit = (rating: Rating) => {
    setEditingRating(rating)
    setFormData({
      customerName: rating.customerName,
      customerEmail: rating.customerEmail || '',
      title: rating.title,
      comment: rating.comment,
      rating: rating.rating,
      category: rating.category,
      orderNumber: rating.orderNumber || ''
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      title: '',
      comment: '',
      rating: 5,
      category: 'Overall Experience',
      orderNumber: ''
    })
    setEditingRating(null)
  }

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onStarClick?.(i + 1)}
      />
    ))
  }

  const filteredRatings = ratings.filter(rating => {
    const matchesCategory = selectedCategory === 'all' || rating.category === selectedCategory
    return matchesCategory
  })

  const sortedRatings = [...filteredRatings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const star = 5 - i
    const count = ratings.filter(rating => rating.rating === star).length
    const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0
    return { star, count, percentage }
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading ratings...</div>
  }

  return (
    <div className="space-y-6">


      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{ratings.length}</div>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{ratings.length}</div>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{ratings.filter(r => r.businessReply).length}</div>
                <p className="text-xs text-muted-foreground">Replied</p>
              </div>
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
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rating
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingRating ? 'Edit Rating' : 'Add New Rating'}</DialogTitle>
                <DialogDescription>
                  {editingRating ? 'Update the rating details' : 'Add a new customer rating'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email (Optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Review Comment</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                  <Input
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Star Rating</Label>
                  <div className="flex space-x-1">
                    {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRating ? 'Update' : 'Create'} Rating
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={addSampleData}>
            Add Sample Data
          </Button>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {sortedRatings.map((rating) => (
          <Card key={rating.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{rating.customerName}</span>
                    </div>
                    <div className="flex">
                      {renderStars(rating.rating)}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{rating.title}</h3>
                  <p className="text-gray-700 mb-3">{rating.comment}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge variant={rating.category === 'Overall Experience' ? 'default' : 'secondary'}>
                      {rating.category}
                    </Badge>
                    {rating.orderNumber && (
                      <Badge variant="outline">Order: {rating.orderNumber}</Badge>
                    )}
                  </div>
                  {rating.businessReply && (
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Business Reply:</span>
                        <span className="text-xs text-gray-500">
                          {rating.repliedAt && new Date(rating.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{rating.businessReply}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rating)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(rating.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {!rating.businessReply && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setReplyingToRating(rating)
                        setReplyDialogOpen(true)
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRatings.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ratings found</h3>
            <p className="text-gray-600 mb-4">
              {ratings.length === 0 
                ? "When customers submit reviews on your business profile, they will appear here automatically." 
                : "No ratings match the current filters."}
            </p>
            {ratings.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-2">How to get customer reviews:</h4>
                <ol className="text-sm text-blue-800 text-left space-y-1">
                  <li>1. Customers visit your business profile page</li>
                  <li>2. They submit reviews using the review form</li>
                  <li>3. Reviews appear here automatically and are published instantly</li>
                  <li>4. All reviews are visible on your public profile</li>
                  <li>5. You can reply to reviews to engage with customers</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Respond to {replyingToRating?.customerName}&apos;s review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply}>
                Post Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}