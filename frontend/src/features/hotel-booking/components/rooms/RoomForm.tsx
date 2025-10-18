"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Bed, ArrowLeft } from 'lucide-react';
import MinioImageUpload from '../shared/MinioImageUpload';
import { useHotels } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';
import { Room } from '../../types/room.types';

// Room form validation schema
const roomSchema = z.object({
  title: z.string().min(1, 'Room title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bedCount: z.number().min(1, 'At least 1 bed is required'),
  guestCount: z.number().min(1, 'At least 1 guest capacity is required'),
  bathroomCount: z.number().min(1, 'At least 1 bathroom is required'),
  kingBed: z.number().min(0),
  queenBed: z.number().min(0),
  breakfastPrice: z.number().min(0),
  roomPrice: z.number().min(1, 'Room price must be at least $1'),
  roomService: z.boolean(),
  tv: z.boolean(),
  balcony: z.boolean(),
  freeWifi: z.boolean(),
  cityView: z.boolean(),
  oceanView: z.boolean(),
  forestView: z.boolean(),
  mountainView: z.boolean(),
  airCondition: z.boolean(),
  soundProofed: z.boolean(),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  selectedHotelId: string;
  room?: Room; // Optional - for edit mode
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RoomForm({ selectedHotelId, room, onSuccess, onCancel }: RoomFormProps) {
  const { myHotels } = useHotels();
  const { createRoom, updateRoom, isCreating, isUpdating } = useRooms(selectedHotelId);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditMode = !!room;
  const isSubmitting = isCreating || isUpdating;

  // Find the selected hotel
  const selectedHotel = myHotels.find(h => h.id === selectedHotelId);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: room?.title || '',
      description: room?.description || '',
      bedCount: room?.bedCount || 1,
      guestCount: room?.guestCount || 2,
      bathroomCount: room?.bathroomCount || 1,
      kingBed: room?.kingBed || 0,
      queenBed: room?.queenBed || 1,
      breakfastPrice: room?.breakfastPrice || 0,
      roomPrice: room?.roomPrice || 100,
      roomService: room?.roomService || false,
      tv: room?.tv || true,
      balcony: room?.balcony || false,
      freeWifi: room?.freeWifi || true,
      cityView: room?.cityView || false,
      oceanView: room?.oceanView || false,
      forestView: room?.forestView || false,
      mountainView: room?.mountainView || false,
      airCondition: room?.airCondition || true,
      soundProofed: room?.soundProofed || false,
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

  const onSubmit: SubmitHandler<RoomFormData> = async (data) => {
    try {
      console.log(`🏠 ${isEditMode ? 'Updating' : 'Creating'} room:`, data);
      
      const roomData = {
        ...data,
        hotelId: selectedHotelId,
        imageFile: selectedImage || undefined,
      };

      if (isEditMode && room) {
        // UPDATE existing room
        await updateRoom({
          id: room.id,
          data: roomData,
        });
        console.log('✅ Room updated successfully');
      } else {
        // CREATE new room
        await createRoom(roomData);
        console.log('✅ Room created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} room:`, error);
    }
  };

  const amenities = [
    { key: 'roomService', label: 'Room Service' },
    { key: 'tv', label: 'TV' },
    { key: 'balcony', label: 'Balcony' },
    { key: 'freeWifi', label: 'Free WiFi' },
    { key: 'airCondition', label: 'Air Conditioning' },
    { key: 'soundProofed', label: 'Sound Proofed' },
  ] as const;

  const views = [
    { key: 'cityView', label: 'City View' },
    { key: 'oceanView', label: 'Ocean View' },
    { key: 'forestView', label: 'Forest View' },
    { key: 'mountainView', label: 'Mountain View' },
  ] as const;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bed className="h-5 w-5" />
            <CardTitle>
              {isEditMode ? `Edit Room: ${room?.title}` : 'Create New Room'}
            </CardTitle>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Hotel Info & Current User */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {isEditMode 
              ? `Update room details (current image will be preserved if no new image is selected)`
              : `Adding room to: ${selectedHotel?.title || 'Unknown Hotel'} (${selectedHotel?.city || 'Unknown Location'})`
            }
          </p>
          
          {selectedHotel && (
            <div className="flex items-center space-x-2 text-xs text-blue-600">
              <Badge variant="outline" className="text-xs">
                🏨 {selectedHotel.title}
              </Badge>
              <Badge variant="outline" className="text-xs">
                📍 {selectedHotel.city}, {selectedHotel.state}
              </Badge>
            </div>
          )}
          
          {/* <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>👤 User: NadPerz</span>
            <span>•</span>
            <span>📅 {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>💾 Images stored in room-bucket</span>
          </div> */}
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Deluxe Ocean View Suite" 
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
                    <FormLabel>Room Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the room features, layout, and amenities..." 
                        className="min-h-[100px]"
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload - will go to room-bucket */}
              <div>
                <MinioImageUpload
                  label="Room Image"
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  bucket="room-bucket"
                  folder="images"
                  isUploading={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💾 File will be stored as: room-bucket/images/rooms_NadPerz_timestamp_filename.jpg
                </p>
              </div>
            </div>

            {/* Room Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Configuration</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Capacity *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Beds *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathroomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="kingBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>King Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="queenBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queen Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price (per night) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          step="0.01"
                          placeholder="100.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakfastPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breakfast Price (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          step="0.01"
                          placeholder="25.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Room Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            {/* Room Views */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Views</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {views.map((view) => (
                  <FormField
                    key={view.key}
                    control={form.control}
                    name={view.key}
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
                            {view.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
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
                    {isEditMode ? 'Updating Room...' : 'Creating Room...'}
                  </>
                ) : (
                  `${isEditMode ? 'Update Room' : 'Create Room'}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}