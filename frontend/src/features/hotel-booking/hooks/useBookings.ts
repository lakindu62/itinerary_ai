import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, CreateBookingData, Booking } from '../services/api/bookings.api';

export const useBookings = () => {
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  });

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: CreateBookingData) => bookingsApi.create(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      console.log('✅ Booking created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create booking:', error);
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      console.log('✅ Booking cancelled successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to cancel booking:', error);
    },
  });

  return {
    bookings,
    isLoading,
    error,
    refetch,
    createBooking: createBookingMutation.mutate,
    isCreating: createBookingMutation.isPending,
    cancelBooking: cancelBookingMutation.mutate,
    isCancelling: cancelBookingMutation.isPending,
  };
};

export const useUserBookings = (userId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: userBookings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-bookings', userId || 'NadPerz'],
    queryFn: () => bookingsApi.getUserBookings(userId),
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      console.log('✅ User booking cancelled successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to cancel user booking:', error);
    },
  });

  return {
    userBookings,
    isLoading,
    error,
    refetch,
    cancelBooking: cancelBookingMutation.mutate,
    isCancelling: cancelBookingMutation.isPending,
  };
};

export const useBooking = (bookingId: string) => {
  const {
    data: booking,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getById(bookingId),
    enabled: !!bookingId,
  });

  return {
    booking,
    isLoading,
    error,
    refetch,
  };
};

export default useBookings;