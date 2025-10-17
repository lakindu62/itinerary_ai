'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useMenuItemsQuery, useCreateMenuItem, useDeleteMenuItem } from '../../hooks/useBusinessProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem } from '../../types/business-profile.types';
import { createMenuItem } from '../../services/business-profile.service';
import { convertToBase64 } from '../../utils/fileUtils';
import { Loader2 } from 'lucide-react';

export default function MenuManager() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: menuItems, isLoading } = useMenuItemsQuery();
  const createMenuItemMutation = useCreateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !name || !price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Validate file size (5MB max)
      const maxSizeMB = 5
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      
      if (selectedFile.size > maxSizeBytes) {
        alert(`Image is too large. Please select an image smaller than ${maxSizeMB}MB.`)
        return
      }
      
      const base64Image = await convertToBase64(selectedFile);
      
      // Check base64 size
      const base64SizeInMB = (base64Image.length * 0.75) / 1024 / 1024
      if (base64SizeInMB > 5) {
        alert('Image is too large after processing. Please choose a smaller image.')
        return
      }
      
      const newMenuItem: Omit<MenuItem, 'id'> = {
        name,
        description,
        price: parseFloat(price),
        image: base64Image,
        category,
      };

      await createMenuItemMutation.mutateAsync(newMenuItem);
      
      // Reset form on success
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      alert(`Failed to add menu item: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      await deleteMenuItemMutation.mutateAsync(id);
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      alert(`Failed to delete menu item: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter item description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>

        <Button type="submit" disabled={createMenuItemMutation.isPending}>
          {createMenuItemMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Menu Item'
          )}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : menuItems?.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No menu items found
          </div>
        ) : (
          menuItems.map((item: MenuItem) => (
          <div key={item.id} className="border rounded-lg p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
            <p className="font-medium mt-2">${item.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>
            <Button
              variant="destructive"
              onClick={() => handleDelete(item.id)}
              className="mt-2"
              disabled={deleteMenuItemMutation.isPending}
            >
              {deleteMenuItemMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        )))}
      </div>
    </div>
  );
}