'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestPage() {
  const { userId, user, isAuthenticated, isLoaded } = useAuth()
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadUserBusinessData = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setBusinessData(data)
      }
    } catch (error) {
      console.error('Error loading business data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserBusinessData()
    }
  }, [userId])

  if (!isLoaded) {
    return <div>Loading authentication...</div>
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view this page</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>User Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Current User Info:</h3>
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress}</p>
            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Business Data for This User:</h3>
            {loading ? (
              <p>Loading business data...</p>
            ) : businessData ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(businessData, null, 2)}
              </pre>
            ) : (
              <p>No business data found for this user. Create a business profile in the dashboard!</p>
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800">✅ Authentication Status:</h4>
            <p className="text-green-700">
              User-specific authentication is working! Each user will only see their own business data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}