'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsernameSchema } from '../../../../../../../shared/types/user-management/schemas/BusinessOnboardingSchema';
import { useAppDispatch, useAppSelector } from '@/store';
import { setData, prevStep, resetForm } from '../BusinessRegistrationSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UsernameFormData = {
  username: string;
};

interface UsernameStepProps {
  onSubmit: () => void;
  onPrevious: () => void;
}

export function UsernameStep({ onSubmit, onPrevious }: UsernameStepProps) {
  const dispatch = useAppDispatch();
  const { username, email, password } = useAppSelector((state) => state.businessOnboarding);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(UsernameSchema),
    mode: 'onChange',
    defaultValues: {
      username: username || '',
    },
  });

  const onFormSubmit = async (data: UsernameFormData) => {
    dispatch(setData(data));
    
    // Here you would typically submit all the form data
    const formData = {
      email,
      password,
      username: data.username,
    };
    
    console.log('Final form data:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form after successful submission
    dispatch(resetForm());
    onSubmit();
  };

  const handlePrevious = () => {
    dispatch(prevStep());
    onPrevious();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose your username</h2>
        <p className="text-muted-foreground mt-2">
          This will be your unique identifier on our platform
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
            className={errors.username ? 'border-red-500' : ''}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Username must be at least 3 characters long
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="flex-1"
            disabled={isSubmitting}
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
