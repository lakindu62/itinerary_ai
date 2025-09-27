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

export default function SliderManagement() {
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

  // Load slider images on component mount
  useEffect(() => {
    loadSliderImages()
  }, [])

  const loadSliderImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=owner_demo')
      if (response.ok) {
        const data = await response.json()
        setSliderImages(data.sliderImages || [])
      }
    } catch (error) {
      console.error('Error loading slider images:', error)
      toast.error('Failed to load slider images')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = editingImage ? 'PUT' : 'POST'
      
      const response = await fetch('/api/business-profiles?ownerId=owner_demo', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sliderImage',
          id: editingImage?.id,
          ...formData
        }),
      })

      if (response.ok) {
        toast.success(editingImage ? 'Slider image updated successfully!' : 'Slider image added successfully!')
        setDialogOpen(false)
        resetForm()
        loadSliderImages()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save slider image')
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
    setLoading(true)
    try {
      const response = await fetch(`/api/business-profiles?ownerId=owner_demo&itemId=${imageId}&itemType=sliderImage`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Slider image deleted successfully!')
        loadSliderImages()
      } else {
        throw new Error('Failed to delete slider image')
      }
    } catch (error) {
      console.error('Error deleting slider image:', error)
      toast.error('Failed to delete slider image')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (imageId: string, isActive: boolean) => {
    setLoading(true)
    try {
      const response = await fetch('/api/business-profiles?ownerId=owner_demo', {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Convert file to base64 data URL for persistent storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        setFormData(prev => ({
          ...prev,
          url,
          filename: file.name
        }))
      }
      reader.readAsDataURL(file)
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