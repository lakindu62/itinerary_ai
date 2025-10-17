'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  User,
  MessageSquare,
  Star
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Notification {
  id: string
  customerEmail: string
  customerName: string
  businessName: string
  reviewTitle: string
  isApproved: boolean
  message: string
  sentAt: string
  status: 'sent' | 'failed' | 'pending'
  error?: string
}

export default function NotificationCenter() {
  const { userId } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications/review-approval')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (status === 'sent') {
      return (
        <Badge variant={isApproved ? 'default' : 'secondary'} className="ml-2">
          {isApproved ? 'Approved' : 'Under Review'} • Notified
        </Badge>
      )
    } else if (status === 'failed') {
      return <Badge variant="destructive" className="ml-2">Notification Failed</Badge>
    } else {
      return <Badge variant="outline" className="ml-2">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!userId) {
    return <div>Please sign in to view notifications.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Review Approval Notifications
        </CardTitle>
        <CardDescription>
          Track customer notifications sent when reviews are approved or updated
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications sent yet</p>
            <p className="text-sm">Notifications will appear here when you approve or update customer reviews</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(notification.status)}
                      <span className="font-medium">{notification.customerName}</span>
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{notification.customerEmail}</span>
                      {getStatusBadge(notification.status, notification.isApproved)}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-600">"{notification.reviewTitle}"</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    
                    {notification.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                        <p className="text-sm text-red-700">
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Error: {notification.error}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Sent: {formatDate(notification.sentAt)}</span>
                      <span>Business: {notification.businessName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Button variant="outline" onClick={loadNotifications} disabled={loading}>
                Refresh Notifications
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}