
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createCategory, updateCategory } from '../lib/event-api';

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

const formSchema = z.object({
  categoryName: z.string().min(5, { message: 'Name must be at least 5 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
});

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: category?.categoryName || '',
      description: category?.description || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (category) {
        await updateCategory(category.id, values);
      } else {
        await createCategory(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Music" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Events related to music concerts and festivals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{category ? 'Update' : 'Create'}</Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
