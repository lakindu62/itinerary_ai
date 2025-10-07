import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '../services/api/hotels.api';
import { Hotel, CreateHotelRequest } from '../types/hotel.types';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export const useHotels = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, getToken } = useAuth();

  // Get all hotels (public)
  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelApi.getHotels(),
  });

  // Get my hotels (protected)
  const { data: myHotels = [], isLoading: isLoadingMyHotels, error: myHotelsError } = useQuery({
    queryKey: ['my-hotels'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const token = await getToken();
      return hotelApi.getMyHotels(token!); // pass token
    },
    enabled: isAuthenticated,
  });

  // Create hotel mutation (protected)
  const createHotelMutation = useMutation({
    mutationFn: async (data: CreateHotelRequest & { imageFile?: File }) => {
      if (!isAuthenticated) throw new Error('User not authenticated.');
      const token = await getToken();
      return hotelApi.createHotel(data, token!);
    },
    onSuccess: (createdHotel: Hotel) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create hotel');
    },
  });

  // Update hotel mutation (protected)
  const updateHotelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateHotelRequest> & { imageFile?: File } }) => {
      if (!isAuthenticated) throw new Error('User not authenticated.');
      const token = await getToken();
      return hotelApi.updateHotel(id, data, token!);
    },
    onSuccess: (updatedHotel: Hotel) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', updatedHotel.id] });
      toast.success('Hotel updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update hotel');
    },
  });

  // Delete hotel mutation (protected)
  const deleteHotelMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAuthenticated) throw new Error('User not authenticated.');
      const token = await getToken();
      return hotelApi.deleteHotel(id, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete hotel');
    },
  });

  return {
    hotels,
    myHotels,
    isLoading,
    isLoadingMyHotels,
    error: error || myHotelsError,
    createHotel: createHotelMutation.mutateAsync,
    updateHotel: updateHotelMutation.mutateAsync,
    deleteHotel: deleteHotelMutation.mutateAsync,
    isCreating: createHotelMutation.isPending,
    isUpdating: updateHotelMutation.isPending,
    isDeleting: deleteHotelMutation.isPending,
  };
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApi.getHotel(id),
    enabled: !!id,
  });
};