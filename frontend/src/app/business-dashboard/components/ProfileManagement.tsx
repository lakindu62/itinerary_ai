'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Building2, 
  Save, 
  Edit, 
  MapPin,
  Tag,
  FileText,
  Image as ImageIcon,
  Star
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileManagement() {
  const { userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [businessData, setBusinessData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    category: '',
    location: '',
    coverImage: ''
  })

  useEffect(() => {
    loadBusinessProfile()
  }, [userId])

  const loadBusinessProfile = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`)
      const data = await response.json()
      
      if (data.profile) {
        setBusinessProfile(data.profile)
        setBusinessData(data)
        setFormData({
          businessName: data.profile.businessName || '',
          description: data.profile.description || '',
          category: data.profile.category || '',
          location: data.profile.location || '',
          coverImage: data.profile.coverImage || ''
        })
      }
    } catch (error) {
      console.error('Error loading business profile:', error)
      toast.error('Failed to load business profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!businessProfile) return

    try {
      setSaving(true)
      
      const response = await fetch('/api/admin/business', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: businessProfile.id,
          updates: formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update business profile')
      }

      const result = await response.json()
      
      // Update local state
      setBusinessProfile({ ...businessProfile, ...formData })
      setIsEditing(false)
      toast.success('Profile updated successfully! Changes will appear on your business page.')
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      businessName: businessProfile?.businessName || '',
      description: businessProfile?.description || '',
      category: businessProfile?.category || '',
      location: businessProfile?.location || '',
      coverImage: businessProfile?.coverImage || ''
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>No business profile found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please create a business profile first.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Profile</h2>
          <p className="text-gray-600">Manage your business information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update your business name, category, and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
                placeholder="e.g., Restaurant, Hotel, Shop"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your business location"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description & Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description & Media
            </CardTitle>
            <CardDescription>
              Add a description and cover image for your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
                rows={4}
                placeholder="Describe your business..."
              />
            </div>

            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
              {formData.coverImage && (
                <div className="mt-2">
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Business Statistics
            </CardTitle>
            <CardDescription>
              Overview of your business performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const approvedRatings = businessData?.ratings?.filter((r: any) => r.isApproved) || []
                    if (approvedRatings.length === 0) return '0.0'
                    const average = approvedRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedRatings.length
                    return average.toFixed(1)
                  })()}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {businessData?.ratings?.filter((r: any) => r.isApproved)?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {businessData?.posts?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {businessData?.reels?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Reels</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your business profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <ImageIcon className="h-4 w-4 mr-2" />
              Manage Slider Images
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Update Menu Items
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Review Customer Ratings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}