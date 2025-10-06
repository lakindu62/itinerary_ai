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
  Eye, 
  EyeOff,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '@/services/business-profile-api.service'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl?: string // Keep for backward compatibility
  imageUrls?: string[] // New field for multiple images
  category: string
  tags?: string[]
  status: 'draft' | 'scheduled' | 'published'
  isPromoted: boolean
  scheduledAt?: string
  publishedAt?: string
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
  author: string
}

const categories = [
  'News & Updates',
  'Menu Items',
  'Events',
  'Promotions',
  'Behind the Scenes',
  'Customer Stories',
  'Tips & Recipes',
  'Community'
]

const postStatuses = [
  { value: 'draft', label: 'Draft', color: 'secondary' },
  { value: 'scheduled', label: 'Scheduled', color: 'outline' },
  { value: 'published', label: 'Published', color: 'default' }
]

// Image compression utility
const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1920, maxHeight: number = 1080): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = (height * maxWidth) / width
          width = maxWidth
        } else {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file) // Return original if compression fails
        }
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default function PostsManagement() {
  const { userId, getToken } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrls: [] as string[],
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published',
    isPromoted: false,
    scheduledAt: ''
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
      
      if (profileResult.error) {
        console.error('Failed to load business profile:', profileResult.error)
        toast.error(`Failed to load posts: ${profileResult.error}`)
        setPosts([])
        return
      }
      
      if (profileResult.data && profileResult.data.length > 0) {
        const profile = profileResult.data[0]
        const posts = profile.posts || []
        
        // Convert MongoDB format to component format
        const formattedPosts = posts.map((post: any, index: number) => {
          // Handle both imageUrl (single) and imageUrls (array) for backward compatibility
          const imageUrls = post.imageUrls || (post.imageUrl ? [post.imageUrl] : [])
          const imageUrl = imageUrls.length > 0 ? imageUrls[0] : undefined
          
          // Ensure unique ID for React keys
          const postId = post._id || post.id || `temp-${index}-${Date.now()}`
          
          return {
            id: postId,
            title: post.title || post.caption || 'Untitled Post',
            content: post.content || post.caption,
            excerpt: (post.content || post.caption || '').substring(0, 150) + '...',
            imageUrl, // First image for backward compatibility
            imageUrls, // All images
            category: post.category || 'General',
            tags: post.tags || [],
            status: 'published' as const,
            isPromoted: post.isPromoted || false,
            publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
            views: post.views || 0,
            likes: post.likes || 0,
            comments: post.comments || 0,
            shares: post.shares || 0,
            createdAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
            updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
            author: post.author || 'Business Owner'
          }
        })
        
        setPosts(formattedPosts)
      } else {
        setPosts([])
        // Show info message that posts functionality is coming soon
        toast.info('Posts management will be available once the backend endpoints are implemented.')
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      
      const postData = {
        type: 'post',
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        imageUrls: formData.imageUrls,
        imageUrl: formData.imageUrls[0] || '', // For backward compatibility
        category: formData.category,
        tags: tagsArray,
        status: formData.status,
        isPromoted: formData.isPromoted,
        scheduledAt: formData.scheduledAt || undefined,
        author: 'Business Owner',
        views: editingPost?.views || 0,
        likes: editingPost?.likes || 0,
        comments: editingPost?.comments || 0,
        shares: editingPost?.shares || 0,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : editingPost?.publishedAt
      }

      if (editingPost) {
        // Update existing post
        const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
        
        if (profileResult.error || !profileResult.data || profileResult.data.length === 0) {
          toast.error('Business profile not found. Please refresh and try again.')
          return
        }

        const profile = profileResult.data[0]
        const profileId = profile._id || profile.id
        
        if (!profileId) {
          console.error('No valid profileId found in profile data:', profile)
          toast.error('Unable to find business profile ID. Please refresh and try again.')
          return
        }

        const postId = editingPost.id
        if (!postId) {
          console.error('No valid postId found in editing post:', editingPost)
          toast.error('Unable to find post ID. Please refresh and try again.')
          return
        }

        console.log('📝 Frontend: Updating post', postId, 'in profile', profileId)
        
        const updateData = {
          caption: formData.content || formData.title,
          imageUrl: formData.imageUrls?.[0],
          imageUrls: formData.imageUrls,
          title: formData.title,
          content: formData.content,
          status: formData.status,
          tags: formData.tags,
          isPromoted: formData.isPromoted,
          scheduledAt: formData.scheduledAt || undefined,
          author: 'Business Owner'
        }

        const result = await BusinessProfileApiService.updatePost(profileId, postId, updateData, getToken)
        
        if (result.error) {
          console.error('Failed to update post:', result.error)
          toast.error('Failed to update post: ' + result.error)
        } else {
          console.log('✅ Post updated successfully')
          toast.success('Post updated successfully!')
          
          // Update the post in the local state
          setPosts(posts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  title: updateData.title,
                  content: updateData.content,
                  caption: updateData.caption,
                  imageUrl: updateData.imageUrl,
                  imageUrls: updateData.imageUrls,
                  status: updateData.status,
                  tags: Array.isArray(updateData.tags) ? updateData.tags : (updateData.tags ? updateData.tags.split(',').map(t => t.trim()) : []),
                  isPromoted: updateData.isPromoted,
                  scheduledAt: updateData.scheduledAt,
                  updatedAt: new Date().toISOString()
                }
              : post
          ))
          
          // Clear the editing state
          setEditingPost(null)
          setDialogOpen(false)
          resetForm()
        }
      } else {
        // Get the business profile to get the profileId
        const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
        
        if (profileResult.error || !profileResult.data || profileResult.data.length === 0) {
          toast.error('Business profile not found. Please refresh and try again.')
          return
        }

        const profile = profileResult.data[0]
        const profileId = profile._id || profile.id // Try both _id and id fields
        
        if (!profileId) {
          console.error('No valid profileId found in profile data:', profile)
          toast.error('Unable to find business profile ID. Please refresh and try again.')
          return
        }
        
        const result = await BusinessProfileApiService.addPost(profileId, {
          caption: formData.content || formData.title, // Use content as caption, fallback to title
          imageUrl: formData.imageUrls?.[0], // Use first image URL for backward compatibility
          imageUrls: formData.imageUrls, // Send all image URLs
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          isPromoted: formData.isPromoted
        }, getToken)

        if (result.error) {
          toast.error(`Failed to add post: ${result.error}`)
        } else {
          toast.success('Post added successfully!')
          loadPosts()
        }
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []),
      category: post.category,
      tags: (post.tags || []).join(', '),
      status: post.status,
      isPromoted: post.isPromoted,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ''
    })
    setImagePreview(post.imageUrls || (post.imageUrl ? [post.imageUrl] : []))
    setDialogOpen(true)
  }

  const handleDelete = async (postId: string) => {
    try {
      // Get the business profile to get the profileId
      const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
      
      if (profileResult.error || !profileResult.data || profileResult.data.length === 0) {
        toast.error('Business profile not found. Please refresh and try again.')
        return
      }

      const profileId = profileResult.data[0]._id || profileResult.data[0].id
      
      if (!profileId) {
        console.error('No valid profileId found in profile data:', profileResult.data[0])
        toast.error('Profile ID not found. Please refresh and try again.')
        return
      }
      
      console.log('Attempting to delete post:', { profileId, postId })
      const result = await BusinessProfileApiService.removePost(profileId, postId, getToken)
      console.log('Delete result:', result)

      if (result.error) {
        console.error('Delete failed:', result.error)
        toast.error(`Failed to delete post: ${result.error}`)
      } else {
        console.log('Delete successful, reloading posts...')
        toast.success('Post deleted successfully!')
        await loadPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    
    try {
      // Get the business profile to get the profileId
      const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
      
      if (profileResult.error || !profileResult.data || profileResult.data.length === 0) {
        toast.error('Business profile not found. Please refresh and try again.')
        return
      }

      const profileId = profileResult.data[0]._id || profileResult.data[0].id
      
      if (!profileId) {
        console.error('No valid profileId found in profile data:', profileResult.data[0])
        toast.error('Profile ID not found. Please refresh and try again.')
        return
      }
      
      // Delete posts one by one (since there's no bulk delete API yet)
      let successCount = 0
      let errorCount = 0
      
      console.log('Bulk deleting posts:', selectedPosts, 'with profileId:', profileId)
      for (const postId of selectedPosts) {
        try {
          console.log('Deleting post:', postId)
          const result = await BusinessProfileApiService.removePost(profileId, postId, getToken)
          console.log('Delete result for', postId, ':', result)
          if (result.error) {
            errorCount++
          } else {
            successCount++
          }
        } catch (error) {
          console.error('Delete error for', postId, ':', error)
          errorCount++
        }
      }
      
      // Clear selection and refresh
      setSelectedPosts([])
      loadPosts()
      
      // Show result toast
      if (successCount > 0 && errorCount === 0) {
        toast.success(`Successfully deleted ${successCount} posts`)
      } else if (successCount > 0 && errorCount > 0) {
        toast.info(`Deleted ${successCount} posts, ${errorCount} failed`)
      } else {
        toast.error('Failed to delete posts')
      }
    } catch (error) {
      console.error('Error bulk deleting posts:', error)
      toast.error('Failed to delete posts')
    }
  }

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'scheduled' | 'published') => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            status: newStatus,
            publishedAt: newStatus === 'published' ? new Date().toISOString() : post.publishedAt,
            updatedAt: new Date().toISOString()
          }
        : post
    ))
    toast.success(`Post ${newStatus}!`)
  }

  const togglePromoted = async (postId: string, isPromoted: boolean) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isPromoted: !isPromoted, updatedAt: new Date().toISOString() }
        : post
    ))
    toast.success(`Post promotion ${!isPromoted ? 'enabled' : 'disabled'}!`)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrls: [],
      category: '',
      tags: '',
      status: 'draft',
      isPromoted: false,
      scheduledAt: ''
    })
    setImageFiles([])
    setImagePreview([])
    setEditingPost(null)
  }

  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false
    if (selectedStatus !== 'all' && post.status !== selectedStatus) return false
    return true
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const totalStats = {
    views: posts.reduce((sum, post) => sum + post.views, 0),
    likes: posts.reduce((sum, post) => sum + post.likes, 0),
    comments: posts.reduce((sum, post) => sum + post.comments, 0),
    shares: posts.reduce((sum, post) => sum + post.shares, 0)
  }

  const statusStats = {
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Posts Management</h2>
          <p className="text-gray-600">Create and manage your blog posts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </DialogTitle>
              <DialogDescription>
                {editingPost ? 'Update post details' : 'Create a new blog post for your audience'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={8}
                  required
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'scheduled' | 'published') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {postStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="space-y-3">
                  {/* Image URL Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add image URL"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const url = (e.target as HTMLInputElement).value.trim()
                          if (url && !formData.imageUrls.includes(url)) {
                            setFormData(prev => ({ 
                              ...prev, 
                              imageUrls: [...prev.imageUrls, url] 
                            }))
                            setImagePreview(prev => [...prev, url]);
                            (e.target as HTMLInputElement).value = ''
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = async (e) => {
                          const files = Array.from((e.target as HTMLInputElement).files || [])
                          
                          for (const file of files) {
                            try {
                              // Validate file size (5MB max to prevent BSON buffer overflow)
                              const maxSizeMB = 5
                              const maxSizeBytes = maxSizeMB * 1024 * 1024
                              
                              if (file.size > maxSizeBytes) {
                                toast.error(`Image "${file.name}" is too large. Please select an image smaller than ${maxSizeMB}MB.`)
                                continue
                              }
                              
                              // Validate file type
                              if (!file.type.startsWith('image/')) {
                                toast.error(`"${file.name}" is not a valid image file.`)
                                continue
                              }
                              
                              // Compress and convert file to base64
                              const compressedFile = await compressImage(file, 0.8, 1920, 1080)
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                const base64Url = event.target?.result as string
                                
                                // Check base64 size (should be much smaller after compression)
                                const base64Size = base64Url.length * 0.75 // Approximate bytes
                                console.log(`Compressed image size: ${(base64Size / 1024 / 1024).toFixed(2)}MB`)
                                
                                // Add the base64 image URL
                                if (base64Url && !formData.imageUrls.includes(base64Url)) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    imageUrls: [...prev.imageUrls, base64Url] 
                                  }))
                                  setImagePreview(prev => [...prev, base64Url])
                                  toast.success(`Image loaded: ${file.name} (${(base64Size / 1024 / 1024).toFixed(2)}MB)`)
                                }
                              }
                              reader.readAsDataURL(compressedFile)
                            } catch (error) {
                              console.error('Failed to load image:', error)
                              toast.error(`Failed to load ${file.name}`)
                            }
                          }
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  
                  {/* Image Preview Grid */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreview.map((url, index) => (
                        <div key={`preview-${url}-${index}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                              }))
                              setImagePreview(prev => prev.filter((_, i) => i !== index))
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="food, restaurant, news"
                />
              </div>

              {formData.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPromoted"
                  checked={formData.isPromoted}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPromoted: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isPromoted">Promote this post</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingPost ? 'Update' : 'Create'}
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

      {/* Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">{statusStats.published}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{statusStats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold">{statusStats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {postStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Select All */}
        {filteredPosts.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm" 
              onClick={() => {
                if (selectedPosts.length === filteredPosts.length) {
                  setSelectedPosts([])
                } else {
                  setSelectedPosts(filteredPosts.map(p => p.id))
                }
              }}
            >
              {selectedPosts.length === filteredPosts.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center space-x-2 ml-4 p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedPosts.length} selected
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Posts</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedPosts.length} selected posts? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Delete {selectedPosts.length} Posts
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPosts([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex gap-6">
                {/* Selection Checkbox */}
                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPosts(prev => [...prev, post.id])
                      } else {
                        setSelectedPosts(prev => prev.filter(id => id !== post.id))
                      }
                    }}
                    className="rounded mt-1"
                  />
                </div>
                {post.imageUrl && (
                  <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        {post.isPromoted && (
                          <Badge className="bg-yellow-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Promoted
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.status === 'scheduled' && post.scheduledAt && (
                          <>
                            <span>•</span>
                            <span>Scheduled for {new Date(post.scheduledAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {post.category}
                      </Badge>
                      <Badge 
                        variant={postStatuses.find(s => s.value === post.status)?.color as any}
                      >
                        {postStatuses.find(s => s.value === post.status)?.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(post.tags || []).map((tag, index) => (
                      <Badge key={`tag-${post.id}-${tag}-${index}`} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {post.status === 'published' && (
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(post.views)} views
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {formatNumber(post.likes)} likes
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {formatNumber(post.comments)} comments
                      </div>
                      <div className="flex items-center">
                        <Share className="h-4 w-4 mr-1" />
                        {formatNumber(post.shares)} shares
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Select
                        value={post.status}
                        onValueChange={(value: 'draft' | 'scheduled' | 'published') => handleStatusChange(post.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {postStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePromoted(post.id, post.isPromoted)}
                      >
                        <TrendingUp className={`h-4 w-4 ${post.isPromoted ? 'text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
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
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'No posts match your current filters'
                : 'Create your first blog post to engage your audience'
              }
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}