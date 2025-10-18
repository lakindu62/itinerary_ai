"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { X, Loader2, Hotel } from 'lucide-react';
import MinioImageUpload from '../shared/MinioImageUpload';
import { useHotels } from '../../hooks/useHotels';
import { Hotel as HotelType } from '../../types/hotel.types';

// Define the hotel schema with optional locationDescription
const hotelSchema = z.object({
  title: z.string().min(1, 'Hotel name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locationDescription: z.string().optional(), // Optional field
  gym: z.boolean(),
  spa: z.boolean(),
  bar: z.boolean(),
  laundry: z.boolean(),
  restaurant: z.boolean(),
  shopping: z.boolean(),
  freeParking: z.boolean(),
  bikeRental: z.boolean(),
  freeWifi: z.boolean(),
  movieNights: z.boolean(),
  swimmingPool: z.boolean(),
  coffeeShop: z.boolean(),
});

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  hotel?: HotelType | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function HotelForm({ hotel, onSuccess, onCancel }: HotelFormProps) {
  const { createHotel, updateHotel, isCreating, isUpdating } = useHotels();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditMode = !!hotel;
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      title: hotel?.title || '',
      description: hotel?.description || '',
      country: hotel?.country || '',
      state: hotel?.state || '',
      city: hotel?.city || '',
      locationDescription: hotel?.locationDescription || '', // Will be empty string if undefined
      gym: hotel?.gym || false,
      spa: hotel?.spa || false,
      bar: hotel?.bar || false,
      laundry: hotel?.laundry || false,
      restaurant: hotel?.restaurant || false,
      shopping: hotel?.shopping || false,
      freeParking: hotel?.freeParking || false,
      bikeRental: hotel?.bikeRental || false,
      freeWifi: hotel?.freeWifi || true,
      movieNights: hotel?.movieNights || false,
      swimmingPool: hotel?.swimmingPool || false,
      coffeeShop: hotel?.coffeeShop || false,
    },
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const onSubmit: SubmitHandler<HotelFormData> = async (data) => {
    try {
      console.log(`🏨 ${isEditMode ? 'Updating' : 'Creating'} hotel:`, data);
      
      // Clean the data - convert empty locationDescription to undefined
      const cleanData = {
        ...data,
        locationDescription: data.locationDescription?.trim() || undefined,
        imageFile: selectedImage || undefined,
      };
      
      if (isEditMode && hotel) {
        // UPDATE existing hotel
        console.log('🔄 Updating hotel ID:', hotel.id);
        await updateHotel({
          id: hotel.id,
          data: cleanData,
        });
        console.log('✅ Hotel updated successfully');
      } else {
        // CREATE new hotel
        console.log('🆕 Creating new hotel');
        await createHotel(cleanData);
        console.log('✅ Hotel created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} hotel:`, error);
    }
  };

  const amenities = [
    { key: 'gym', label: 'Gym' },
    { key: 'spa', label: 'Spa' },
    { key: 'bar', label: 'Bar' },
    { key: 'laundry', label: 'Laundry Service' },
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'shopping', label: 'Shopping' },
    { key: 'freeParking', label: 'Free Parking' },
    { key: 'bikeRental', label: 'Bike Rental' },
    { key: 'freeWifi', label: 'Free WiFi' },
    { key: 'movieNights', label: 'Movie Nights' },
    { key: 'swimmingPool', label: 'Swimming Pool' },
    { key: 'coffeeShop', label: 'Coffee Shop' },
  ] as const;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hotel className="h-5 w-5" />
            <CardTitle>{isEditMode ? 'Edit Hotel' : 'Create New Hotel'}</CardTitle>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {isEditMode 
            ? `Update "${hotel?.title}" details`
            : 'Fill in the details to add a new hotel property'
          }
        </p>
        {/* <p className="text-xs text-blue-600">
          📦 Images will be stored in hotel-bucket/images/hotels_NadPerz_timestamp_filename
        </p> */}
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Grand Palace Hotel" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your hotel, its features, and what makes it special..." 
                        className="min-h-[100px]"
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload - will go to hotel-bucket */}
              <div>
                <MinioImageUpload
                  label="Hotel Image"
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  bucket="hotel-bucket"
                  folder="images"
                  isUploading={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💾 File will be stored as: hotel-bucket/images/hotels_NadPerz_{Date.now()}_filename.jpg
                </p>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Sri Lanka" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Western" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Colombo" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about the location, nearby attractions, etc..." 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hotel Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hotel Amenities & Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenities.map((amenity) => (
                  <FormField
                    key={amenity.key}
                    control={form.control}
                    name={amenity.key}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            {amenity.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating Hotel...' : 'Creating Hotel...'}
                  </>
                ) : (
                  `${isEditMode ? 'Update Hotel' : 'Create Hotel'}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}