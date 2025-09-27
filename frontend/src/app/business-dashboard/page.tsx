'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Bell
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// Import dashboard components
import SliderManagement from './components/SliderManagement'
import MenuManagement from './components/MenuManagement'
import RatingManagement from './components/RatingManagement'
import ReviewsManagement from './components/ReviewsManagement'
import ReelsManagement from './components/ReelsManagement'
import PostsManagement from './components/PostsManagement'
import Analytics from './components/Analytics'
import NotificationCenter from './components/NotificationCenter'

export default function BusinessDashboard() {
  const { userId, isAuthenticated, isLoaded } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [isLoaded, isAuthenticated, router])

  // Load business profile when user ID is available
  useEffect(() => {
    if (userId) {
      loadBusinessProfile()
    }
  }, [userId])

  const loadBusinessProfile = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setBusinessProfile(data.profile)
      }
    } catch (error) {
      console.error('Error loading business profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !userId) {
    return null
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
      title: 'Pending Reviews',
      value: businessProfile?.ratings?.filter((r: any) => !r.isApproved)?.length || '0',
      change: 'Need approval',
      icon: MessageSquare,
      color: 'text-yellow-600'
    },
    {
      title: 'Published Reviews',
      value: businessProfile?.ratings?.filter((r: any) => r.isApproved)?.length || '0',
      change: 'Live reviews',
      icon: Star,
      color: 'text-purple-600'
    }
  ]

  const getRecentActivities = () => {
    if (!businessProfile) return []
    
    const activities = []
    
    // Recent reviews (pending approval)
    const pendingReviews = businessProfile.ratings?.filter((r: any) => !r.isApproved) || []
    pendingReviews.slice(0, 2).forEach((review: any) => {
      activities.push({
        type: 'review',
        message: `New ${review.rating}-star review from ${review.customerName} needs approval`,
        time: new Date(review.createdAt).toLocaleDateString()
      })
    })
    
    // Recent approved reviews
    const approvedReviews = businessProfile.ratings?.filter((r: any) => r.isApproved) || []
    approvedReviews.slice(0, 1).forEach((review: any) => {
      activities.push({
        type: 'approved',
        message: `Review from ${review.customerName} was approved and published`,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your business dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">
            {businessProfile ? 
              `Manage ${businessProfile.businessName || 'your business'} profile, content, and analytics` :
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8">
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
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Reels
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from last month
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
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Manage Reviews ({businessProfile.ratings?.filter((r: any) => !r.isApproved)?.length || 0} pending)
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

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="reels">
            <ReelsManagement />
          </TabsContent>

          <TabsContent value="posts">
            <PostsManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}