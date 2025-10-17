'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function TestRatings() {
  const { userId } = useAuth()
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    if (!userId) {
      setTestResult({ error: 'No user ID available' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      const data = await response.json()
      setTestResult({
        status: response.status,
        data: data,
        userId: userId
      })
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testWithDemoUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo`)
      const data = await response.json()
      setTestResult({
        status: response.status,
        data: data,
        userId: 'owner_demo (demo user)'
      })
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Ratings API</h1>
      
      <div className="space-y-4">
        <div>
          <p>Current User ID: {userId || 'Not logged in'}</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={testAPI} disabled={loading || !userId}>
            Test API with Current User
          </Button>
          <Button onClick={testWithDemoUser} disabled={loading}>
            Test API with Demo User
          </Button>
        </div>

        {loading && <p>Loading...</p>}

        {testResult && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}