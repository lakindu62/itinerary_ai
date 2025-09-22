import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '../services/api/hotels.api';
import { Hotel } from '../types/hotel.types';
import { toast } from 'react-hot-toast';

export const useHotels = () => {
  const queryClient = useQueryClient();

  // Get all hotels
  const {
    data: hotels = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelApi.getHotels,
  });

  // Get my hotels
  const {
    data: myHotels = [],
    isLoading: isLoadingMyHotels
  } = useQuery({
    queryKey: ['my-hotels'],
    queryFn: hotelApi.getMyHotels,
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: hotelApi.createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create hotel');
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hotelApi.updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update hotel');
    },
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: hotelApi.deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete hotel');
    },
  });

  return {
    hotels,
    myHotels,
    isLoading: isLoading || isLoadingMyHotels,
    error,
    createHotel: createHotelMutation.mutateAsync,
    updateHotel: updateHotelMutation.mutateAsync,
    deleteHotel: deleteHotelMutation.mutateAsync,
    isCreating: createHotelMutation.isPending,
    isUpdating: updateHotelMutation.isPending,
    isDeleting: deleteHotelMutation.isPending,
  };
};

// Hook for single hotel
export const useHotel = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => hotelApi.getHotel(hotelId),
    enabled: !!hotelId,
  });
};