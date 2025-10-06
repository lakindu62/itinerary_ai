'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Play, 
  Pause,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Video,
  Clock,
  MoreVertical,
  Copy,
  Download,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '@/services/business-profile-api.service'
import { useAuth as useClerkAuth } from '@clerk/nextjs'

interface Reel {
  id: string
  _id?: string // MongoDB ID for API calls
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  category: string
  hashtags?: string[]
  isPublished: boolean
  isPromoted: boolean
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
  uploadProgress?: number
}

const categories = [
  'Behind the Scenes',
  'Food Preparation',
  'Menu Highlights',
  'Customer Reviews',
  'Events',
  'Staff Spotlights',
  'Promotions',
  'Tutorials'
]

export default function ReelsManagement() {
  const { userId } = useAuth()
  const { getToken } = useClerkAuth()
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReel, setEditingReel] = useState<Reel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  // Enhanced loading states for better UX
  const [deletingReelId, setDeletingReelId] = useState<string | null>(null)
  const [editingReelId, setEditingReelId] = useState<string | null>(null)
  const [togglingStates, setTogglingStates] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 0,
    category: '',
    hashtags: '',
    isPublished: true,
    isPromoted: false
  })

  useEffect(() => {
    loadReels()
  }, [])

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Ctrl/Cmd + N to create new reel
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault()
        setDialogOpen(true)
        toast.info('New reel dialog opened')
      }

      // R key to refresh reels
      if (event.key === 'r' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        loadReels()
        toast.info('Reels refreshed')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Utility functions
  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${description} copied to clipboard!`)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadReel = (reel: Reel) => {
    try {
      const link = document.createElement('a')
      link.href = reel.videoUrl
      link.download = `${reel.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Download started!')
    } catch (error) {
      console.error('Failed to download reel:', error)
      toast.error('Failed to download reel')
    }
  }

  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null)

  const loadReels = async () => {
    setLoading(true)
    try {
      const result = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
      
      if (result.data && result.data.length > 0) {
        const businessProfile = result.data[0]
        const profileId = businessProfile.id || businessProfile._id
        setBusinessProfileId(profileId) // Store the profile ID for CRUD operations
        
        const reelsData = businessProfile.reels || []
        console.log('🔍 Raw reels data from backend:', reelsData)
        
        // Ensure each reel has default values for numeric properties and proper ID handling
        const processedReels = reelsData.map((reel: any, index: number) => {
          // Prioritize MongoDB _id over custom id field for consistency
          const mongoObjectId = reel._id?.toString()
          const customId = reel.id
          const reelId = mongoObjectId || customId
          
          console.log(`📊 Processing reel ${index}:`, {
            originalId: reel.id,
            originalMongoId: reel._id,
            mongoObjectIdString: mongoObjectId,
            finalId: reelId,
            title: reel.title
          })
          
          if (!reelId) {
            console.warn('⚠️ Reel without proper ID found:', reel)
          }
          
          return {
            ...reel,
            id: reelId || `temp-${index}-${Date.now()}`, // Use MongoDB _id if available, otherwise custom id
            _id: mongoObjectId || customId, // Keep the MongoDB _id for API calls
            views: reel.views || 0,
            likes: reel.likes || 0,
            comments: reel.comments || 0,
            shares: reel.shares || 0,
            duration: reel.duration || 0
          }
        })
        setReels(processedReels)
      } else {
        setReels([])
        setBusinessProfileId(null)
      }
    } catch (error) {
      console.error('Error loading reels:', error)
      setReels([])
      setBusinessProfileId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!businessProfileId) {
      toast.error('Business profile not found. Please refresh the page.')
      return
    }
    
    setLoading(true)

    try {
      const hashtagsArray = formData.hashtags.split(',').map(h => h.trim()).filter(h => h)
      
      const reelData = {
        type: 'reel',
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        duration: formData.duration,
        category: formData.category,
        hashtags: hashtagsArray,
        isPublished: formData.isPublished,
        isPromoted: formData.isPromoted,
        views: editingReel?.views || 0,
        likes: editingReel?.likes || 0,
        comments: editingReel?.comments || 0,
        shares: editingReel?.shares || 0
      }

      if (editingReel) {
        // Update existing reel using BusinessProfileApiService  
        const reelId = editingReel._id || editingReel.id
        console.log('🔄 Updating reel with ID:', reelId, 'Profile ID:', businessProfileId)
        
        const result = await BusinessProfileApiService.updateReel(
          businessProfileId,
          reelId,
          reelData,
          getToken
        )
        
        if (result.data) {
          toast.success('Reel updated successfully!')
          await loadReels() // Reload the reels to get updated data
        } else {
          throw new Error(result.error || 'Failed to update reel')
        }
      } else {
        // Create new reel using BusinessProfileApiService
        const result = await BusinessProfileApiService.addReel(
          businessProfileId,
          reelData,
          getToken
        )
        
        if (result.data) {
          toast.success('Reel created successfully!')
          await loadReels() // Reload the reels to get updated data
        } else {
          throw new Error(result.error || 'Failed to create reel')
        }
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving reel:', error)
      toast.error(`Failed to ${editingReel ? 'update' : 'create'} reel: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (reel: Reel) => {
    // Set loading state for this specific reel
    setEditingReelId(reel.id)
    
    try {
      setEditingReel(reel)
      setFormData({
        title: reel.title || '',
        description: reel.description || '',
        videoUrl: reel.videoUrl || '',
        thumbnailUrl: reel.thumbnailUrl || '',
        duration: reel.duration || 0,
        category: reel.category || '',
        hashtags: (reel.hashtags || []).join(', '),
        isPublished: reel.isPublished ?? true,
        isPromoted: reel.isPromoted ?? false
      })
      setDialogOpen(true)
      toast.success('Reel loaded for editing')
    } catch (error) {
      console.error('Error preparing edit:', error)
      toast.error('Failed to prepare reel for editing')
    } finally {
      setEditingReelId(null)
    }
  }

  const handleDelete = async (reelId: string) => {
    if (!businessProfileId) {
      toast.error('Business profile not found. Please refresh the page.')
      return
    }

    // Find the reel to get its proper _id
    const reel = reels.find(r => r.id === reelId)
    if (!reel) {
      toast.error('Reel not found. Please refresh the page.')
      return
    }

    const actualReelId = reel?._id || reel?.id || reelId
    console.log('🗑️ Attempting to delete reel:', {
      reelId,
      actualReelId,
      businessProfileId,
      reelTitle: reel.title,
      reelData: reel
    })

    // Set loading state for this specific reel
    setDeletingReelId(reelId)
    
    try {
      // Delete reel using BusinessProfileApiService
      console.log('📡 Making delete API call...')
      const result = await BusinessProfileApiService.deleteReel(
        businessProfileId,
        actualReelId,
        getToken
      )
      
      console.log('📡 Delete API response:', result)
      
      // Check if deletion failed
      if (result.error) {
        throw new Error(result.error)
      }
      
      // For DELETE operations, success means no error (data might be null for 204 responses)
      toast.success(`Reel "${reel.title}" deleted successfully!`)
      console.log('✅ Reel deleted successfully, reloading data...')
      await loadReels() // Reload the reels to get updated data
      
    } catch (error) {
      console.error('❌ Error deleting reel:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message
      }
      
      // Check for common error scenarios
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        errorMessage = 'Reel not found. It may have been already deleted.'
      } else if (errorMessage.includes('403') || errorMessage.includes('unauthorized')) {
        errorMessage = 'You do not have permission to delete this reel.'
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        errorMessage = 'Server error occurred. Please try again later.'
      }
      
      toast.error(`Failed to delete reel: ${errorMessage}`)
    } finally {
      setDeletingReelId(null)
    }
  }

  const handleMigrateReelIds = async () => {
    if (!businessProfileId) {
      toast.error('Business profile not found. Please refresh the page.')
      return
    }

    console.log('🔄 Starting reel ID migration for profile:', businessProfileId)
    setLoading(true)
    
    try {
      const result = await BusinessProfileApiService.migrateReelIds(
        businessProfileId,
        getToken
      )
      
      console.log('📡 Migration API response:', result)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      toast.success('Reel IDs migrated successfully!')
      console.log('✅ Reel IDs migrated successfully, reloading data...')
      await loadReels() // Reload the reels to get updated data
      
    } catch (error) {
      console.error('❌ Error migrating reel IDs:', error)
      
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(`Failed to migrate reel IDs: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (reelId: string, isPublished: boolean) => {
    if (!businessProfileId) {
      toast.error('Business profile not found. Please refresh the page.')
      return
    }

    // Set loading state for this specific action
    setTogglingStates(prev => ({ ...prev, [`publish-${reelId}`]: true }))
    
    try {
      // Find the reel to get its proper _id
      const reel = reels.find(r => r.id === reelId)
      const actualReelId = reel?._id || reel?.id || reelId
      console.log('🔄 Toggling published status for reel ID:', actualReelId, 'Profile ID:', businessProfileId)
      
      // Update the reel's published status via API
      const result = await BusinessProfileApiService.updateReel(
        businessProfileId,
        actualReelId,
        { isPublished: !isPublished },
        getToken
      )
      
      if (result.data) {
        // Update local state
        setReels(prev => prev.map(reel => 
          reel.id === reelId 
            ? { ...reel, isPublished: !isPublished, updatedAt: new Date().toISOString() }
            : reel
        ))
        toast.success(`Reel ${!isPublished ? 'published' : 'unpublished'}!`)
      } else {
        throw new Error(result.error || 'Failed to update reel status')
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
      toast.error(`Failed to update reel status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTogglingStates(prev => ({ ...prev, [`publish-${reelId}`]: false }))
    }
  }

  const togglePromoted = async (reelId: string, isPromoted: boolean) => {
    if (!businessProfileId) {
      toast.error('Business profile not found. Please refresh the page.')
      return
    }

    // Set loading state for this specific action
    setTogglingStates(prev => ({ ...prev, [`promote-${reelId}`]: true }))
    
    try {
      // Find the reel to get its proper _id
      const reel = reels.find(r => r.id === reelId)
      const actualReelId = reel?._id || reel?.id || reelId
      console.log('🎯 Toggling promoted status for reel ID:', actualReelId, 'Profile ID:', businessProfileId)
      
      // Update the reel's promoted status via API
      const result = await BusinessProfileApiService.updateReel(
        businessProfileId,
        actualReelId,
        { isPromoted: !isPromoted },
        getToken
      )
      
      if (result.data) {
        // Update local state
        setReels(prev => prev.map(reel => 
          reel.id === reelId 
            ? { ...reel, isPromoted: !isPromoted, updatedAt: new Date().toISOString() }
            : reel
        ))
        toast.success(`Reel promotion ${!isPromoted ? 'enabled' : 'disabled'}!`)
      } else {
        throw new Error(result.error || 'Failed to update reel promotion')
      }
    } catch (error) {
      console.error('Error toggling promoted status:', error)
      toast.error(`Failed to update reel promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTogglingStates(prev => ({ ...prev, [`promote-${reelId}`]: false }))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: 0,
      category: '',
      hashtags: '',
      isPublished: true,
      isPromoted: false
    })
    setEditingReel(null)
    setUploadProgress(0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            // Convert file to base64 data URL for persistent storage
            const reader = new FileReader()
            reader.onload = (event) => {
              const url = event.target?.result as string
              setFormData(prev => ({
                ...prev,
                videoUrl: url,
                duration: 30 // Mock duration
              }))
            }
            reader.readAsDataURL(file)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const filteredReels = selectedCategory === 'all' 
    ? reels 
    : reels.filter(reel => reel.category === selectedCategory)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number | undefined | null) => {
    const safeNum = num || 0
    if (safeNum >= 1000000) return `${(safeNum / 1000000).toFixed(1)}M`
    if (safeNum >= 1000) return `${(safeNum / 1000).toFixed(1)}K`
    return safeNum.toString()
  }

  const totalStats = {
    views: reels.reduce((sum, reel) => sum + (reel.views || 0), 0),
    likes: reels.reduce((sum, reel) => sum + (reel.likes || 0), 0),
    comments: reels.reduce((sum, reel) => sum + (reel.comments || 0), 0),
    shares: reels.reduce((sum, reel) => sum + (reel.shares || 0), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reels Management</h2>
          <p className="text-gray-600">
            Create and manage your business reels 
            {(deletingReelId || editingReelId || Object.values(togglingStates).some(state => state)) && (
              <span className="ml-2 inline-flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                <span className="text-sm text-blue-600">Processing...</span>
              </span>
            )}
          </p>
          {/* Keyboard shortcuts hint */}
          <p className="text-xs text-gray-400 mt-1">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+N</kbd> for new reel, 
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">R</kbd> to refresh
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Show migration button if there are reels without proper MongoDB IDs */}
          {reels.some(reel => !reel._id || reel._id.toString().startsWith('temp-')) && (
            <Button 
              variant="outline" 
              onClick={handleMigrateReelIds}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Fix IDs
                </>
              )}
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Reel
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReel ? 'Edit Reel' : 'Upload New Reel'}
              </DialogTitle>
              <DialogDescription>
                {editingReel ? 'Update reel details' : 'Upload a new reel to engage your audience'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="mb-2"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <Input
                  placeholder="Or enter video URL"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter reel title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="90"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your reel"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                <Input
                  id="hashtags"
                  value={formData.hashtags || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                  placeholder="#food, #restaurant, #cooking"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPublished">Publish immediately</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPromoted"
                    checked={formData.isPromoted}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPromoted: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPromoted">Promote reel</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingReel ? 'Update' : 'Upload'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.views)}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.likes)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.comments)}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.shares)}</p>
              </div>
              <Share className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReels.map((reel, index) => (
          <Card 
            key={reel.id || `reel-card-${index}`} 
            className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              deletingReelId === reel.id ? 'opacity-50 pointer-events-none' : ''
            } ${editingReelId === reel.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          >
            <div className="aspect-[9/16] bg-gray-100 relative group cursor-pointer">
              {reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => window.open(reel.videoUrl, '_blank')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center transition-colors duration-300 group-hover:bg-gray-200">
                  <Video className="h-12 w-12 text-gray-400 transition-colors duration-300 group-hover:text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                  <Play className="h-8 w-8 text-gray-800" />
                </div>
              </div>
              
              {/* Loading overlay for actions in progress */}
              {(deletingReelId === reel.id || editingReelId === reel.id) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">
                      {deletingReelId === reel.id ? 'Deleting...' : 'Loading...'}
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {reel.isPromoted && (
                  <Badge className="bg-yellow-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Promoted
                  </Badge>
                )}
                <Badge variant={reel.isPublished ? "default" : "secondary"}>
                  {reel.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black bg-opacity-50 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(reel.duration)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{reel.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reel.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {(reel.hashtags || []).slice(0, 3).map((hashtag, index) => (
                  <Badge key={`${reel.id}-hashtag-${index}-${hashtag}`} variant="outline" className="text-xs">
                    {hashtag}
                  </Badge>
                ))}
                {(reel.hashtags || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(reel.hashtags || []).length - 3}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-4">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {formatNumber(reel.views)}
                </div>
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {formatNumber(reel.likes)}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {formatNumber(reel.comments)}
                </div>
                <div className="flex items-center">
                  <Share className="h-3 w-3 mr-1" />
                  {formatNumber(reel.shares)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublished(reel.id, reel.isPublished)}
                          disabled={togglingStates[`publish-${reel.id}`]}
                        >
                          {togglingStates[`publish-${reel.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : reel.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reel.isPublished ? 'Unpublish reel' : 'Publish reel'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePromoted(reel.id, reel.isPromoted)}
                          disabled={togglingStates[`promote-${reel.id}`]}
                        >
                          {togglingStates[`promote-${reel.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TrendingUp className={`h-4 w-4 ${reel.isPromoted ? 'text-yellow-500' : ''}`} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reel.isPromoted ? 'Remove promotion' : 'Promote reel'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(reel)}
                          disabled={editingReelId === reel.id}
                        >
                          {editingReelId === reel.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit reel</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={deletingReelId === reel.id}
                            >
                              {deletingReelId === reel.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete reel</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reel</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{reel.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(reel.id)}
                          disabled={deletingReelId === reel.id}
                        >
                          {deletingReelId === reel.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => copyToClipboard(reel.videoUrl, 'Video URL')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy video URL
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => copyToClipboard(reel.thumbnailUrl || '', 'Thumbnail URL')}
                        disabled={!reel.thumbnailUrl}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy thumbnail URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(reel.videoUrl, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View reel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadReel(reel)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReels.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === 'all' ? 'No reels uploaded' : `No ${selectedCategory.toLowerCase()} reels`}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? 'Upload your first reel to engage your audience'
                : `Upload reels in the ${selectedCategory} category`
              }
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Reel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
