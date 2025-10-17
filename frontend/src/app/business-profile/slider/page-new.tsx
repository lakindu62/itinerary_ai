'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Plus, Save, Eye } from 'lucide-react'
import { businessProfileApi, BusinessProfile, CreateMediaData } from '../api/business-profile-new.api'

// Mock user ID for development - replace with actual user context
const MOCK_USER_ID = 'user_123'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  filename: string
  order: number
  title?: string
  description?: string
}

export default function BusinessProfileSliderPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
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
  
  // Media upload state
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaDescription, setMediaDescription] = useState('')

  // Load or create profile on component mount
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // First, try to get existing profiles for this user
      const profiles = await businessProfileApi.getProfilesByOwner(MOCK_USER_ID)
      
      if (profiles.length > 0) {
        // Use the first profile
        const userProfile = profiles[0]
        setProfile(userProfile)
        setProfileForm({
          businessName: userProfile.businessName,
          description: userProfile.description || '',
          location: userProfile.location || '',
          phone: userProfile.phone || '',
          email: userProfile.email || '',
          website: userProfile.website || '',
          categories: userProfile.categories.join(', ')
        })
      } else {
        // No profile exists, we'll create one when user saves
        console.log('No existing profile found for user')
      }
    } catch (err: any) {
      console.error('Error loading profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const categories = profileForm.categories.split(',').map(c => c.trim()).filter(c => c.length > 0)
      
      if (!profile) {
        // Create new profile
        const newProfile = await businessProfileApi.createProfile({
          businessName: profileForm.businessName,
          ownerId: MOCK_USER_ID,
          description: profileForm.description,
          location: profileForm.location,
          phone: profileForm.phone,
          email: profileForm.email,
          website: profileForm.website,
          categories
        })
        setProfile(newProfile)
        setSuccess('Business profile created successfully!')
      } else {
        // Update existing profile
        const updatedProfile = await businessProfileApi.updateProfile(profile.id, {
          businessName: profileForm.businessName,
          description: profileForm.description,
          location: profileForm.location,
          phone: profileForm.phone,
          email: profileForm.email,
          website: profileForm.website,
          categories
        }, MOCK_USER_ID)
        setProfile(updatedProfile)
        setSuccess('Business profile updated successfully!')
      }
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setMediaFile(file)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  const handleMediaUpload = async () => {
    if (!profile) {
      setError('Please create a business profile first')
      return
    }
    
    if (!mediaFile) {
      setError('Please select a file to upload')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // For demo purposes, we'll use a mock URL
      // In real implementation, you would upload the file to your storage service first
      const mockUrl = `https://example.com/uploads/${mediaFile.name}`
      
      const mediaData: CreateMediaData = {
        type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
        url: mockUrl,
        filename: mediaFile.name,
        title: mediaTitle,
        description: mediaDescription,
        order: profile.sliderImages.length
      }

      if (mediaData.type === 'image') {
        const updatedProfile = await businessProfileApi.addSliderImage(profile.id, mediaData, MOCK_USER_ID)
        setProfile(updatedProfile)
        setSuccess('Image added to slider successfully!')
      } else {
        const updatedProfile = await businessProfileApi.addVideo(profile.id, mediaData, MOCK_USER_ID)
        setProfile(updatedProfile)
        setSuccess('Video added successfully!')
      }

      // Reset form
      setMediaFile(null)
      setMediaPreview(null)
      setMediaTitle('')
      setMediaDescription('')
      
      // Clear file input
      const fileInput = document.getElementById('media-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (err: any) {
      console.error('Error uploading media:', err)
      setError(err.message || 'Failed to upload media')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMedia = async (mediaId: string, type: 'image' | 'video') => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      if (type === 'image') {
        await businessProfileApi.removeSliderImage(profile.id, mediaId, MOCK_USER_ID)
      } else {
        await businessProfileApi.removeVideo(profile.id, mediaId, MOCK_USER_ID)
      }
      
      // Reload profile to get updated media list
      await loadUserProfile()
      setSuccess(`${type === 'image' ? 'Image' : 'Video'} removed successfully!`)
    } catch (err: any) {
      console.error('Error removing media:', err)
      setError(err.message || 'Failed to remove media')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Profile Management</h1>
        <Button 
          onClick={() => window.open('/business-profile/preview', '_blank')}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview Profile
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant=\"destructive\">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription className=\"text-green-600\">{success}</AlertDescription>
        </Alert>
      )}

      {/* Business Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <Save className=\"h-5 w-5\" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
              <Label htmlFor=\"businessName\">Business Name *</Label>
              <Input
                id=\"businessName\"
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                placeholder=\"Enter business name\"
                required
              />
            </div>
            
            <div>
              <Label htmlFor=\"location\">Location</Label>
              <Input
                id=\"location\"
                value={profileForm.location}
                onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                placeholder=\"Enter location\"
              />
            </div>
            
            <div>
              <Label htmlFor=\"phone\">Phone</Label>
              <Input
                id=\"phone\"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                placeholder=\"Enter phone number\"
              />
            </div>
            
            <div>
              <Label htmlFor=\"email\">Email</Label>
              <Input
                id=\"email\"
                type=\"email\"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                placeholder=\"Enter email address\"
              />
            </div>
            
            <div>
              <Label htmlFor=\"website\">Website</Label>
              <Input
                id=\"website\"
                value={profileForm.website}
                onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                placeholder=\"Enter website URL\"
              />
            </div>
            
            <div>
              <Label htmlFor=\"categories\">Categories</Label>
              <Input
                id=\"categories\"
                value={profileForm.categories}
                onChange={(e) => setProfileForm({...profileForm, categories: e.target.value})}
                placeholder=\"Enter categories (comma separated)\"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor=\"description\">Description</Label>
            <Textarea
              id=\"description\"
              value={profileForm.description}
              onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
              placeholder=\"Describe your business\"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleProfileSave} 
            disabled={loading || !profileForm.businessName}
            className=\"w-full md:w-auto\"
          >
            {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Media Upload Section */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Upload className=\"h-5 w-5\" />
              Add Media to Slider
            </CardTitle>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div>
              <Label htmlFor=\"media-file\">Select Image or Video</Label>
              <Input
                id=\"media-file\"
                type=\"file\"
                accept=\"image/*,video/*\"
                onChange={handleFileSelect}
              />
            </div>
            
            {mediaPreview && (
              <div className=\"border rounded-lg p-4\">
                <Label>Preview:</Label>
                {mediaFile?.type.startsWith('image/') ? (
                  <img src={mediaPreview} alt=\"Preview\" className=\"mt-2 max-w-xs h-auto rounded\" />
                ) : (
                  <video src={mediaPreview} controls className=\"mt-2 max-w-xs h-auto rounded\" />
                )}
              </div>
            )}
            
            <div>
              <Label htmlFor=\"mediaTitle\">Title (Optional)</Label>
              <Input
                id=\"mediaTitle\"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder=\"Enter media title\"
              />
            </div>
            
            <div>
              <Label htmlFor=\"mediaDescription\">Description (Optional)</Label>
              <Textarea
                id=\"mediaDescription\"
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                placeholder=\"Enter media description\"
                rows={2}
              />
            </div>
            
            <Button 
              onClick={handleMediaUpload} 
              disabled={loading || !mediaFile}
              className=\"w-full md:w-auto\"
            >
              <Plus className=\"h-4 w-4 mr-2\" />
              {loading ? 'Uploading...' : 'Add to Slider'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Media Display */}
      {profile && (
        <>
          {/* Slider Images */}
          {profile.sliderImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Slider Images ({profile.sliderImages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
                  {profile.sliderImages.map((image) => (
                    <div key={image.id} className=\"relative border rounded-lg p-4\">
                      <div className=\"bg-gray-200 rounded aspect-video flex items-center justify-center mb-2\">
                        <span className=\"text-gray-500\">Image Preview</span>
                      </div>
                      <p className=\"text-sm font-medium\">{image.filename}</p>
                      <p className=\"text-xs text-gray-500\">Order: {image.order}</p>
                      <Button
                        variant=\"destructive\"
                        size=\"sm\"
                        className=\"absolute top-2 right-2\"
                        onClick={() => handleRemoveMedia(image.id, 'image')}
                      >
                        <X className=\"h-4 w-4\" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos */}
          {profile.videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Videos ({profile.videos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
                  {profile.videos.map((video) => (
                    <div key={video.id} className=\"relative border rounded-lg p-4\">
                      <div className=\"bg-gray-200 rounded aspect-video flex items-center justify-center mb-2\">
                        <span className=\"text-gray-500\">Video Preview</span>
                      </div>
                      <p className=\"text-sm font-medium\">{video.filename}</p>
                      <p className=\"text-xs text-gray-500\">Order: {video.order}</p>
                      <Button
                        variant=\"destructive\"
                        size=\"sm\"
                        className=\"absolute top-2 right-2\"
                        onClick={() => handleRemoveMedia(video.id, 'video')}
                      >
                        <X className=\"h-4 w-4\" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className=\"text-xs bg-gray-100 p-4 rounded overflow-auto\">
              {JSON.stringify({ profile, loading, error }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}