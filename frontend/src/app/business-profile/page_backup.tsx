'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Star, 
  MapPin, 
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '../../services/business-profile-api.service'

// Backend profile type from MongoDB
interface BackendBusinessProfile {
  _id?: string
  id?: string
  businessName: string
  description?: string
  categories?: string[]
  location?: string
  phone?: string
  email?: string
  website?: string
  sliderImages?: Array<{
    _id?: string
    id?: string
    url?: string
    imageUrl?: string
    title?: string
    filename?: string
    description?: string
    order?: number
    isActive?: boolean
  }>
  posts?: Array<{
    _id?: string
    id?: string
    title?: string
    content?: string
    caption?: string
    imageUrls?: string[]
    imageUrl?: string
    createdAt?: string
    publishedAt?: string
    likes?: any[]
    likeCount?: number
    comments?: any[]
    commentCount?: number
  }>
  reels?: Array<{
    _id?: string
    id?: string
    title?: string
    videoUrl?: string
    thumbnailUrl?: string
    createdAt?: string
    publishedAt?: string
    likes?: any[]
    likeCount?: number
    comments?: any[]
    commentCount?: number
  }>
  menuItems?: Array<{
    _id?: string
    id?: string
    name?: string
    description?: string
    price?: number
    category?: string
    imageUrl?: string
    isAvailable?: boolean
    likes?: string[]
    likeCount?: number
  }>
  reviews?: Array<{
    _id?: string
    id?: string
    rating?: number
    comment?: string
    reviewerName?: string
    reviewerId?: string
    createdAt?: string
    isApproved?: boolean
  }>
  isActive?: boolean
  isVerified?: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

interface Business {
  id: string
  businessName: string
  description: string
  categories?: string[]
  location: string
  phone?: string
  email?: string
  website?: string
  coverImage: string
  rating: number
  totalReviews: number
  sliderImages: SliderImage[]
  posts: Post[]
  reels: Reel[]
  menuItems: MenuItem[]
  reviews: Review[]
  isActive?: boolean
  isVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isAvailable: boolean
  likes: string[] // Array of user IDs who liked this item
  likeCount: number
}

interface Review {
  id: string
  customerName: string
  rating: number
  title: string
  comment: string
  createdAt: string
  businessReply?: string
}

interface SliderImage {
  id: string
  url: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface Post {
  id: string
  title: string
  content: string
  imageUrls: string[]
  author: string
  publishedAt: string
  likes: number
  comments: number
}

interface Reel {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl: string
  author: string
  publishedAt: string
  likes: number
  comments: number
}

export default function BusinessProfilesPage() {
  const { userId, isAuthenticated, getToken } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0)
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [feedTab, setFeedTab] = useState<'posts' | 'reels'>('posts')
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [menuPopupOpen, setMenuPopupOpen] = useState(false)
  const [autoSlide, setAutoSlide] = useState(true) // Auto-slide state
  const currentUserId = userId || 'guest_user' // Use authenticated user ID or guest
  const [reviewFormData, setReviewFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: '',
    category: 'Overall Experience'
  })

  // Like menu item functionality
  const handleMenuItemLike = async (businessId: string, menuItemId: string) => {
    console.log('🎯 Attempting to like menu item:', { businessId, menuItemId, userId })
    
    if (!userId) {
      // Could show a toast or modal asking to sign in
      alert('Please sign in to like menu items')
      return
    }

    try {
      // Get the correct owner ID for the business
      console.log('🔍 Getting owner ID for business:', businessId)
      const ownerId = await getOwnerIdForBusiness(businessId)
      console.log('✅ Found owner ID:', ownerId)
      
      if (!ownerId) {
        alert('Unable to like menu item: Business owner not found')
        return
      }

      // Use the existing file-based API since menu items are loaded from there
      console.log('📤 Sending like request with data:', {
        ownerId,
        action: 'likeMenuItem',
        menuItemId,
        userId
      })
      
      const response = await fetch(`/api/business-profiles?ownerId=${ownerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'likeMenuItem',
          menuItemId,
          userId
        })
      })

      console.log('📥 API response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Like successful, response:', responseData)
        
        // Update local state
        setBusinesses(prev => prev.map(business => {
          if (business.id === businessId) {
            return {
              ...business,
              menuItems: business.menuItems.map(item => {
                if (item.id === menuItemId) {
                  const isLiked = item.likes?.includes(userId)
                  const newItem = {
                    ...item,
                    likes: isLiked 
                      ? item.likes.filter(id => id !== userId)
                      : [...(item.likes || []), userId],
                    likeCount: isLiked 
                      ? (item.likeCount || 0) - 1
                      : (item.likeCount || 0) + 1
                  }
                  console.log('🔄 Updated menu item:', newItem)
                  return newItem
                }
                return item
              })
            }
          }
          return business
        }))
      } else {
        const errorData = await response.text()
        console.error('❌ API error response:', errorData)
        throw new Error(`Failed to like menu item: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Error liking menu item:', error)
      alert('Failed to like menu item. Please try again.')
    }
  }

  useEffect(() => {
    // Auto-slide every 20 seconds - cycle through slider images first, then businesses
    if (!autoSlide) return // Don't auto-slide if disabled
    
    const interval = setInterval(() => {
      if (businesses.length > 0) {
        const currentBusiness = businesses[currentBusinessIndex]
        const sliderImages = currentBusiness.sliderImages || []
        
        if (sliderImages.length > 1) {
          // If current business has multiple slider images, cycle through them
          setCurrentSliderIndex((prev) => {
            if (prev < sliderImages.length - 1) {
              return prev + 1
            } else {
              // Move to next business and reset slider index
              setCurrentBusinessIndex((prevBusiness) => 
                prevBusiness === businesses.length - 1 ? 0 : prevBusiness + 1
              )
              return 0
            }
          })
        } else {
          // If only one or no slider images, just move to next business
          setCurrentBusinessIndex((prev) => 
            prev === businesses.length - 1 ? 0 : prev + 1
          )
          setCurrentSliderIndex(0)
        }
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [businesses.length, autoSlide, currentBusinessIndex])

  // Helper function to convert MongoDB profile to business format
  const convertMongoProfileToBusiness = (profile: any): Business => {
    console.log('🔄 Converting MongoDB profile:', profile.businessName)
    
    // Get reviews from MongoDB profile
    const mongoReviews = profile.reviews || []
    console.log('🔄 Converting MongoDB reviews:', mongoReviews.length, 'reviews')
    
    // Convert MongoDB reviews to frontend format
    const reviews = mongoReviews.map((review: any, index: number) => ({
      id: review._id || review.id || `review-${index}`,
      rating: review.rating || 0,
      title: review.title || 'Review',
      comment: review.comment || '',
      customerName: review.reviewerName || review.customerName || 'Anonymous',
      createdAt: review.createdAt || new Date().toISOString(),
      businessReply: review.businessReply
    }))
    
    // Calculate average rating from MongoDB reviews
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    console.log('📊 Calculated average rating:', avgRating, 'from', reviews.length, 'file-based reviews')
    
    return {
      id: profile._id || profile.id || Math.random().toString(36),
      businessName: profile.businessName || 'Business',
      location: profile.location || 'Unknown Location',
      description: profile.description || 'No description available',
      categories: profile.categories || [],
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      coverImage: profile.sliderImages?.[0]?.url || '/alien-profile-pic-1.jpg',
      rating: avgRating,
      totalReviews: reviews.length,
      sliderImages: profile.sliderImages?.map((img: any, index: number) => ({
        id: img.id || `slider-${index}`,
        url: img.url || img.imageUrl,
        alt: img.alt || profile.businessName
      })) || [],
      reviews: reviews,
      posts: profile.posts?.map((post: any, index: number) => ({
        id: post._id || post.id || `post-${index}`,
        title: post.title || 'Untitled Post',
        content: post.content || '',
        imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []),
        author: profile.businessName,
        publishedAt: post.createdAt || post.publishedAt || new Date().toISOString(),
        likes: post.likes?.length || post.likeCount || 0,
        comments: post.comments?.length || post.commentCount || 0
      })) || [],
      reels: profile.reels?.map((reel: any, index: number) => ({
        id: reel._id || reel.id || `reel-${index}`,
        title: reel.title || 'Untitled Reel',
        videoUrl: reel.videoUrl || '',
        thumbnailUrl: reel.thumbnailUrl || reel.videoUrl || '/placeholder-video.jpg',
        author: profile.businessName,
        publishedAt: reel.createdAt || reel.publishedAt || new Date().toISOString(),
        likes: reel.likes?.length || reel.likeCount || 0,
        comments: reel.comments?.length || reel.commentCount || 0
      })) || [],
      menuItems: profile.menuItems?.map((item: any, index: number) => {
        const likesArray = Array.isArray(item.likes) ? item.likes : []
        const likeCount = item.likeCount || likesArray.length || 0
        
        return {
          id: item._id || item.id || `menu-${index}`,
          name: item.name || 'Menu Item',
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Food',
          image: item.imageUrl || item.image || '/placeholder-food.jpg',
          isAvailable: item.isAvailable !== false,
          likes: likeCount,
          likeCount: likeCount
        }
      }) || [],
      isActive: profile.isActive !== false,
      isVerified: profile.isVerified || false,
      createdAt: profile.createdAt ? new Date(profile.createdAt) : new Date(),
      updatedAt: profile.updatedAt ? new Date(profile.updatedAt) : new Date()
    }
  }

  // Helper function to convert MongoDB profile with file-based ratings to business format
  const convertMongoProfileWithFileRatings = (mongoProfile: BackendBusinessProfile, fileRatings: any[] = []): Business => {
    console.log('🔄 Converting MongoDB profile with file-based ratings:', mongoProfile.businessName)
    console.log('🔄 File-based ratings:', fileRatings.length, 'ratings')
    
    // Filter approved ratings only from file-based system
    const approvedRatings = fileRatings.filter(rating => rating.isApproved === true)
    console.log('✅ Approved file-based ratings:', approvedRatings.length, 'out of', fileRatings.length)
    
    // Convert approved ratings to reviews format
    const reviews = approvedRatings.map((rating, index) => {
      console.log('⭐ Processing file-based rating:', rating.customerName, rating.rating, 'stars')
      return {
        id: rating.id || `review-${index}`,
        rating: rating.rating || 0,
        title: rating.title || 'Review',
        comment: rating.comment || '',
        customerName: rating.customerName || 'Anonymous',
        createdAt: rating.createdAt || new Date().toISOString(),
        businessReply: rating.businessReply
      }
    })
    
    // Calculate average rating from file-based approved ratings
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    console.log('📊 Calculated average rating from file-based ratings:', avgRating, 'from', reviews.length, 'approved reviews')
    
    return {
      id: mongoProfile._id || mongoProfile.id || Math.random().toString(36),
      businessName: mongoProfile.businessName || 'Business',
      location: mongoProfile.location || 'Unknown Location',
      description: mongoProfile.description || 'No description available',
      categories: mongoProfile.categories || ['Business'],
      phone: mongoProfile.phone,
      email: mongoProfile.email,
      website: mongoProfile.website,
      coverImage: mongoProfile.sliderImages?.[0]?.url || mongoProfile.sliderImages?.[0]?.imageUrl || '/placeholder-business.jpg',
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      sliderImages: mongoProfile.sliderImages?.map((img: any, index: number) => ({
        id: img._id || img.id || `img-${index}`,
        url: img.url || img.imageUrl,
        title: img.title || `Image ${index + 1}`,
        description: img.description || '',
        order: img.order || index + 1,
        isActive: img.isActive !== false
      })) || [],
      posts: mongoProfile.posts?.map((post: any, index: number) => ({
        id: post._id || post.id || `post-${index}`,
        title: post.title || 'Post',
        content: post.content || post.caption || '',
        imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []),
        author: post.author || 'Business Owner',
        publishedAt: post.createdAt || post.publishedAt || new Date().toISOString(),
        likes: post.likes?.length || post.likeCount || 0,
        comments: post.comments?.length || post.commentCount || 0
      })) || [],
      reels: mongoProfile.reels?.map((reel: any, index: number) => ({
        id: reel._id || reel.id || `reel-${index}`,
        title: reel.title || 'Reel',
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl || '/placeholder-video.jpg',
        author: reel.author || 'Business Owner',
        publishedAt: reel.createdAt || reel.publishedAt || new Date().toISOString(),
        likes: reel.likes?.length || reel.likeCount || 0,
        comments: reel.comments?.length || reel.commentCount || 0
      })) || [],
      menuItems: mongoProfile.menuItems?.map((item: any, index: number) => {
        const likesArray = Array.isArray(item.likes) ? item.likes : []
        const likeCount = item.likeCount || likesArray.length || 0
        
        return {
          id: item._id || item.id || `menu-${index}`,
          name: item.name || 'Menu Item',
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Food',
          image: item.imageUrl || item.image || '/placeholder-food.jpg',
          isAvailable: item.isAvailable !== false,
          likes: likeCount,
          likeCount: likeCount
        }
      }) || [],
      reviews: reviews, // Reviews from file-based ratings system
      isActive: mongoProfile.isActive !== false,
      isVerified: mongoProfile.isVerified || false,
      createdAt: mongoProfile.createdAt ? new Date(mongoProfile.createdAt) : new Date(),
      updatedAt: mongoProfile.updatedAt ? new Date(mongoProfile.updatedAt) : new Date()
    }
  }

  // Helper function to convert dashboard profile and ratings to business format (kept for backward compatibility)
  const convertDashboardToBusiness = (profile: any, ratings: any[] = []): Business => {
    console.log('🔄 Converting dashboard profile:', profile.businessName)
    console.log('🔄 Converting ratings:', ratings.length, 'ratings')
    
    // Filter approved ratings only
    const approvedRatings = ratings.filter(rating => rating.isApproved === true)
    console.log('✅ Approved ratings:', approvedRatings.length, 'out of', ratings.length)
    
    // Convert approved ratings to reviews format
    const reviews = approvedRatings.map((rating, index) => {
      console.log('⭐ Processing rating:', rating.customerName, rating.rating, 'stars')
      return {
        id: rating.id || `review-${index}`,
        rating: rating.rating || 0,
        title: rating.title || 'Review',
        comment: rating.comment || '',
        customerName: rating.customerName || 'Anonymous',
        createdAt: rating.createdAt || new Date().toISOString(),
        businessReply: rating.businessReply
      }
    })
    
    // Calculate average rating from approved ratings
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    console.log('📊 Calculated average rating:', avgRating, 'from', reviews.length, 'approved reviews')
    
    return {
      id: profile.id || Math.random().toString(36),
      businessName: profile.businessName || 'Business',
      location: profile.location || 'Unknown Location',
      description: profile.description || 'No description available',
      categories: profile.categories || ['Business'],
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      coverImage: profile.sliderImages?.[0]?.url || '/placeholder-business.jpg',
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      sliderImages: profile.sliderImages?.map((img: any, index: number) => ({
        id: img.id || `img-${index}`,
        url: img.url,
        title: img.title || `Image ${index + 1}`,
        description: img.description || '',
        order: img.order || index + 1,
        isActive: img.isActive !== false
      })) || [],
      posts: profile.posts?.map((post: any, index: number) => ({
        id: post.id || `post-${index}`,
        title: post.title || 'Post',
        content: post.content || post.caption || '',
        imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []),
        author: post.author || 'Business Owner',
        publishedAt: post.createdAt || post.publishedAt || new Date().toISOString(),
        likes: post.likes?.length || post.likeCount || 0,
        comments: post.comments?.length || post.commentCount || 0
      })) || [],
      reels: profile.reels?.map((reel: any, index: number) => ({
        id: reel.id || `reel-${index}`,
        title: reel.title || 'Reel',
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl || '/placeholder-video.jpg',
        author: reel.author || 'Business Owner',
        publishedAt: reel.createdAt || reel.publishedAt || new Date().toISOString(),
        likes: reel.likes?.length || reel.likeCount || 0,
        comments: reel.comments?.length || reel.commentCount || 0
      })) || [],
      menuItems: profile.menuItems?.map((item: any, index: number) => {
        const likesArray = Array.isArray(item.likes) ? item.likes : []
        const likeCount = item.likeCount || likesArray.length || 0
        
        return {
          id: item.id || `menu-${index}`,
          name: item.name || 'Menu Item',
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Food',
          image: item.imageUrl || item.image || '/placeholder-food.jpg',
          isAvailable: item.isAvailable !== false,
          likes: likeCount,
          likeCount: likeCount
        }
      }) || [],
      reviews: reviews,
      isActive: profile.isActive !== false,
      isVerified: profile.isVerified || false,
      createdAt: profile.createdAt ? new Date(profile.createdAt) : new Date(),
      updatedAt: profile.updatedAt ? new Date(profile.updatedAt) : new Date()
    }
  }

  const loadBusinesses = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔄 HYBRID APPROACH: Loading business profiles from MongoDB and ratings from file-based system...')
      
      let allBusinesses: Business[] = []
      
      // Step 1: Load business profiles from MongoDB
      console.log('� Step 1: Loading business profiles from MongoDB...')
      let mongoBusinesses: BackendBusinessProfile[] = []
      try {
        const mongoBusinessData = await BusinessProfileApiService.getAllBusinessProfiles()
        console.log('�️ MongoDB businesses loaded:', mongoBusinessData.length)
        mongoBusinesses = mongoBusinessData
      } catch (error) {
        console.error('❌ Error loading businesses from MongoDB:', error)
      }
      
      // Step 2: Load ratings from file-based system
      console.log('📄 Step 2: Loading ratings from file-based system...')
      let fileBasedRatings: { [businessId: string]: any[] } = {}
      try {
        const ratingsResponse = await fetch('/api/business-profiles?getAllBusinesses=true')
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json()
          console.log('📊 File-based ratings response:', {
            hasBusinesses: !!ratingsData.businesses,
            businessesCount: ratingsData.businesses?.length || 0
          })
          
          // Extract ratings by business ID
          if (ratingsData.businesses && ratingsData.businesses.length > 0) {
            ratingsData.businesses.forEach((business: any) => {
              if (business.id && business.ratings && business.ratings.length > 0) {
                fileBasedRatings[business.id] = business.ratings
                console.log(`📋 Found ${business.ratings.length} ratings for business:`, business.businessName, business.id)
              }
            })
          }
        } else {
          console.error('❌ Failed to load ratings from file-based system:', ratingsResponse.status)
        }
      } catch (error) {
        console.error('❌ Error loading ratings from file-based system:', error)
      }
      
      // Step 3: Merge MongoDB profiles with file-based ratings
      console.log('🔗 Step 3: Merging MongoDB profiles with file-based ratings...')
      
      if (mongoBusinesses.length > 0) {
        mongoBusinesses.forEach((mongoProfile, businessIndex) => {
          const businessId = mongoProfile._id || mongoProfile.id
          console.log(`🏢 Processing MongoDB business ${businessIndex + 1}:`, mongoProfile.businessName, businessId)
          
          // Get ratings for this business from file-based system
          const businessRatings = fileBasedRatings[businessId!] || []
          console.log('📊 Ratings found for this business:', businessRatings.length)
          
          // Debug ratings
          if (businessRatings.length > 0) {
            businessRatings.forEach((rating: any, rIndex: number) => {
              console.log(`⭐ Rating ${rIndex + 1}:`, {
                customer: rating.customerName,
                rating: rating.rating,
                title: rating.title,
                approved: rating.isApproved
              })
            })
          }
          
          // Convert MongoDB profile with file-based ratings to business format
          const convertedBusiness = convertMongoProfileWithFileRatings(mongoProfile, businessRatings)
          allBusinesses.push(convertedBusiness)
          
          console.log('✅ Added hybrid business:', {
            name: convertedBusiness.businessName,
            id: convertedBusiness.id,
            rating: convertedBusiness.rating,
            totalReviews: convertedBusiness.totalReviews,
            reviewsLength: convertedBusiness.reviews.length
          })
        })
      } else {
        console.log('⚠️ No MongoDB businesses found, trying file-based fallback...')
        // Fallback to file-based system if MongoDB is empty
        Object.keys(fileBasedRatings).forEach(businessId => {
          const ratings = fileBasedRatings[businessId]
          const mockProfile: BackendBusinessProfile = {
            _id: businessId,
            businessName: `Business ${businessId}`,
            description: 'MongoDB profile not found - using file-based fallback',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          const convertedBusiness = convertMongoProfileWithFileRatings(mockProfile, ratings)
          allBusinesses.push(convertedBusiness)
        })
      }
      
      console.log('✅ HYBRID LOADING COMPLETE:', allBusinesses.length, 'businesses with MongoDB profiles + file-based ratings')
      
      // Debug final result
      if (allBusinesses.length > 0) {
        allBusinesses.forEach((business, index) => {
          console.log(`🎯 Final business ${index + 1}:`, {
            name: business.businessName,
            id: business.id,
            rating: business.rating,
            reviews: business.totalReviews,
            source: 'MongoDB + File-based ratings'
          })
        })
      }
      
      setBusinesses(allBusinesses)
      
    } catch (error) {
      console.error('💥 Error in hybrid loading:', error)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBusinesses()
  }, [loadBusinesses])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businesses[currentBusinessIndex]) return
    
    setReviewSubmitting(true)
    
    const currentBusiness = businesses[currentBusinessIndex]
    
    try {
      // Get the owner ID first
      const ownerId = await getOwnerIdForBusiness(currentBusiness.id)
      
      if (!ownerId) {
        alert('Unable to submit review: Business owner not found')
        return
      }
      
      const response = await fetch(`/api/business-profiles?ownerId=${ownerId}&submitterId=${currentUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rating',
          customerName: reviewFormData.customerName,
          customerEmail: reviewFormData.customerEmail,
          rating: reviewFormData.rating,
          title: reviewFormData.title,
          comment: reviewFormData.comment,
          category: reviewFormData.category,
          isApproved: false,
          isPublic: true,
          helpful: 0
        })
      })

      if (response.ok) {
        alert('Thank you for your review! It will be published after approval.')
        setReviewFormOpen(false)
        resetReviewForm()
        loadBusinesses() // Reload to update review counts
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const getOwnerIdForBusiness = async (businessId: string) => {
    try {
      console.log('🔍 Getting owner ID for business:', businessId)
      
      // If this is the user's own business, return their ID directly
      if (userId && businessId.startsWith(`user-business-${userId}`)) {
        console.log('✅ Found user business, owner ID:', userId)
        return userId
      }
      
      // Fetch business ownership information from API
      console.log('📤 Fetching ownership from API for businessId:', businessId)
      const response = await fetch(`/api/business-profiles/ownership?businessId=${businessId}`)
      console.log('📥 Ownership API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Ownership data:', data)
        return data.ownerId
      } else {
        const errorText = await response.text()
        console.error('❌ Ownership API error:', errorText)
      }
    } catch (error) {
      console.error('💥 Error fetching business ownership:', error)
    }
    
    return null
  }

  const resetReviewForm = () => {
    setReviewFormData({
      customerName: '',
      customerEmail: '',
      rating: 5,
      title: '',
      comment: '',
      category: 'Overall Experience'
    })
  }

  const nextSlide = () => {
    setCurrentBusinessIndex((prev) => 
      prev === businesses.length - 1 ? 0 : prev + 1
    )
    setCurrentSliderIndex(0) // Reset slider index when changing business
  }

  const prevSlide = () => {
    setCurrentBusinessIndex((prev) => 
      prev === 0 ? businesses.length - 1 : prev - 1
    )
    setCurrentSliderIndex(0) // Reset slider index when changing business
  }
  
  const nextSliderImage = () => {
    const currentBusiness = businesses[currentBusinessIndex]
    const sliderImages = currentBusiness?.sliderImages || []
    if (sliderImages.length > 1) {
      setCurrentSliderIndex((prev) => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevSliderImage = () => {
    const currentBusiness = businesses[currentBusinessIndex]
    const sliderImages = currentBusiness?.sliderImages || []
    if (sliderImages.length > 1) {
      setCurrentSliderIndex((prev) => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
      )
    }
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

  const getFeedItems = () => {
    const currentBusiness = businesses[currentBusinessIndex]
    if (!currentBusiness) return []
    
    if (feedTab === 'posts') {
      // Return posts from current business only
      return currentBusiness.posts.map(post => ({ 
        ...post, 
        type: 'post',
        businessName: currentBusiness.businessName,
        businessId: currentBusiness.id
      })).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    } else {
      // Return reels from current business only
      return currentBusiness.reels.map(reel => ({ 
        ...reel, 
        type: 'reel',
        businessName: currentBusiness.businessName,
        businessId: currentBusiness.id
      })).sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Business Profiles Yet</h2>
          <p className="text-gray-600 mb-6">
            This is a clean production-ready system. Business owners can create their profiles to showcase their businesses here.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">For Business Owners:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Create your business profile</li>
              <li>• Upload slider images</li>
              <li>• Add menu items and services</li>
              <li>• Manage customer reviews with approval system</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const currentBusiness = businesses[currentBusinessIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Auto-Scroll Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setAutoSlide(!autoSlide)}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            autoSlide 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
          title={autoSlide ? 'Turn off auto-scroll' : 'Turn on auto-scroll'}
        >
          <div className="flex items-center space-x-2">
            <Play className={`h-5 w-5 ${autoSlide ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium hidden sm:block">
              {autoSlide ? 'Auto' : 'Manual'}
            </span>
          </div>
        </button>
      </div>
      {/* Business Slider Section */}
      <section className="relative h-96 bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0">
          {(() => {
            const currentBusiness = businesses[currentBusinessIndex]
            const sliderImages = currentBusiness?.sliderImages || []
            const currentImage = sliderImages.length > 0 ? sliderImages[currentSliderIndex] : null
            
            return (
              <img 
                src={currentImage?.url || currentBusiness.coverImage || '/placeholder-business.jpg'} 
                alt={currentImage?.title || currentBusiness.businessName}
                className="w-full h-full object-cover opacity-30"
                onError={(e) => {
                  // Fallback to cover image if slider image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = currentBusiness.coverImage || '/placeholder-business.jpg'
                }}
              />
            )
          })()}
        </div>
        
        {/* Navigation Buttons - Only show if multiple slider images */}
        {currentBusiness?.sliderImages && currentBusiness.sliderImages.length > 1 && (
          <>
            <button 
              onClick={prevSliderImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors cursor-pointer"
              title="Previous Image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <button 
              onClick={nextSliderImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors cursor-pointer"
              title="Next Image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Slider Image Indicators */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {currentBusiness.sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSliderIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    index === currentSliderIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  title={`Image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-6">
            <Badge className="mb-4 bg-white/20 text-white">
              {currentBusiness.categories?.[0] || 'Business'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {currentBusiness.businessName}
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              {currentBusiness.description}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm mb-6">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{currentBusiness.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(currentBusiness.rating))}
                <span className="ml-1">({currentBusiness.totalReviews} reviews)</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={() => setMenuPopupOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                variant="outline"
              >
                View Menu
              </Button>
              <Button 
                onClick={() => setReviewFormOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                variant="outline"
              >
                Write Review
              </Button>
            </div>
          </div>
        </div>

        {/* Business Navigation Arrows */}
        {businesses.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 bottom-4 z-10 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors cursor-pointer"
              title="Previous Business"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 bottom-4 z-10 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors cursor-pointer"
              title="Next Business"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {businesses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBusinessIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                index === currentBusinessIndex ? 'bg-white' : 'bg-white/40'
              }`}
              title={`Go to ${businesses[index]?.businessName}`}
            />
          ))}
        </div>
      </section>

      {/* Review Form Modal */}
      {reviewFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Write a Review</h3>
                  <p className="text-gray-600">Share your experience with {currentBusiness.businessName}</p>
                </div>
                <Button 
                  onClick={() => setReviewFormOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Your Name *</Label>
                    <Input
                      id="customerName"
                      value={reviewFormData.customerName}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email (optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={reviewFormData.customerEmail}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          i < reviewFormData.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                        onClick={() => setReviewFormData(prev => ({ ...prev, rating: i + 1 }))}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({reviewFormData.rating} star{reviewFormData.rating !== 1 ? 's' : ''})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    value={reviewFormData.title}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={reviewFormData.comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell others about your experience..."
                    rows={4}
                    required
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setReviewFormOpen(false)}
                    disabled={reviewSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews & Ratings Section - Under Slider */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Summary */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {currentBusiness.rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(currentBusiness.rating))}
                </div>
                <p className="text-gray-600 text-sm">Based on {currentBusiness.totalReviews} reviews</p>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Recent Reviews</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {currentBusiness.reviews?.slice(0, 4).map((review) => (
                      <div key={review.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{review.customerName}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{review.title}</p>
                        <p className="text-xs text-gray-600 mb-2">{review.comment}</p>
                        {review.businessReply && (
                          <div className="bg-gray-50 p-2 rounded text-xs">
                            <span className="font-medium text-blue-600">Business Reply:</span>
                            <p className="text-gray-700 mt-1">{review.businessReply}</p>
                          </div>
                        )}
                      </div>
                    )) || (
                      <p className="text-gray-600 text-sm">No reviews yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Popup Modal */}
      {menuPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Menu - {currentBusiness.businessName}</h2>
                <Button 
                  onClick={() => setMenuPopupOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentBusiness.menuItems?.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            ${item.price}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {!item.isAvailable && (
                              <span className="text-red-500 text-xs">Out of Stock</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={item.likes?.includes(userId || '') ? "default" : "outline"}
                              onClick={() => handleMenuItemLike(currentBusiness.id, item.id)}
                              className="h-8 px-3"
                            >
                              <Heart 
                                className={`h-4 w-4 mr-1 ${item.likes?.includes(userId || '') ? 'fill-white' : ''}`} 
                              />
                              {item.likeCount || 0}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">No menu items available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabbed Feed Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Content from All Businesses</h2>
            
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFeedTab('posts')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  feedTab === 'posts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Posts ({businesses.flatMap(b => b.posts).length})
              </button>
              <button
                onClick={() => setFeedTab('reels')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  feedTab === 'reels'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Reels ({businesses.flatMap(b => b.reels).length})
              </button>
            </div>
          </div>

          {/* Feed Content */}
          <div className={`space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 ${
            feedTab === 'reels' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-none' : ''
          }`}>
{feedTab === 'posts' ? (
              // Posts Layout
              getFeedItems().map((item: any) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 relative">
                        {item.imageUrls && item.imageUrls.length > 0 && (
                          <img 
                            src={item.imageUrls[0]} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Business Name Badge */}
                        <div className="absolute top-3 left-3">
                          <div className="bg-blue-600/80 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-white text-xs font-semibold">{item.businessName}</span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-200 line-clamp-2">{item.content}</p>
                        </div>
                      </div>
                      
                      {/* Post Stats */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                              <Heart className="h-5 w-5" />
                              <span>{item.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                              <MessageCircle className="h-5 w-5" />
                              <span>{item.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                              <Share className="h-5 w-5" />
                            </button>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Reels Layout - Beautified TikTok-style grid
              getFeedItems().map((item: any) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-[9/16] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
                        {item.videoUrl ? (
                          <video 
                            src={item.videoUrl}
                            className="w-full h-full object-cover cursor-pointer"
                            poster={item.thumbnailUrl}
                            muted
                            autoPlay
                            loop
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            onClick={(e) => {
                              if (e.currentTarget.paused) {
                                e.currentTarget.play()
                              } else {
                                e.currentTarget.pause()
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer">
                            <Play className="h-16 w-16 text-white/80" />
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        {/* Play button overlay */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            const video = e.currentTarget.parentElement?.querySelector('video')
                            if (video) {
                              if (video.paused) {
                                video.play()
                              } else {
                                video.pause()
                              }
                            }
                          }}
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 pointer-events-none">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="mb-2">
                            <div className="bg-blue-600/80 backdrop-blur-sm rounded-full px-2 py-1 inline-block">
                              <span className="text-white text-xs font-semibold">{item.businessName}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{item.title}</h3>
                          {item.description && (
                            <p className="text-white/90 text-sm line-clamp-1">{item.description}</p>
                          )}
                        </div>
                        
                        {/* Side action buttons */}
                        <div className="absolute right-3 bottom-20 flex flex-col space-y-3 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                            <Heart className="h-5 w-5" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                            <MessageCircle className="h-5 w-5" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                            <Share className="h-5 w-5" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                            <Bookmark className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* View count badge */}
                        <div className="absolute top-3 left-3">
                          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                            {item.views || 0} views
                          </div>
                        </div>
                      </div>
                      
                      {/* Reel stats footer */}
                      <div className="p-3 bg-white">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1 text-red-500">
                              <Heart className="h-4 w-4" />
                              <span className="font-medium">{item.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1 text-blue-500">
                              <MessageCircle className="h-4 w-4" />
                              <span className="font-medium">{item.comments}</span>
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {getFeedItems().length === 0 && (
              <div className="text-center py-12 col-span-full">
                <div className="bg-gray-50 rounded-lg p-8">
                  {feedTab === 'posts' ? (
                    <>
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-medium">No posts yet</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {currentBusiness.businessName} hasn't shared any posts yet.
                      </p>
                    </>
                  ) : (
                    <>
                      <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-medium">No reels yet</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {currentBusiness.businessName} hasn't created any reels yet.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}