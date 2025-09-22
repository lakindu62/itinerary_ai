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
import { hotelSchema } from '../../lib/validations';
import { CreateHotelRequest, Hotel } from '../../types/hotel.types';
import { AMENITIES } from '../../lib/constants';
import { z } from 'zod';

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Hotel>;
  isEdit?: boolean;
  hotelId?: string;
  // Fixed the type definition here
  onSubmit?: (data: CreateHotelRequest & { imageFile?: File }) => Promise<void>;
}

export default function HotelForm({ 
  onSuccess, 
  initialData, 
  isEdit = false, 
  hotelId,
  onSubmit 
}: HotelFormProps) {
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
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      country: initialData?.country || '',
      state: initialData?.state || '',
      city: initialData?.city || '',
      locationDescription: initialData?.locationDescription || '',
      gym: initialData?.gym || false,
      spa: initialData?.spa || false,
      bar: initialData?.bar || false,
      laundry: initialData?.laundry || false,
      restaurant: initialData?.restaurant || false,
      shopping: initialData?.shopping || false,
      freeParking: initialData?.freeParking || false,
      bikeRental: initialData?.bikeRental || false,
      freeWifi: initialData?.freeWifi || false,
      movieNights: initialData?.movieNights || false,
      swimmingPool: initialData?.swimmingPool || false,
      coffeeShop: initialData?.coffeeShop || false,
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

  const onFormSubmit = async (data: HotelFormData) => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData: CreateHotelRequest & { imageFile?: File } = {
        ...data,
        imageFile: selectedImage || undefined,
      };

      await onSubmit(submitData);
      
      toast.success(isEdit ? 'Hotel updated successfully!' : 'Hotel created successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save hotel. Please try again.');
      console.error('Hotel save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Hotel Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter hotel name"
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
              placeholder="Describe your hotel"
              rows={4}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Hotel Image</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
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

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="Country"
                className="mt-1"
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="State"
                className="mt-1"
              />
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="City"
                className="mt-1"
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="locationDescription">Location Description</Label>
            <Textarea
              id="locationDescription"
              {...register('locationDescription')}
              placeholder="Describe the location"
              rows={2}
              className="mt-1"
            />
            {errors.locationDescription && (
              <p className="text-sm text-red-500 mt-1">{errors.locationDescription.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES.map(({ key, label }) => (
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
          {isEdit ? 'Update Hotel' : 'Create Hotel'}
        </Button>
      </div>
    </form>
  );
}