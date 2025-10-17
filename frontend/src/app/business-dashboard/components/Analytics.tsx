'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Heart,
  MessageCircle,
  Share,
  Users,
  Calendar,
  Clock,
  Star,
  DollarSign,
  Target,
  Award,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalShares: number
    averageRating: number
    totalReviews: number
    monthlyRevenue: number
    customerGrowth: number
  }
  trends: {
    viewsTrend: number
    likesTrend: number
    commentsTrend: number
    sharesTrend: number
    ratingTrend: number
    revenueTrend: number
  }
  demographics: {
    ageGroups: { group: string; percentage: number }[]
    topLocations: { location: string; percentage: number }[]
  }
  contentPerformance: {
    topPosts: { id: string; title: string; views: number; engagement: number }[]
    topReels: { id: string; title: string; views: number; engagement: number }[]
    topSliderImages: { id: string; title: string; views: number; clicks: number }[]
  }
  timeAnalytics: {
    peakHours: { hour: number; activity: number }[]
    peakDays: { day: string; activity: number }[]
  }
  engagementMetrics: {
    engagementRate: number
    averageSessionDuration: number
    bounceRate: number
    conversionRate: number
  }
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 45678,
          totalLikes: 3456,
          totalComments: 789,
          totalShares: 1234,
          averageRating: 4.7,
          totalReviews: 234,
          monthlyRevenue: 28500,
          customerGrowth: 12.5
        },
        trends: {
          viewsTrend: 15.3,
          likesTrend: 8.7,
          commentsTrend: -2.1,
          sharesTrend: 12.4,
          ratingTrend: 0.3,
          revenueTrend: 18.2
        },
        demographics: {
          ageGroups: [
            { group: '18-24', percentage: 15 },
            { group: '25-34', percentage: 35 },
            { group: '35-44', percentage: 28 },
            { group: '45-54', percentage: 15 },
            { group: '55+', percentage: 7 }
          ],
          topLocations: [
            { location: 'New York', percentage: 25 },
            { location: 'Los Angeles', percentage: 18 },
            { location: 'Chicago', percentage: 12 },
            { location: 'Miami', percentage: 10 },
            { location: 'Boston', percentage: 8 }
          ]
        },
        contentPerformance: {
          topPosts: [
            { id: '1', title: 'New Summer Menu Available Now!', views: 8500, engagement: 15.2 },
            { id: '2', title: 'Wine Tasting Event This Friday', views: 6200, engagement: 12.8 },
            { id: '3', title: 'Meet Our Head Chef', views: 4100, engagement: 9.5 }
          ],
          topReels: [
            { id: '1', title: 'Fresh Pasta Making', views: 12000, engagement: 18.5 },
            { id: '2', title: 'Weekend Special', views: 9800, engagement: 16.2 },
            { id: '3', title: 'Behind the Kitchen', views: 7300, engagement: 14.1 }
          ],
          topSliderImages: [
            { id: '1', title: 'Signature Dish Showcase', views: 15000, clicks: 1200 },
            { id: '2', title: 'Restaurant Ambiance', views: 12000, clicks: 950 },
            { id: '3', title: 'Chef in Action', views: 9500, clicks: 720 }
          ]
        },
        timeAnalytics: {
          peakHours: [
            { hour: 12, activity: 85 },
            { hour: 13, activity: 92 },
            { hour: 18, activity: 88 },
            { hour: 19, activity: 95 },
            { hour: 20, activity: 89 }
          ],
          peakDays: [
            { day: 'Monday', activity: 75 },
            { day: 'Tuesday', activity: 68 },
            { day: 'Wednesday', activity: 72 },
            { day: 'Thursday', activity: 85 },
            { day: 'Friday', activity: 95 },
            { day: 'Saturday', activity: 88 },
            { day: 'Sunday', activity: 82 }
          ]
        },
        engagementMetrics: {
          engagementRate: 6.8,
          averageSessionDuration: 3.2,
          bounceRate: 35.4,
          conversionRate: 4.2
        }
      }
      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const renderTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (!analyticsData) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderTrendIcon(analyticsData.trends.viewsTrend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.viewsTrend)}`}>
                    {Math.abs(analyticsData.trends.viewsTrend)}%
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold">
                  {formatNumber(analyticsData.overview.totalLikes + analyticsData.overview.totalComments + analyticsData.overview.totalShares)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderTrendIcon(analyticsData.trends.likesTrend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.likesTrend)}`}>
                    {Math.abs(analyticsData.trends.likesTrend)}%
                  </span>
                </div>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{analyticsData.overview.averageRating}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderTrendIcon(analyticsData.trends.ratingTrend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.ratingTrend)}`}>
                    {Math.abs(analyticsData.trends.ratingTrend)}
                  </span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">${formatNumber(analyticsData.overview.monthlyRevenue)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderTrendIcon(analyticsData.trends.revenueTrend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.revenueTrend)}`}>
                    {Math.abs(analyticsData.trends.revenueTrend)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-blue-600">{analyticsData.engagementMetrics.engagementRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
              <p className="text-3xl font-bold text-green-600">{analyticsData.engagementMetrics.averageSessionDuration}m</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-3xl font-bold text-orange-600">{analyticsData.engagementMetrics.bounceRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-purple-600">{analyticsData.engagementMetrics.conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
            <CardDescription>Audience age distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.demographics.ageGroups.map((group) => (
                <div key={group.group} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{group.group}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{group.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Customer geographic distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.demographics.topLocations.map((location) => (
                <div key={location.location} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{location.location}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{location.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Posts</CardTitle>
            <CardDescription>Best performing blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.contentPerformance.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{formatNumber(post.views)} views</span>
                      <span>•</span>
                      <span>{post.engagement}% engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Reels</CardTitle>
            <CardDescription>Best performing video content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.contentPerformance.topReels.map((reel, index) => (
                <div key={reel.id} className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{reel.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{formatNumber(reel.views)} views</span>
                      <span>•</span>
                      <span>{reel.engagement}% engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Slider Images</CardTitle>
            <CardDescription>Most viewed slider content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.contentPerformance.topSliderImages.map((image, index) => (
                <div key={image.id} className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{formatNumber(image.views)} views</span>
                      <span>•</span>
                      <span>{formatNumber(image.clicks)} clicks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Most active hours of the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.timeAnalytics.peakHours.map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {hour.hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${hour.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{hour.activity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Days</CardTitle>
            <CardDescription>Most active days of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.timeAnalytics.peakDays.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day.day}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${day.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{day.activity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>AI-powered business insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900">Peak Performance</h4>
                  <p className="text-sm text-blue-700">
                    Your reels perform 23% better than posts. Consider creating more video content.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <Award className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900">Customer Satisfaction</h4>
                  <p className="text-sm text-green-700">
                    Your rating increased by 0.3 points this month. Keep up the excellent service!
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-orange-900">Optimal Timing</h4>
                  <p className="text-sm text-orange-700">
                    Post content between 6-8 PM for maximum engagement. Friday is your best day.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-purple-900">Audience Growth</h4>
                  <p className="text-sm text-purple-700">
                    25-34 age group is your largest audience. Tailor content for this demographic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}