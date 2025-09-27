'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { convertToBase64 } from '../../utils/fileUtils';
import { useMenuItemsQuery, useCreateMenuItem, useDeleteMenuItem } from '../../hooks/useBusinessProfile';
import { MenuItem } from '../../api/business-profile.api';
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
    if (!selectedFile || !name || !price) return;

    try {
      const base64Image = await convertToBase64(selectedFile);
      const newMenuItem: Omit<MenuItem, 'id'> = {
        name,
        description,
        price: parseFloat(price),
        image: base64Image,
        category,
      };

      await createMenuItemMutation.mutateAsync(newMenuItem);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMenuItemMutation.mutateAsync(id);
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

        <Button type="submit">Add Menu Item</Button>
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
            >
              Delete
            </Button>
          </div>
        )))}
      </div>
    </div>
  );
}