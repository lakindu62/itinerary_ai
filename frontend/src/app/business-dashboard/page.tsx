'use client'

import { useState } from 'react'
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
  Calendar
} from 'lucide-react'

// Import dashboard components
import SliderManagement from './components/SliderManagement'
import MenuManagement from './components/MenuManagement'
import RatingManagement from './components/RatingManagement'
import ReviewsManagement from './components/ReviewsManagement'
import ReelsManagement from './components/ReelsManagement'
import PostsManagement from './components/PostsManagement'
import Analytics from './components/Analytics'

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for overview cards
  const stats = [
    {
      title: 'Total Views',
      value: '12,345',
      change: '+12%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Total Reviews',
      value: '234',
      change: '+8%',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$8,432',
      change: '+15%',
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ]

  const recentActivities = [
    { type: 'review', message: 'New 5-star review received', time: '2 hours ago' },
    { type: 'booking', message: 'New booking for tomorrow', time: '4 hours ago' },
    { type: 'post', message: 'New post published', time: '6 hours ago' },
    { type: 'menu', message: 'Menu item updated', time: '1 day ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">Manage your business profile, content, and analytics</p>
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
                  <Button 
                    onClick={() => setActiveTab('reels')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Upload Reel
                  </Button>
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
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
        </Tabs>
      </div>
    </div>
  )
}