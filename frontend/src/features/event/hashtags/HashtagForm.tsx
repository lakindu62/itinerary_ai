
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createHashtag, updateHashtag } from '../lib/event-api';
import { useAuth } from '@clerk/nextjs';

interface Hashtag {
  id: string;
  hashtagName: string;
}


const formSchema = z.object({
  hashtagName: z.string().min(2, { message: 'Hashtag must be at least 2 characters.' }),
});

interface HashtagFormProps {
  hashtag?: Hashtag;
  onSuccess: () => void;
}

const HashtagForm: React.FC<HashtagFormProps> = ({ hashtag, onSuccess }) => {
  const { getToken } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hashtagName: hashtag?.hashtagName || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (hashtag) {
        await updateHashtag(hashtag.id, values, getToken);
      } else {
        await createHashtag(values, getToken);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save hashtag:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="hashtagName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hashtag</FormLabel>
              <FormControl>
                <Input placeholder="e.g., #tech" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{hashtag ? 'Update' : 'Create'}</Button>
      </form>
    </Form>
  );
};

export default HashtagForm;
