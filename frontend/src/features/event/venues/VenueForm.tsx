
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createVenue, updateVenue } from '../lib/event-api';

// Temporary Venue type definition
interface Venue {
  id: string;
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  facilities: string[];
}

const formSchema = z.object({
  venueName: z.string().min(2, { message: 'Venue name must be at least 2 characters.' }),
  address: z.string().min(2, { message: 'Address must be at least 2 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  province: z.string().min(2, { message: 'Province must be at least 2 characters.' }),
  postalCode: z.string().min(2, { message: 'Postal code must be at least 2 characters.' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters.' }),
  capacity: z.coerce.number().min(1, { message: 'Capacity must be at least 1.' }),
  facilities: z.string().array().optional(),
});

interface VenueFormProps {
  venue?: Venue;
  onSuccess: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueName: venue?.venueName || '',
      address: venue?.address || '',
      city: venue?.city || '',
      province: venue?.province || '',
      postalCode: venue?.postalCode || '',
      country: venue?.country || '',
      capacity: venue?.capacity || '',
      facilities: venue?.facilities || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (venue) {
        await updateVenue(venue.id, values);
      } else {
        await createVenue(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save venue:', error);
    }
  };

  return (
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
                <Input placeholder ="e.g., 60200" {...field} />
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
                  {...field}
                  
                  // onChange={(e) => field.onChange(Number(e.target.value))}
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
  );
};

export default VenueForm;
