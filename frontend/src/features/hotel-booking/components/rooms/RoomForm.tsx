import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { X, Loader2, Bed, Users, Bath, Ruler, DollarSign, Wifi, Tv, Mountain, Waves, Snowflake, Volume2, Building } from 'lucide-react';
import MinioImageUpload from '../shared/MinioImageUpload';
import { useRooms } from '../../hooks/useRooms';
import { Room as RoomType } from '../../types/room.types';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

// Define the room schema
const roomSchema = z.object({
  title: z.string().min(1, 'Room title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bedCount: z.coerce.number().min(0).default(0),
  guestCount: z.coerce.number().min(1, 'At least 1 guest is required').default(1),
  bathroomCount: z.coerce.number().min(0).default(0),
  kingBed: z.coerce.number().min(0).default(0),
  queenBed: z.coerce.number().min(0).default(0),
  breakfastPrice: z.coerce.number().min(0, 'Breakfast price cannot be negative').default(0),
  roomPrice: z.coerce.number().min(0, 'Room price cannot be negative').default(0),
  roomService: z.boolean().default(false),
  tv: z.boolean().default(false),
  balcony: z.boolean().default(false),
  freeWifi: z.boolean().default(false),
  cityView: z.boolean().default(false),
  oceanView: z.boolean().default(false),
  forestView: z.boolean().default(false),
  mountainView: z.boolean().default(false),
  airCondition: z.boolean().default(false),
  soundProofed: z.boolean().default(false),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  selectedHotelId?: string;
  room?: RoomType | null;
  hotelId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RoomForm({ room, hotelId, onSuccess, onCancel }: RoomFormProps) {
  const { createRoom, updateRoom, isCreating, isUpdating } = useRooms(hotelId);
  const { userId } = useAuth(); // Get current user ID
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditMode = !!room;
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: room?.title || '',
      description: room?.description || '',
      bedCount: Number(room?.bedCount || 0),
      guestCount: Number(room?.guestCount || 1),
      bathroomCount: Number(room?.bathroomCount || 0),
      kingBed: Number(room?.kingBed || 0),
      queenBed: Number(room?.queenBed || 0),
      breakfastPrice: Number(room?.breakfastPrice || 0),
      roomPrice: Number(room?.roomPrice || 0),
      roomService: room?.roomService || false,
      tv: room?.tv || false,
      balcony: room?.balcony || false,
      freeWifi: room?.freeWifi || false,
      cityView: room?.cityView || false,
      oceanView: room?.oceanView || false,
      forestView: room?.forestView || false,
      mountainView: room?.mountainView || false,
      airCondition: room?.airCondition || false,
      soundProofed: room?.soundProofed || false,
    },
  });

  useEffect(() => {
    if (room?.image) {
      setImagePreview(room.image);
    }
  }, [room]);

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

  const onSubmit: SubmitHandler<RoomFormData> = async (data: RoomFormData) => {
    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }

    try {
      console.log(`🏠 ${isEditMode ? 'Updating' : 'Creating'} room:`, data);
      
      const cleanData = {
        ...data,
        imageFile: selectedImage || undefined,
      };
      
      if (isEditMode && room) {
        // UPDATE existing room
        console.log('🔄 Updating room ID:', room.id);
        await updateRoom(room.id, cleanData, userId);
        console.log('✅ Room updated successfully');
      } else {
        // CREATE new room
        console.log('🆕 Creating new room for hotel:', hotelId);
        await createRoom({ ...cleanData, hotelId }, userId);
        console.log('✅ Room created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} room:`, error);
    }
  };

  const roomFeatures = [
    { key: 'roomService', label: 'Room Service', icon: DollarSign },
    { key: 'tv', label: 'TV', icon: Tv },
    { key: 'balcony', label: 'Balcony', icon: Mountain },
    { key: 'freeWifi', label: 'Free WiFi', icon: Wifi },
    { key: 'cityView', label: 'City View', icon: Building },
    { key: 'oceanView', label: 'Ocean View', icon: Waves },
    { key: 'forestView', label: 'Forest View', icon: Mountain },
    { key: 'mountainView', label: 'Mountain View', icon: Mountain },
    { key: 'airCondition', label: 'Air Condition', icon: Snowflake },
    { key: 'soundProofed', label: 'Sound Proofed', icon: Volume2 },
  ] as const;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bed className="h-5 w-5" />
            <CardTitle>{isEditMode ? 'Edit Room' : 'Create New Room'}</CardTitle>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {isEditMode 
            ? `Update "${room?.title}" details for hotel ID: ${hotelId}`
            : `Fill in the details to add a new room to hotel ID: ${hotelId}`
          }
        </p>
        <p className="text-xs text-blue-600">
          📦 Images will be stored in room-bucket/images/rooms_{userId}_{Date.now()}_filename.jpg
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control as Control<RoomFormData>}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Deluxe Ocean View" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<RoomFormData>}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the room, its features, and what makes it special..." 
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
                  💾 File will be stored as: room-bucket/images/rooms_{userId}_{Date.now()}_filename.jpg
                </p>
              </div>
            </div>

            {/* Room Capacity & Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Capacity & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="guestCount"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 1" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="kingBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>King Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 1" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="queenBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queen Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 0" 
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
                control={form.control as Control<RoomFormData>}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 1" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price per Night *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 150.00" 
                          step="0.01"
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as Control<RoomFormData>}
                  name="breakfastPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breakfast Price per Person</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 25.00" 
                          step="0.01"
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Room Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Features & Views</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {roomFeatures.map((feature) => (
                  <FormField
                    key={feature.key}
                    control={form.control as Control<RoomFormData>}
                    name={feature.key}
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
                            {feature.label}
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