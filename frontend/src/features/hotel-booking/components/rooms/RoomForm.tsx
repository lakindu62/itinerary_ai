"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { roomSchema } from '../../lib/validations';
import { Room } from '../../types/room.types';
import { ROOM_AMENITIES } from '../../lib/constants';
import { z } from 'zod';

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  hotelId: string;
  onSuccess?: () => void;
  initialData?: Partial<Room>;
  isEdit?: boolean;
  roomId?: string;
  onSubmit?: (data: any) => Promise<void>;
}

export default function RoomForm({ 
  hotelId,
  onSuccess, 
  initialData, 
  isEdit = false, 
  roomId,
  onSubmit 
}: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      bedCount: initialData?.bedCount || 1,
      guestCount: initialData?.guestCount || 2,
      bathroomCount: initialData?.bathroomCount || 1,
      kingBed: initialData?.kingBed || 0,
      queenBed: initialData?.queenBed || 1,
      breakfastPrice: initialData?.breakfastPrice || 0,
      roomPrice: initialData?.roomPrice || 100,
      roomService: initialData?.roomService || false,
      tv: initialData?.tv || true,
      balcony: initialData?.balcony || false,
      freeWifi: initialData?.freeWifi || true,
      cityView: initialData?.cityView || false,
      oceanView: initialData?.oceanView || false,
      forestView: initialData?.forestView || false,
      mountainView: initialData?.mountainView || false,
      airCondition: initialData?.airCondition || true,
      soundProofed: initialData?.soundProofed || false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: RoomFormData) => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...data,
        hotelId,
        imageFile: selectedImage || undefined,
      };

      await onSubmit(submitData);
      
      toast.success(isEdit ? 'Room updated successfully!' : 'Room created successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save room. Please try again.');
      console.error('Room save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Room Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter room name"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe the room"
              rows={4}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Room Image</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="room-image-upload"
              />
              <label
                htmlFor="room-image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Details */}
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedCount">Total Beds</Label>
              <Input
                id="bedCount"
                type="number"
                min="1"
                max="10"
                {...register('bedCount', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.bedCount && (
                <p className="text-sm text-red-500 mt-1">{errors.bedCount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="guestCount">Max Guests</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                max="20"
                {...register('guestCount', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.guestCount && (
                <p className="text-sm text-red-500 mt-1">{errors.guestCount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bathroomCount">Bathrooms</Label>
              <Input
                id="bathroomCount"
                type="number"
                min="1"
                max="5"
                {...register('bathroomCount', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.bathroomCount && (
                <p className="text-sm text-red-500 mt-1">{errors.bathroomCount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kingBed">King Beds</Label>
              <Input
                id="kingBed"
                type="number"
                min="0"
                max="5"
                {...register('kingBed', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="queenBed">Queen Beds</Label>
              <Input
                id="queenBed"
                type="number"
                min="0"
                max="5"
                {...register('queenBed', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomPrice">Room Price per Night ($)</Label>
              <Input
                id="roomPrice"
                type="number"
                min="1"
                step="0.01"
                {...register('roomPrice', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.roomPrice && (
                <p className="text-sm text-red-500 mt-1">{errors.roomPrice.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="breakfastPrice">Breakfast Price per Person ($)</Label>
              <Input
                id="breakfastPrice"
                type="number"
                min="0"
                step="0.01"
                {...register('breakfastPrice', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.breakfastPrice && (
                <p className="text-sm text-red-500 mt-1">{errors.breakfastPrice.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Room Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ROOM_AMENITIES.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={watch(key)}
                  onCheckedChange={(checked) => setValue(key, !!checked)}
                />
                <Label htmlFor={key} className="text-sm font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  );
}