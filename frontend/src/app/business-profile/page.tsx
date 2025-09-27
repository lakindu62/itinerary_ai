'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart,
  MessageCircle,
  Share,
  Play,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye
} from 'lucide-react'

interface BusinessProfile {
  id: string
  businessName: string
  description?: string
  address?: string
  phone?: string
  email?: string
  rating?: number
  totalReviews?: number
  sliderImages: SliderImage[]
  menuItems: MenuItem[]
  posts: Post[]
  reels: Reel[]
  reviews: Review[]
}

interface SliderImage {
  id: string
  url: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isAvailable: boolean
  preparationTime: number
  ingredients: string[]
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  calories?: number
}

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl?: string
  imageUrls?: string[]
  category: string
  tags: string[]
  status: 'published'
  publishedAt: string
  views: number
  likes: number
  comments: number
  shares: number
  author: string
}

interface Reel {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  category: string
  hashtags: string[]
  isPublished: boolean
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
}

interface Review {
  id: string
  customerName: string
  rating: number
  title: string
  comment: string
  createdAt: string
  isApproved: boolean
  isPublic: boolean
  businessReply?: string
  repliedAt?: string
  helpful: number
  category: string
}

const categories = [
  'Appetizers',
  'Main Courses', 
  'Desserts',
  'Beverages',
  'Soups',
  'Salads',
  'Sides',
  'Specials'
]

export default function PublicBusinessProfile() {
  const [businessData, setBusinessData] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=user_123')
      if (response.ok) {
        const data = await response.json()
        setBusinessData({
          id: data.profile.id,
          businessName: data.profile.businessName || 'Demo Restaurant',
          description: 'Welcome to our amazing restaurant! We serve delicious food with love and passion.',
          address: '123 Main Street, City, State 12345',
          phone: '+1 (555) 123-4567',
          email: 'info@restaurant.com',
          rating: 4.8,
          totalReviews: data.reviews?.length || 0,
          sliderImages: data.sliderImages?.filter((img: SliderImage) => img.isActive) || [],
          menuItems: data.menuItems?.filter((item: MenuItem) => item.isAvailable) || [],
          posts: data.posts || [], // Show all posts for now, filter later if needed
          reels: data.reels || [], // Show all reels for now, filter later if needed  
          reviews: data.reviews?.filter((review: Review) => review.isApproved && review.isPublic) || []
        })
      }
    } catch (error) {
      console.error('Error loading business data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMenuItems = businessData?.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  }) || []

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
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

  const nextSlide = () => {
    if (businessData?.sliderImages.length) {
      setCurrentSlideIndex((prev) => 
        prev === businessData.sliderImages.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevSlide = () => {
    if (businessData?.sliderImages.length) {
      setCurrentSlideIndex((prev) => 
        prev === 0 ? businessData.sliderImages.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business profile...</p>
        </div>
      </div>
    )
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600">The business profile could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        {businessData.sliderImages.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={businessData.sliderImages[currentSlideIndex]?.url}
              alt={businessData.sliderImages[currentSlideIndex]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {businessData.sliderImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {businessData.sliderImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        index === currentSlideIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                      onClick={() => setCurrentSlideIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{businessData.businessName}</h1>
              <p className="text-xl">{businessData.description}</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{businessData.businessName}</h1>
            <p className="text-xl text-white opacity-90">{businessData.description}</p>
          </div>
        </div>
      </section>

      {/* Business Info Bar */}
      <section className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{businessData.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{businessData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{businessData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(Math.round(businessData.rating || 0))}
              </div>
              <span className="text-gray-700">
                {businessData.rating} ({businessData.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'menu', label: 'Menu' },
              { id: 'posts', label: 'Posts' },
              { id: 'reels', label: 'Reels' },
              { id: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`py-4 px-2 border-b-2 rounded-none ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Featured Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Menu Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Menu Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businessData.menuItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {businessData.menuItems.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No menu items available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Latest Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businessData.posts.slice(0, 3).map((post) => (
                        <div key={post.id}>
                          <h4 className="font-semibold mb-1">{post.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {formatNumber(post.likes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {businessData.posts.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No posts available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businessData.reviews.slice(0, 3).map((review) => (
                        <div key={review.id}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">{review.customerName}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    {businessData.reviews.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No reviews available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Menu Header with Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="font-bold text-green-600">${item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.isVegetarian && <Badge variant="outline" className="text-xs">Vegetarian</Badge>}
                        {item.isVegan && <Badge variant="outline" className="text-xs">Vegan</Badge>}
                        {item.isGlutenFree && <Badge variant="outline" className="text-xs">Gluten Free</Badge>}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{item.preparationTime} min</span>
                        {item.calories && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{item.calories} cal</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No menu items found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {businessData.posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>By {post.author}</span>
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {formatNumber(post.views)}
                                </span>
                                <span className="flex items-center">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {formatNumber(post.likes)}
                                </span>
                                <span className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {formatNumber(post.comments)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Multiple Images Display */}
                        {(post.imageUrls && post.imageUrls.length > 0) || post.imageUrl ? (
                          <div className="space-y-2">
                            {post.imageUrls && post.imageUrls.length > 0 ? (
                              <div className={`grid gap-2 ${
                                post.imageUrls.length === 1 ? 'grid-cols-1' :
                                post.imageUrls.length === 2 ? 'grid-cols-2' :
                                post.imageUrls.length === 3 ? 'grid-cols-3' :
                                'grid-cols-2'
                              }`}>
                                {post.imageUrls.slice(0, 4).map((imageUrl, imageIndex) => (
                                  <div key={imageIndex} className={`relative bg-gray-100 rounded-lg overflow-hidden ${
                                    post.imageUrls!.length === 1 ? 'aspect-video' : 'aspect-square'
                                  }`}>
                                    <img
                                      src={imageUrl}
                                      alt={`${post.title} - Image ${imageIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    {imageIndex === 3 && post.imageUrls!.length > 4 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-semibold text-lg">
                                          +{post.imageUrls!.length - 4}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : post.imageUrl && (
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {businessData.posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No posts available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessData.reels.map((reel) => (
                  <Card key={reel.id} className="overflow-hidden">
                    <div className="aspect-[9/16] bg-gray-100 relative group">
                      {reel.videoUrl ? (
                        <div className="relative w-full h-full">
                          <video
                            className="w-full h-full object-cover cursor-pointer"
                            poster={reel.thumbnailUrl}
                            controls
                            preload="metadata"
                            muted
                            loop
                            onMouseEnter={(e) => {
                              const video = e.target as HTMLVideoElement
                              video.play().catch(() => {})
                            }}
                            onMouseLeave={(e) => {
                              const video = e.target as HTMLVideoElement
                              video.pause()
                              video.currentTime = 0
                            }}
                            onClick={(e) => {
                              const video = e.target as HTMLVideoElement
                              if (video.paused) {
                                video.play()
                              } else {
                                video.pause()
                              }
                            }}
                          >
                            <source src={reel.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                            <Play className="h-12 w-12 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ) : reel.thumbnailUrl ? (
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="bg-black bg-opacity-50 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{reel.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{reel.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {reel.hashtags.slice(0, 3).map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {formatNumber(reel.views)}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {formatNumber(reel.likes)}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {formatNumber(reel.comments)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {businessData.reels.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No reels available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {businessData.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {review.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="font-medium mb-2">{review.title}</h5>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          
                          {review.businessReply && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm text-blue-600">Business Reply</span>
                                <span className="text-xs text-gray-500">
                                  {review.repliedAt && new Date(review.repliedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{review.businessReply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {businessData.reviews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No reviews available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
