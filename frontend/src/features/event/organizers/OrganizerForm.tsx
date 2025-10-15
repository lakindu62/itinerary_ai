'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createBusinessOrganizer, updateBusinessOrganizer } from '../lib/event-api';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const formSchema = z.object({
  organizerName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  contactEmail: z.email({ message: 'Invalid email address.' }),
  contactPhone: z.string().regex(/^0\d{9}$/, { message: 'Phone number must be 10 digits and start with 0.' }),
  organization: z.string().min(2, { message: 'Organization must be at least 2 characters.' }),
});

interface OrganizerFormProps {
  organizer?: Organizer;
  onSuccess: () => void;
}

const OrganizerForm: React.FC<OrganizerFormProps> = ({ organizer, onSuccess }) => {
  const { getToken } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizerName: organizer?.organizerName || '',
      contactEmail: organizer?.contactEmail || '',
      contactPhone: organizer?.contactPhone || '',
      organization: organizer?.organization || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!getToken) return;
    try {
      if (organizer) {
        await updateBusinessOrganizer(organizer.id, values, getToken);
      } else {
        await createBusinessOrganizer(values, getToken);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save organizer:', error);
    }
  };

  function formatSriLankaPhone(input: string) {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="organizerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SLIIT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., info@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                 <Input
                    type="tel"
                    maxLength={14}
                    placeholder="(076) 757-6666"
                    value={formatSriLankaPhone(field.value)}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '');
                      field.onChange(digits);
                    }}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tech Events Co." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">{organizer ? 'Update' : 'Create'}</Button>
      </form>
    </Form>
  );
};

export default OrganizerForm;