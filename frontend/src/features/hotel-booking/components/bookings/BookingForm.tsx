"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Loader2 } from 'lucide-react';
import * as z from 'zod';
import { formatPrice } from '../../lib/formatters';

// Define the schema directly in the component to avoid type conflicts
const bookingFormSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  hotelId: z.string().min(1, 'Hotel is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  guestCount: z.number().min(1, 'At least 1 guest is required'),
  breakfastIncluded: z.boolean(),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  currency: z.string(),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  roomId: string;
  hotelId: string;
  roomPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookingForm({ 
  roomId, 
  hotelId, 
  roomPrice, 
  onSuccess, 
  onCancel 
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      roomId,
      hotelId,
      startDate: '',
      endDate: '',
      guestCount: 2,
      breakfastIncluded: false,
      totalPrice: roomPrice,
      currency: 'USD',
      specialRequests: '',
    },
  });

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('🏨 Booking submission:', {
        ...data,
        timestamp: '2025-09-25 08:47:17',
        user: 'NadPerz'
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Booking created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Book This Room
        </CardTitle>
        <p className="text-sm text-gray-600">
          Room Price: {formatPrice(roomPrice)} per night | User: NadPerz | Date: 2025-09-25 08:47:17
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guest Count */}
            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="20"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Breakfast Option */}
            <FormField
              control={form.control}
              name="breakfastIncluded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Breakfast (+$25/night)</FormLabel>
                    <p className="text-xs text-gray-500">
                      Continental breakfast served daily 7:00 AM - 10:00 AM
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Special Requests */}
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requests or requirements..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Price Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(form.watch('totalPrice'))}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Final price will be calculated based on dates and options selected
              </p>
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
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Book Now
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}