import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../services/api/bookings.api';
import { toast } from 'react-hot-toast';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Get all bookings (for admin)
  const {
    data: bookings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAllBookings,
  });

  // Get my bookings
  const {
    data: myBookings = [],
    isLoading: isLoadingMyBookings
  } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsApi.getMyBookings,
  });

  // Mock conflicts data (you'll replace with real API)
  const conflicts = bookings.filter(booking => 
    booking.source === 'EXTERNAL' && !booking.conflictResolved
  );

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingsApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success('Booking created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });

  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      bookingsApi.updateBookingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: bookingsApi.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success('Booking cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  return {
    bookings,
    myBookings,
    conflicts,
    isLoading: isLoading || isLoadingMyBookings,
    error,
    createBooking: createBookingMutation.mutateAsync,
    updateBookingStatus: updateBookingStatusMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingStatusMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
};

// Hook for single booking
export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getBooking(bookingId),
    enabled: !!bookingId,
  });
};