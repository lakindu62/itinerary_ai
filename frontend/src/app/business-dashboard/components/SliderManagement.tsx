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
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff,
  Move,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '@/services/business-profile-api.service'

interface SliderImage {
  id: string
  url: string
  title: string
  description: string
  order: number
  isActive: boolean
  filename: string
  type: 'sliderImage'
}

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

export default function SliderManagement() {
  const { userId, getToken } = useAuth()
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null)
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    filename: '',
    order: 0,
    isActive: true
  })

  // Load business profile ID first, then slider images
  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (!userId) return
      
      try {
        const result = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
        if (result.data && result.data.length > 0) {
          const profileId = result.data[0]._id || result.data[0].id
          if (profileId) {
            setBusinessProfileId(profileId)
          }
        }
      } catch (error) {
        console.error('Error loading business profile:', error)
      }
    }
    
    loadBusinessProfile()
  }, [userId])
  
  // Load slider images when business profile ID is available
  useEffect(() => {
    if (businessProfileId) {
      loadSliderImages()
    }
  }, [businessProfileId])

  // Don't render if no user ID
  if (!userId) {
    return <div>Please sign in to manage your business profile.</div>
  }

  const loadSliderImages = async () => {
    if (!businessProfileId) return
    
    setLoading(true)
    try {
      const result = await BusinessProfileApiService.getSliderImages(businessProfileId, getToken)
      
      if (result.error) {
        toast.error('Failed to load slider images')
        setSliderImages([])
        return
      }

      const sliderImages = result.data || []
      
      // Format images - base64 URLs are ready to use directly
      const formattedImages = sliderImages.map((image: any, index: number) => {
        return {
          id: image.id || image._id || `slider-${index}`,
          url: image.url, // Base64 URL, ready to display
          title: image.title || `Slider Image ${index + 1}`,
          description: image.description || '',
          order: image.order || index,
          isActive: image.isActive !== undefined ? image.isActive : true,
          filename: image.filename || `image-${index}`,
          type: 'sliderImage' as const
        }
      })
      
      setSliderImages(formattedImages)
    } catch (error) {
      console.error('Error loading slider images:', error)
      toast.error('Failed to load slider images')
      setSliderImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessProfileId) {
      toast.error('Business profile not found')
      return
    }
    
    setLoading(true)

    try {
      if (editingImage) {
        // For now, we'll add update functionality later
        toast.error('Update functionality coming soon')
        return
      } else {
        // Add new slider image
        const sliderImageData = {
          type: 'image' as const,
          url: formData.url,
          filename: formData.filename,
          order: formData.order,
          title: formData.title,
          description: formData.description
        }
        
        const result = await BusinessProfileApiService.addSliderImage(
          businessProfileId,
          sliderImageData,
          getToken
        )

        if (result.error) {
          toast.error(result.error || 'Failed to add slider image')
          return
        }

        toast.success('Slider image added successfully!')
        setDialogOpen(false)
        resetForm()
        await loadSliderImages()
        
        // Trigger a custom event to refresh dashboard overview
        window.dispatchEvent(new CustomEvent('businessProfileUpdated'))
      }
    } catch (error) {
      console.error('Error saving slider image:', error)
      toast.error('Failed to save slider image')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description,
      url: image.url,
      filename: image.filename,
      order: image.order,
      isActive: image.isActive
    })
    setDialogOpen(true)
  }

  const handleDelete = async (imageId: string) => {
    if (!businessProfileId) {
      toast.error('Business profile not found')
      return
    }
    
    setLoading(true)
    try {
      const result = await BusinessProfileApiService.removeSliderImage(
        businessProfileId,
        imageId,
        getToken
      )

      if (result.error) {
        toast.error(result.error || 'Failed to delete slider image')
        return
      }

      toast.success('Slider image deleted successfully!')
      await loadSliderImages()
      
      // Trigger a custom event to refresh dashboard overview
      window.dispatchEvent(new CustomEvent('businessProfileUpdated'))
    } catch (error) {
      console.error('Error deleting slider image:', error)
      toast.error('Failed to delete slider image')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (imageId: string, isActive: boolean) => {
    // For now, this functionality is not implemented in the backend
    toast.error('Toggle active functionality coming soon')
    return
    
    setLoading(true)
    try {
      // This would need to be implemented in the backend API
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'sliderImage',
          id: imageId,
          isActive: !isActive 
        }),
      })

      if (response.ok) {
        toast.success(`Slider image ${!isActive ? 'activated' : 'deactivated'}!`)
        loadSliderImages()
      } else {
        throw new Error('Failed to update slider image')
      }
    } catch (error) {
      console.error('Error updating slider image:', error)
      toast.error('Failed to update slider image')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      filename: '',
      order: 0,
      isActive: true
    })
    setEditingImage(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Validate file size (5MB max to prevent BSON buffer overflow)
        const maxSizeMB = 5
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        
        if (file.size > maxSizeBytes) {
          toast.error(`Image is too large. Please select an image smaller than ${maxSizeMB}MB.`)
          return
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file.')
          return
        }
        
        // Compress and convert file to base64
        const compressedFile = await compressImage(file, 0.8, 1920, 1080)
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64Url = event.target?.result as string
          
          // Check base64 size (should be much smaller after compression)
          const base64Size = base64Url.length * 0.75 // Approximate bytes
          console.log(`Compressed image size: ${(base64Size / 1024 / 1024).toFixed(2)}MB`)
          
          // Set the base64 URL in form data
          setFormData(prev => ({
            ...prev,
            url: base64Url,
            filename: file.name
          }))
          
          toast.success(`Image loaded: ${file.name} (${(base64Size / 1024 / 1024).toFixed(2)}MB)`)
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error('Error processing image:', error)
        toast.error('Failed to process image. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Slider Management</h2>
          <p className="text-gray-600">Manage your business slider images</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slider Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Slider Image' : 'Add Slider Image'}
              </DialogTitle>
              <DialogDescription>
                {editingImage ? 'Update slider image details' : 'Add a new image to your slider'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Or enter image URL"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filename">Filename</Label>
                  <Input
                    id="filename"
                    value={formData.filename}
                    onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
                    placeholder="image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingImage ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slider Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          console.log('🎨 Rendering slider images:', sliderImages.length, 'images')
          return null
        })()}
        {sliderImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <Badge variant={image.isActive ? "default" : "secondary"}>
                  {image.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">
                  #{image.order}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{image.description}</p>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(image.id, image.isActive)}
                >
                  {image.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
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
                        <AlertDialogTitle>Delete Slider Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this slider image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(image.id)}>
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

      {sliderImages.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No slider images</h3>
            <p className="text-gray-600 mb-4">Add your first slider image to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slider Image
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
