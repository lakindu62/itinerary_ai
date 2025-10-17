'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, Clock, User, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/sonner'
import { sendReviewApprovalNotification, getApprovalMessage } from '@/lib/notifications'

interface Rating {
  id: string
  customerName: string
  customerEmail?: string
  rating: number
  title: string
  comment: string
  category: string
  isApproved: boolean
  isPublic: boolean
  createdAt: string
  helpful: number
  orderNumber?: string
  businessReply?: string
  repliedAt?: string
}

export default function ReviewApprovalTest() {
  const { userId } = useAuth()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      loadRatings()
    }
  }, [userId])

  const loadRatings = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings || [])
        console.log('📋 Loaded ratings:', data.ratings?.length || 0)
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleRatings = async () => {
    if (!userId) return
    
    const sampleRatings = [
      {
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        rating: 5,
        title: 'Excellent service!',
        comment: 'Amazing experience! The staff were very friendly and the food was delicious. Will definitely come back again.',
        category: 'Overall Experience',
        isApproved: false, // Pending approval
        isPublic: true,
        orderNumber: 'ORD-001'
      },
      {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        rating: 4,
        title: 'Great food quality',
        comment: 'The food was really good and fresh. Service was quick. Only minor issue was the wait time for seating.',
        category: 'Food Quality',
        isApproved: false, // Pending approval
        isPublic: true,
        orderNumber: 'ORD-002'
      },
      {
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@example.com',
        rating: 3,
        title: 'Average experience',
        comment: 'Food was okay, nothing special. Service could be improved. Reasonable prices though.',
        category: 'Service',
        isApproved: true, // Already approved
        isPublic: true,
        orderNumber: 'ORD-003'
      }
    ]

    try {
      for (const ratingData of sampleRatings) {
        await fetch(`/api/business-profiles?ownerId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'rating',
            ...ratingData
          })
        })
      }
      
      toast.success('🎭 Sample reviews added! You can now test the approval system.')
      loadRatings()
    } catch (error) {
      console.error('Error generating sample ratings:', error)
      toast.error('Failed to generate sample ratings')
    }
  }

  const handleApprovalChange = async (ratingId: string, isApproved: boolean) => {
    try {
      console.log(`🔄 ${isApproved ? 'Approving' : 'Disapproving'} rating:`, ratingId)
      
      // Find the rating to get customer details
      const rating = ratings.find(r => r.id === ratingId)
      if (!rating) {
        toast.error('Rating not found')
        return
      }

      // Update the rating approval status
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rating',
          id: ratingId,
          isApproved
        })
      })
      
      if (response.ok) {
        // Send notification to the customer
        try {
          const approvalMessage = getApprovalMessage(isApproved, 'Your Business', rating.title)
          
          await sendReviewApprovalNotification({
            customerEmail: rating.customerEmail || 'customer@example.com',
            customerName: rating.customerName,
            businessName: 'Your Business',
            reviewTitle: rating.title,
            isApproved,
            message: approvalMessage.message
          })

          toast.success(`✅ Rating ${isApproved ? 'approved' : 'disapproved'} successfully! Customer has been notified.`)
          console.log('📧 Notification sent to customer:', rating.customerEmail)
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError)
          toast.success(`✅ Rating ${isApproved ? 'approved' : 'disapproved'} successfully! (Note: Customer notification failed)`)
        }
        
        loadRatings()
      } else {
        throw new Error('Failed to update rating approval')
      }
    } catch (error) {
      console.error('Error updating approval:', error)
      toast.error('Failed to update approval status')
    }
  }

  if (!userId) {
    return <div>Please sign in to manage reviews.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Review Approval System Test
          </CardTitle>
          <CardDescription>
            Test the review approval functionality with sample data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={generateSampleRatings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🎭 Generate Sample Reviews for Testing
            </Button>
            
            <div className="text-sm text-gray-600">
              <p>• Click the button above to create sample reviews</p>
              <p>• Some will be "Pending Approval" (you can approve them)</p>
              <p>• Some will be "Already Approved" (you can disapprove them)</p>
              <p>• Each approval/disapproval will send a notification to the customer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : ratings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <p className="text-sm text-gray-400">Click "Generate Sample Reviews" to add test data</p>
            </CardContent>
          </Card>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{rating.customerName}</span>
                      <span className="text-sm text-gray-500">({rating.customerEmail})</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">{rating.title}</h4>
                    <p className="text-gray-700 mb-3">{rating.comment}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant={rating.isApproved ? "default" : "destructive"}>
                        {rating.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                      </Badge>
                      <span className="text-sm text-gray-500">{rating.category}</span>
                      {rating.orderNumber && (
                        <span className="text-sm text-gray-500">Order: {rating.orderNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant={rating.isApproved ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleApprovalChange(rating.id, !rating.isApproved)}
                      className={rating.isApproved ? 
                        "bg-red-600 hover:bg-red-700" : 
                        "bg-green-600 hover:bg-green-700 text-white"
                      }
                    >
                      {rating.isApproved ? '❌ Disapprove' : '✅ Approve'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}