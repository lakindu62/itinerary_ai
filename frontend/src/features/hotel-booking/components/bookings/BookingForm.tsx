"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { bookingSchema } from '../../lib/validations';
import { useBookings } from '../../hooks/useBookings';
import { z } from 'zod';

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hotelId: string;
  roomId?: string;
  initialData?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

export default function BookingForm({ hotelId, roomId, initialData }: BookingFormProps) {
  const router = useRouter();
  const { createBooking, isCreating } = useBookings();
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: roomId || '',
      hotelId,
      startDate: initialData?.checkIn || '',
      endDate: initialData?.checkOut || '',
      breakfastIncluded: false,
      totalPrice: 299, // Calculate this based on room price and dates
      currency: 'USD',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      const booking = await createBooking({
        ...data,
        breakfastIncluded,
        hotelOwnerId: 'test-user-123', // This should come from hotel data
      });

      toast.success('Booking created successfully!');
      router.push(`/payment?bookingId=${booking.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="mt-1"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Check-in Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate">Check-out Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Number of Guests</Label>
            <Select defaultValue={initialData?.guests?.toString() || '2'}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="breakfast"
              checked={breakfastIncluded}
              onCheckedChange={setBreakfastIncluded}
            />
            <Label htmlFor="breakfast">
              Include breakfast (+$25/night per person)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              placeholder="Any special requests or preferences..."
              className="w-full mt-1 p-3 border rounded-md h-24 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <Button
            type="submit"
            disabled={isCreating}
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
            size="lg"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="mr-2 h-4 w-4" />
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}