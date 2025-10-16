'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { CustomPlacesAutocomplete } from '@/features/user-management/business/registration/components/CustomPlacesAutocomplete';
import { APIProvider } from '@vis.gl/react-google-maps';
import { createBusinessVenue, updateBusinessVenue } from '../lib/event-api';

interface Venue {
  id: string;
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  coordinates: [number, number]; // [longitude, latitude]
  facilities: string[];
}

const formSchema = z.object({
  venueName: z.string().min(2, { message: 'Venue name must be at least 2 characters.' }),
  address: z.string().min(2, { message: 'Address must be at least 2 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  province: z.string().min(2, { message: 'Province must be at least 2 characters.' }),
  postalCode: z.string().min(2, { message: 'Postal code must be at least 2 characters.' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters.' }),
  capacity: z.number().min(1, { message: 'Capacity must be at least 1.' }),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  facilities: z.string().array().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface VenueFormProps {
  venue?: Venue;
  onSuccess: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSuccess }) => {
  const { getToken } = useAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueName: venue?.venueName || '',
      address: venue?.address || '',
      city: venue?.city || '',
      province: venue?.province || '',
      postalCode: venue?.postalCode || '',
      country: venue?.country || '',
      capacity: venue?.capacity || 0,
      coordinates: venue?.coordinates || undefined,
      facilities: venue?.facilities || [],
    },
  });

  const onSubmit = async (values: FormData) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    if (!getToken) return;
    try {
      if (venue) {
        await updateBusinessVenue(venue.id, values, getToken);
      } else {
        await createBusinessVenue(values, getToken);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save venue:', error);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="venueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Main Hall" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coordinates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (for coordinates)</FormLabel>
                <FormControl>
                  <CustomPlacesAutocomplete
                    placeholder="Search for venue location..."
                    onPlaceSelect={(place) => {
                      if (place?.geometry?.location) {
                        // Handle both function and direct property access for coordinates
                        const lat = typeof place.geometry.location.lat === 'function'
                          ? place.geometry.location.lat()
                          : place.geometry.location.lat as unknown as number;
                        const lng = typeof place.geometry.location.lng === 'function'
                          ? place.geometry.location.lng()
                          : place.geometry.location.lng as unknown as number;

                        field.onChange([lng, lat]); // [longitude, latitude]
                      }
                    }}

                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Start typing your venue location and select from the suggestions to automatically capture coordinates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Colombo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province/State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NW" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 60200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sri Lanka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    min={1}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facilities (comma separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., WiFi, Parking"
                    value={field.value?.join(', ') || ''}
                    onChange={(e) => field.onChange(e.target.value.split(',').map((f) => f.trim()))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{venue ? 'Update' : 'Create'}</Button>
        </form>
      </Form>
    </APIProvider>
  );
};

export default VenueForm;