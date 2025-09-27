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
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRating, setEditingRating] = useState<Rating | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRating, setSelectedRating] = useState<string>('all')
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyingToRating, setReplyingToRating] = useState<Rating | null>(null)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: '',
    category: '',
    isApproved: true,
    isPublic: true,
    orderNumber: ''
  })

  useEffect(() => {
    loadRatings()
  }, [])

  const loadRatings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=owner_demo')
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings || [])
      } else {
        console.error('Failed to load ratings')
        setRatings([])
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
      setRatings([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ratingData = {
        type: 'rating',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        category: formData.category,
        isApproved: formData.isApproved,
        isPublic: formData.isPublic,
        orderNumber: formData.orderNumber,
        helpful: editingRating?.helpful || 0,
        photos: editingRating?.photos || []
      }

      if (editingRating) {
        const response = await fetch(`/api/business-profiles?ownerId=owner_demo`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ratingData, id: editingRating.id })
        })
        if (response.ok) {
          toast.success('Rating updated successfully!')
          loadRatings()
        } else {
          throw new Error('Failed to update rating')
        }
      } else {
        const response = await fetch('/api/business-profiles?ownerId=owner_demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ratingData)
        })
        if (response.ok) {
          toast.success('Rating created successfully!')
          loadRatings()
        } else {
          throw new Error('Failed to create rating')
        }
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving rating:', error)
      toast.error('Failed to save rating')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (ratingId: string) => {
    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ratingId, type: 'rating' })
      })
      if (response.ok) {
        toast.success('Rating deleted successfully!')
        loadRatings()
      } else {
        throw new Error('Failed to delete rating')
      }
    } catch (error) {
      console.error('Error deleting rating:', error)
      toast.error('Failed to delete rating')
    }
  }

  const handleReply = async () => {
    if (!replyingToRating || !replyText.trim()) return

    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rating',
          id: replyingToRating.id,
          businessReply: replyText,
          repliedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        toast.success('Reply posted successfully!')
        loadRatings()
        setReplyDialogOpen(false)
        setReplyText('')
        setReplyingToRating(null)
      } else {
        throw new Error('Failed to post reply')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      toast.error('Failed to post reply')
    }
  }

  const handleApprovalChange = async (ratingId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rating',
          id: ratingId,
          isApproved
        })
      })
      if (response.ok) {
        toast.success(`Rating ${isApproved ? 'approved' : 'disapproved'} successfully!`)
        loadRatings()
      }
    } catch (error) {
      console.error('Error updating approval:', error)
      toast.error('Failed to update approval status')
    }
  }

  const handleEdit = (rating: Rating) => {
    setEditingRating(rating)
    setFormData({
      customerName: rating.customerName,
      customerEmail: rating.customerEmail || '',
      rating: rating.rating,
      title: rating.title,
      comment: rating.comment,
      category: rating.category,
      isApproved: rating.isApproved,
      isPublic: rating.isPublic,
      orderNumber: rating.orderNumber || ''
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      rating: 5,
      title: '',
      comment: '',
      category: '',
      isApproved: true,
      isPublic: true,
      orderNumber: ''
    })
    setEditingRating(null)
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
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
    const matchesRating = selectedRating === 'all' || rating.rating.toString() === selectedRating
    return matchesCategory && matchesRating
  })

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(rating => rating.rating === star).length,
    percentage: ratings.length > 0 ? (ratings.filter(rating => rating.rating === star).length / ratings.length) * 100 : 0
  }))

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
                <div className="text-2xl font-bold">{ratings.filter(r => r.isApproved).length}</div>
                <p className="text-xs text-muted-foreground">Approved</p>
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
                  <span className="text-sm font-medium">{star}</span>
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

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by stars" />
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
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email (optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-1">
                  {renderStars(formData.rating, true, (star) => 
                    setFormData(prev => ({ ...prev, rating: star }))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number (optional)</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData(prev => ({ ...prev, isApproved: e.target.checked }))}
                  />
                  <Label htmlFor="isApproved">Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <Label htmlFor="isPublic">Public</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingRating ? 'Update' : 'Create'} Rating
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {filteredRatings.map((rating) => (
          <Card key={rating.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{rating.customerName}</span>
                    </div>
                    <div className="flex">
                      {renderStars(rating.rating)}
                    </div>
                    <Badge variant="outline">{rating.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">{rating.title}</h4>
                  <p className="text-gray-700 mb-3">{rating.comment}</p>
                  
                  {rating.orderNumber && (
                    <p className="text-sm text-gray-500 mb-2">Order: {rating.orderNumber}</p>
                  )}

                  <div className="flex items-center space-x-4 mb-3">
                    <Badge variant={rating.isApproved ? "default" : "destructive"}>
                      {rating.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                    <Badge variant={rating.isPublic ? "default" : "secondary"}>
                      {rating.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {rating.helpful} helpful
                    </span>
                  </div>

                  {rating.businessReply && (
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">Business Reply</Badge>
                        <span className="text-xs text-gray-500">
                          {rating.repliedAt && new Date(rating.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{rating.businessReply}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingToRating(rating)
                      setReplyText(rating.businessReply || '')
                      setReplyDialogOpen(true)
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={rating.isApproved ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleApprovalChange(rating.id, !rating.isApproved)}
                  >
                    {rating.isApproved ? 'Disapprove' : 'Approve'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rating)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(rating.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRatings.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ratings found</h3>
            <p className="text-gray-600">
              {ratings.length === 0 
                ? "Start by adding your first customer rating." 
                : "No ratings match the current filters."}
            </p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Respond to {replyingToRating?.customerName}'s review
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
  )
}
