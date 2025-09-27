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
  Clock
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface Reel {
  id: string
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
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReel, setEditingReel] = useState<Reel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
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

  const loadReels = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=user_123')
      if (response.ok) {
        const data = await response.json()
        setReels(data.reels || [])
      } else {
        console.error('Failed to load reels')
        setReels([])
      }
    } catch (error) {
      console.error('Error loading reels:', error)
      setReels([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        const response = await fetch(`/api/business-profiles?ownerId=user_123`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...reelData, id: editingReel.id })
        })
        if (response.ok) {
          toast.success('Reel updated successfully!')
          loadReels()
        } else {
          throw new Error('Failed to update reel')
        }
      } else {
        const response = await fetch('/api/business-profiles?ownerId=user_123', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reelData)
        })
        if (response.ok) {
          toast.success('Reel created successfully!')
          loadReels()
        } else {
          throw new Error('Failed to create reel')
        }
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving reel:', error)
      toast.error('Failed to save reel')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (reel: Reel) => {
    setEditingReel(reel)
    setFormData({
      title: reel.title,
      description: reel.description,
      videoUrl: reel.videoUrl,
      thumbnailUrl: reel.thumbnailUrl || '',
      duration: reel.duration,
      category: reel.category,
      hashtags: (reel.hashtags || []).join(', '),
      isPublished: reel.isPublished,
      isPromoted: reel.isPromoted
    })
    setDialogOpen(true)
  }

  const handleDelete = async (reelId: string) => {
    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo&itemId=${reelId}&itemType=reel`, {
        method: 'DELETE'
      })
      if (response.ok) {
        toast.success('Reel deleted successfully!')
        loadReels()
      } else {
        throw new Error('Failed to delete reel')
      }
    } catch (error) {
      console.error('Error deleting reel:', error)
      toast.error('Failed to delete reel')
    }
  }

  const togglePublished = async (reelId: string, isPublished: boolean) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { ...reel, isPublished: !isPublished, updatedAt: new Date().toISOString() }
        : reel
    ))
    toast.success(`Reel ${!isPublished ? 'published' : 'unpublished'}!`)
  }

  const togglePromoted = async (reelId: string, isPromoted: boolean) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { ...reel, isPromoted: !isPromoted, updatedAt: new Date().toISOString() }
        : reel
    ))
    toast.success(`Reel promotion ${!isPromoted ? 'enabled' : 'disabled'}!`)
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const totalStats = {
    views: reels.reduce((sum, reel) => sum + reel.views, 0),
    likes: reels.reduce((sum, reel) => sum + reel.likes, 0),
    comments: reels.reduce((sum, reel) => sum + reel.comments, 0),
    shares: reels.reduce((sum, reel) => sum + reel.shares, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reels Management</h2>
          <p className="text-gray-600">Create and manage your business reels</p>
        </div>
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
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
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
                    value={formData.duration}
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
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your reel"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                <Input
                  id="hashtags"
                  value={formData.hashtags}
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
        {filteredReels.map((reel) => (
          <Card key={reel.id} className="overflow-hidden">
            <div className="aspect-[9/16] bg-gray-100 relative">
              {reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="h-12 w-12 text-white" />
              </div>
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
                  <Badge key={index} variant="outline" className="text-xs">
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
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(reel.id, reel.isPublished)}
                  >
                    {reel.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePromoted(reel.id, reel.isPromoted)}
                  >
                    <TrendingUp className={`h-4 w-4 ${reel.isPromoted ? 'text-yellow-500' : ''}`} />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(reel)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                        <AlertDialogAction onClick={() => handleDelete(reel.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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