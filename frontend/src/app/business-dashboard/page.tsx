'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Image, 
  Menu, 
  Star, 
  MessageSquare, 
  Video, 
  FileText,
  Plus,
  Eye,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '@/services/business-profile-api.service'

// Import dashboard components
import SliderManagement from './components/SliderManagement'
import MenuManagement from './components/MenuManagement'
import RatingManagement from './components/RatingManagement'
import ReelsManagement from './components/ReelsManagement'
import PostsManagement from './components/PostsManagement'
import ProfileManagement from './components/ProfileManagement'

export default function BusinessDashboard() {
  const { userId, isAuthenticated, isLoaded, isBusinessUser, userType, getToken } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Refresh data when switching to overview tab
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'overview' && userId) {
      loadBusinessProfile()
    }
  }



  // Load business profile when user ID is available
  useEffect(() => {
    if (userId) {
      loadBusinessProfile()
    }
  }, [userId])

  // Listen for business profile updates from child components
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (userId && activeTab === 'overview') {
        loadBusinessProfile()
      }
    }

    window.addEventListener('businessProfileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('businessProfileUpdated', handleProfileUpdate)
  }, [userId, activeTab])

  const loadBusinessProfile = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      // Get JWT token for authentication
      const token = await getToken()
      if (!token) {
        console.error('No authentication token available')
        return
      }

      // Use MongoDB backend API instead of JSON file
      const response = await fetch(`http://localhost:3000/api/business-profiles/my-profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error('Failed to fetch business profiles:', response.status, response.statusText)
        return
      }
      
      const profiles = await response.json()
      console.log('MongoDB profiles data:', profiles)
      
      // Take the first profile if multiple exist
      if (profiles && profiles.length > 0) {
        const profile = profiles[0]
        
        // Debug logging to see what data we're getting from MongoDB
        console.log('MongoDB Profile data debug:', {
          menuItemsCount: profile.menuItems?.length || 0,
          sliderImagesCount: profile.sliderImages?.length || 0,
          postsCount: profile.posts?.length || 0,
          reelsCount: profile.reels?.length || 0,
          ratingsCount: profile.ratings?.length || 0,
          reviewsCount: profile.reviews?.length || 0
        })
        
        // Set the profile data directly from MongoDB
        const fullProfile = {
          ...profile,
          sliderImages: profile.sliderImages || [],
          menuItems: profile.menuItems || [],
          posts: profile.posts || [],
          reels: profile.reels || [],
          ratings: profile.ratings || [],
          reviews: profile.reviews || []
        }
        
        console.log('Final MongoDB profile data:', {
          businessName: fullProfile.businessName,
          menuItemsCount: fullProfile.menuItems?.length || 0,
          sliderImagesCount: fullProfile.sliderImages?.length || 0,
          postsCount: fullProfile.posts?.length || 0,
          reelsCount: fullProfile.reels?.length || 0
        })
        
        setBusinessProfile(fullProfile)
      } else {
        console.log('No profiles found for user')
        setBusinessProfile(null)
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Restrict access to business users only
  if (isLoaded && isAuthenticated && !isBusinessUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This dashboard is only available for business account holders. 
            {userType === 'TRAVELER' ? ' You are currently signed in as a traveller.' : ' Please contact support if you believe this is an error.'}
          </p>
          <div className="space-y-3">
            <a 
              href="/business/registration" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register as Business
            </a>
            <br />
            <a 
              href="/business-profile" 
              className="inline-block text-blue-600 hover:text-blue-700 transition-colors"
            >
              Browse Businesses Instead
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (isLoaded && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the business dashboard.</p>
          <a 
            href="/sign-in" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }



  // Production-ready stats - will show real data once profile exists
  const stats = [
    {
      title: 'Slider Images',
      value: businessProfile?.sliderImages?.length || '0',
      change: 'Active images',
      icon: Image,
      color: 'text-blue-600'
    },
    {
      title: 'Menu Items',
      value: businessProfile?.menuItems?.length || '0', 
      change: 'Available items',
      icon: Menu,
      color: 'text-green-600'
    },
    {
      title: 'Posts',
      value: businessProfile?.posts?.length || '0',
      change: 'Published posts',
      icon: FileText,
      color: 'text-indigo-600'
    },
    {
      title: 'Reels',
      value: businessProfile?.reels?.length || '0',
      change: 'Video content',
      icon: Video,
      color: 'text-red-600'
    },
    {
      title: 'Total Reviews',
      value: businessProfile?.ratings?.length || '0',
      change: 'All reviews',
      icon: MessageSquare,
      color: 'text-yellow-600'
    },
    {
      title: 'Average Rating',
      value: businessProfile?.ratings?.length > 0 
        ? (businessProfile.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / businessProfile.ratings.length).toFixed(1)
        : '0',
      change: 'Overall score',
      icon: Star,
      color: 'text-purple-600'
    }
  ]

  const getRecentActivities = () => {
    if (!businessProfile) return []
    
    const activities = []
    
    // Recent reviews (all reviews, no approval needed)
    const recentReviews = businessProfile.ratings || []
    recentReviews.slice(0, 3).forEach((review: any) => {
      activities.push({
        type: 'review',
        message: `New ${review.rating}-star review from ${review.customerName}`,
        time: new Date(review.createdAt).toLocaleDateString()
      })
    })
    
    // If no activities, show setup message
    if (activities.length === 0) {
      activities.push({
        type: 'setup',
        message: 'Complete your business profile setup to start receiving reviews',
        time: 'Get started'
      })
    }
    
    return activities.slice(0, 4)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your business dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">
            {businessProfile ? 
              `Manage ${businessProfile.businessName || 'your business'} profile and content` :
              'Create and manage your business profile'
            }
          </p>
          {!businessProfile && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Welcome!</strong> Start by creating your business profile in the Overview tab to showcase your business to customers.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="slider" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Slider
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ratings
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Reels
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your business content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!businessProfile ? (
                    <div className="text-center p-4">
                      <p className="text-sm text-gray-600 mb-4">Create your business profile to get started</p>
                      <Button 
                        onClick={() => setActiveTab('slider')} 
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Set Up Business Profile
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={() => setActiveTab('ratings')} 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Manage Ratings ({businessProfile.ratings?.filter((r: any) => !r.isApproved)?.length || 0} pending)
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('slider')} 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Add Slider Image
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('menu')} 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Menu className="mr-2 h-4 w-4" />
                        Update Menu
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('posts')} 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Post
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecentActivities().map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'review' ? 'bg-yellow-500' : 
                            activity.type === 'approved' ? 'bg-green-500' : 
                            'bg-blue-500'
                          }`}></div>
                          <span className="text-sm">{activity.message}</span>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feature Tabs */}
          <TabsContent value="slider">
            <SliderManagement />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingManagement />
          </TabsContent>

          <TabsContent value="reels">
            <ReelsManagement />
          </TabsContent>

          <TabsContent value="posts">
            <PostsManagement />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}