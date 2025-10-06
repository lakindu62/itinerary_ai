'use client'

import React, { useState, useEffect } from 'react'
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
  DollarSign,
  Clock,
  UtensilsCrossed
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/useAuth'
import { BusinessProfileApiService } from '@/services/business-profile-api.service'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isAvailable: boolean
  preparationTime: number
  ingredients?: string[]
  allergens?: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  calories?: number
  createdAt: string
  updatedAt: string
}

const categories = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
  'Soups',
  'Salads',
  'Sides',
  'Specials'
]

const allergens = [
  'Nuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat',
  'Fish',
  'Shellfish',
  'Sesame'
]

// Image compression utility
const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1200, maxHeight: number = 800): Promise<File> => {
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

export default function MenuManagement() {
  const { userId, getToken } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    isAvailable: true,
    preparationTime: 15,
    ingredients: '',
    allergens: [] as string[],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    calories: 0
  })

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    setLoading(true)
    try {
      const profileResult = await BusinessProfileApiService.getBusinessProfileByOwnerId(getToken)
      
      if (profileResult.error) {
        console.error('Failed to load business profile:', profileResult.error)
        toast.error(`Failed to load menu items: ${profileResult.error}`)
        setMenuItems([])
        return
      }
      
      if (profileResult.data && profileResult.data.length > 0) {
        const profile = profileResult.data[0]
        const menuItems = profile.menuItems || []
        

        
        // Convert MongoDB format to component format
        const formattedMenuItems = menuItems.map((item: any) => {
          // Handle date fields safely - try multiple possible date fields
          const getValidDate = (dateValue: any): string => {
            if (!dateValue) return new Date().toISOString()
            
            const date = new Date(dateValue)
            if (isNaN(date.getTime())) {
              return new Date().toISOString()
            }
            return date.toISOString()
          }

          const createdDate = getValidDate(item.createdAt || item.updatedAt)
          const updatedDate = getValidDate(item.updatedAt || item.createdAt)

          return {
            id: item._id || item.id,
            name: item.name,
            description: item.description || '',
            price: item.price || 0,
            category: item.category || 'Main Courses',
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
            preparationTime: item.preparationTime || 15,
            ingredients: item.ingredients || [],
            allergens: item.allergens || [],
            isVegetarian: item.isVegetarian || false,
            isVegan: item.isVegan || false,
            isGlutenFree: item.isGlutenFree || false,
            calories: item.calories || 0,
            createdAt: createdDate,
            updatedAt: updatedDate
          }
        })
        
        setMenuItems(formattedMenuItems)
      } else {
        setMenuItems([])
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('Failed to load menu items')
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get the business profile first
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

      if (editingItem) {
        console.log('🍽️ Frontend: Updating menu item with editingItem:', {
          id: editingItem.id,
          _id: (editingItem as any)._id,
          name: editingItem.name,
          hasId: !!editingItem.id,
          idType: typeof editingItem.id,
          fullObject: editingItem
        })

        // Use _id if available, fallback to id for legacy compatibility
        const menuItemId = (editingItem as any)._id || editingItem.id
        console.log('🍽️ Frontend: Using menuItemId for update:', menuItemId)

        // Update existing menu item
        const result = await BusinessProfileApiService.updateMenuItem(profileId, menuItemId, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          imageUrl: formData.imageUrl,
          isAvailable: formData.isAvailable,
          preparationTime: formData.preparationTime,
          ingredients: formData.ingredients,
          allergens: formData.allergens,
          isVegetarian: formData.isVegetarian,
          isVegan: formData.isVegan,
          isGlutenFree: formData.isGlutenFree,
          calories: formData.calories
        }, getToken)

        if (result.error) {
          toast.error(`Failed to update menu item: ${result.error}`)
        } else {
          toast.success('Menu item updated successfully!')
          setDialogOpen(false)
          resetForm()
          loadMenuItems()
          window.dispatchEvent(new CustomEvent('businessProfileUpdated'))
        }
      } else {
        // Add new menu item
        const result = await BusinessProfileApiService.addMenuItem(profileId, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          imageUrl: formData.imageUrl,
          isAvailable: formData.isAvailable,
          preparationTime: formData.preparationTime,
          ingredients: formData.ingredients,
          allergens: formData.allergens,
          isVegetarian: formData.isVegetarian,
          isVegan: formData.isVegan,
          isGlutenFree: formData.isGlutenFree,
          calories: formData.calories
        }, getToken)

        if (result.error) {
          if (result.error.includes('not yet implemented')) {
            toast.info('Menu items management will be available once the backend endpoints are implemented.')
          } else {
            toast.error(`Failed to add menu item: ${result.error}`)
          }
        } else {
          toast.success('Menu item added successfully!')
          setDialogOpen(false)
          resetForm()
          loadMenuItems()
          window.dispatchEvent(new CustomEvent('businessProfileUpdated'))
        }
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    console.log('🔍 Frontend: Editing item:', {
      id: item.id,
      _id: (item as any)._id,
      name: item.name,
      hasId: !!item.id,
      keys: Object.keys(item)
    });
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime,
      ingredients: (item.ingredients || []).join(', '),
      allergens: item.allergens || [],
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      calories: item.calories || 0
    })
    setDialogOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    try {
      // Get the business profile first
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
      
      // Remove the menu item
      const result = await BusinessProfileApiService.removeMenuItem(profileId, itemId, getToken)

      if (result.error) {
        console.error('Error deleting menu item:', result.error)
        toast.error(`Failed to delete menu item: ${result.error}`)
      } else {
        toast.success('Menu item deleted successfully!')
        loadMenuItems()
        window.dispatchEvent(new CustomEvent('businessProfileUpdated'))
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const toggleAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/business-profiles?ownerId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'menu',
          id: itemId,
          isAvailable: !isAvailable 
        }),
      })

      if (response.ok) {
        toast.success(`Menu item ${!isAvailable ? 'made available' : 'made unavailable'}!`)
        loadMenuItems()
      } else {
        throw new Error('Failed to update menu item')
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      toast.error('Failed to update menu item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      isAvailable: true,
      preparationTime: 15,
      ingredients: '',
      allergens: [],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      calories: 0
    })
    setEditingItem(null)
  }

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergens: checked 
        ? [...prev.allergens, allergen]
        : prev.allergens.filter(a => a !== allergen)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update menu item details' : 'Add a new item to your menu'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div key="name-price-section" className="grid grid-cols-2 gap-4">
                <div key="name-field" className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div key="price-field" className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div key="description-section" className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the menu item"
                  rows={3}
                />
              </div>

              <div key="category-prep-section" className="grid grid-cols-2 gap-4">
                <div key="category-field" className="space-y-2">
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
                <div key="prep-time-field" className="space-y-2">
                  <Label htmlFor="preparationTime">Prep Time (minutes)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item Image</Label>
                <div className="space-y-3">
                  {/* Image URL Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add image URL or upload file"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            try {
                              // Validate file size (5MB max)
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
                              
                              // Compress image
                              const compressedFile = await compressImage(file, 0.8, 1200, 800)
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                const url = e.target?.result as string
                                const sizeInMB = (url.length * 0.75) / 1024 / 1024

                                setFormData(prev => ({ ...prev, imageUrl: url }))
                                toast.success(`Image loaded (${sizeInMB.toFixed(2)}MB)`)
                              }
                              reader.readAsDataURL(compressedFile)
                            } catch (error) {
                              console.error('Error processing image:', error)
                              toast.error('Failed to process image')
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
                  
                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div key="menu-item-image-preview" className="relative group w-32 h-32">
                      <img 
                        src={formData.imageUrl} 
                        alt="Menu item preview"
                        className="w-full h-full object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div key="ingredients-section" className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="Tomato, Cheese, Basil, Olive Oil"
                  rows={2}
                />
              </div>

              <div key="allergens-section" className="space-y-2">
                <Label>Allergens</Label>
                <div className="grid grid-cols-4 gap-2">
                  {allergens.map((allergen) => (
                    <div key={allergen} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={allergen}
                        checked={formData.allergens.includes(allergen)}
                        onChange={(e) => handleAllergenChange(allergen, e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={allergen} className="text-sm">{allergen}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div key="calories-dietary-section" className="grid grid-cols-2 gap-4">
                <div key="calories-field" className="space-y-2">
                  <Label htmlFor="calories">Calories (optional)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div key="dietary-restrictions" className="space-y-4">
                  <div key="vegetarian" className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isVegetarian">Vegetarian</Label>
                  </div>
                  <div key="vegan" className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVegan"
                      checked={formData.isVegan}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isVegan">Vegan</Label>
                  </div>
                  <div key="gluten-free" className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isGlutenFree"
                      checked={formData.isGlutenFree}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isGlutenFree">Gluten Free</Label>
                  </div>
                </div>
              </div>

              <div key="form-actions" className="flex justify-end space-x-2">
                <Button key="cancel-btn" type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button key="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
                <Badge variant="outline">
                  {item.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{item.name}</h3>
                <span className="font-bold text-green-600">${item.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {item.isVegetarian && <Badge key="vegetarian" variant="outline" className="text-xs">Vegetarian</Badge>}
                {item.isVegan && <Badge key="vegan" variant="outline" className="text-xs">Vegan</Badge>}
                {item.isGlutenFree && <Badge key="gluten-free" variant="outline" className="text-xs">Gluten Free</Badge>}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{item.preparationTime} min</span>
                {item.calories && (
                  <React.Fragment key="calories">
                    <span className="mx-2">•</span>
                    <span>{item.calories} cal</span>
                  </React.Fragment>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAvailability(item.id, item.isAvailable)}
                >
                  {item.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
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
                        <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>
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

      {filteredItems.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === 'all' ? 'No menu items' : `No ${selectedCategory.toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? 'Add your first menu item to get started'
                : `Add items to the ${selectedCategory} category`
              }
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
