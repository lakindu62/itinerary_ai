'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Plus, Save, Eye, CheckCircle } from 'lucide-react'

// Simple API function for testing
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/business-profiles')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Test failed:', error)
    throw error
  }
}

// Mock business profile management component
export default function BusinessProfileSliderPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    categories: ''
  })
  
  // Media items state
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Test API connection on component mount
  useEffect(() => {
    testAPIConnection()
  }, [])

  const testAPIConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await testAPI()
      console.log('API Response:', data)
      setProfiles(data.profiles || [])
      setSuccess('✅ Successfully connected to backend API!')
    } catch (err: any) {
      console.error('API connection failed:', err)
      setError(`❌ Backend connection failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async () => {
    if (!profileForm.businessName) {
      setError('Business name is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('http://localhost:3000/api/business-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: profileForm.businessName,
          ownerId: 'user_123', // Mock user ID
          description: profileForm.description,
          location: profileForm.location,
          phone: profileForm.phone,
          email: profileForm.email,
          website: profileForm.website,
          categories: profileForm.categories.split(',').map(c => c.trim()).filter(c => c)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create profile')
      }

      const newProfile = await response.json()
      console.log('Created profile:', newProfile)
      setProfiles([...profiles, newProfile])
      setSuccess('✅ Business profile created successfully!')
      
      // Reset form
      setProfileForm({
        businessName: '',
        description: '',
        location: '',
        phone: '',
        email: '',
        website: '',
        categories: ''
      })
    } catch (err: any) {
      console.error('Error creating profile:', err)
      setError(`❌ Failed to create profile: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedia = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    // For demo purposes, we'll add it to local state
    // In real implementation, you would upload to backend
    const newMedia = {
      id: Date.now().toString(),
      type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
      filename: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      order: mediaItems.length
    }

    setMediaItems([...mediaItems, newMedia])
    setSelectedFile(null)
    setSuccess(`✅ ${newMedia.type === 'image' ? 'Image' : 'Video'} added to slider!`)
    
    // Clear file input
    const fileInput = document.getElementById('media-file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleRemoveMedia = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id))
    setSuccess('✅ Media item removed!')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Profile Management</h1>
        <Button 
          onClick={testAPIConnection}
          variant="outline"
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Test API
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Backend URL:</strong> http://localhost:3000/api</p>
            <p><strong>Profiles Found:</strong> {profiles.length}</p>
            <p><strong>Status:</strong> {loading ? '🔄 Testing...' : success ? '✅ Connected' : error ? '❌ Failed' : '⏳ Not tested'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Create Business Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                placeholder="Enter business name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileForm.website}
                onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                placeholder="Enter website URL"
              />
            </div>
            
            <div>
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                value={profileForm.categories}
                onChange={(e) => setProfileForm({...profileForm, categories: e.target.value})}
                placeholder="Enter categories (comma separated)"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profileForm.description}
              onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
              placeholder="Describe your business"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleCreateProfile} 
            disabled={loading || !profileForm.businessName}
            className="w-full md:w-auto"
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Media Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add Media to Slider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="media-file">Select Image or Video</Label>
            <Input
              id="media-file"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
            />
          </div>
          
          {selectedFile && (
            <div className="border rounded-lg p-4">
              <p><strong>Selected:</strong> {selectedFile.name}</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
          
          <Button 
            onClick={handleAddMedia} 
            disabled={!selectedFile}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Slider
          </Button>
        </CardContent>
      </Card>

      {/* Current Media Display */}
      {mediaItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Media Items ({mediaItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaItems.map((item) => (
                <div key={item.id} className="relative border rounded-lg p-4">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.filename} 
                      className="w-full h-32 object-cover rounded mb-2" 
                    />
                  ) : (
                    <video 
                      src={item.url} 
                      className="w-full h-32 object-cover rounded mb-2" 
                      controls 
                    />
                  )}
                  <p className="text-sm font-medium truncate">{item.filename}</p>
                  <p className="text-xs text-gray-500">Order: {item.order}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveMedia(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Profiles Display */}
      {profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Business Profiles ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile, index) => (
                <div key={profile.id || index} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{profile.businessName}</h3>
                  <p className="text-sm text-gray-600">{profile.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                    <p><strong>Categories:</strong> {profile.categories?.join(', ') || 'None'}</p>
                    <p><strong>Slider Images:</strong> {profile.sliderImages?.length || 0}</p>
                    <p><strong>Videos:</strong> {profile.videos?.length || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify({ 
                profilesCount: profiles.length, 
                mediaItemsCount: mediaItems.length,
                selectedFile: selectedFile?.name,
                loading, 
                error: error?.substring(0, 100),
                success: success?.substring(0, 100)
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}