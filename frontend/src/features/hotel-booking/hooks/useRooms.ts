import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../services/api/rooms.api';
import { Room, CreateRoomRequest } from '../types/room.types';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';

export const useRooms = (hotelId?: string) => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  // Get rooms by hotel - Fixed React Query syntax (removed deprecated onSuccess/onError)
  const {
    data: rooms = [],
    isLoading,
    error
  } = useQuery<Room[]>({
    queryKey: ['rooms', hotelId],
    queryFn: async () => {
      console.log('🏠 React Query: Fetching rooms for hotel:', hotelId);
      if (!hotelId) {
        console.warn('⚠️ No hotelId provided to useRooms');
        return [];
      }
      const result = await roomsApi.getRoomsByHotel(hotelId);
      console.log('✅ React Query: Rooms loaded for hotel', hotelId, ':', result.length);
      if (result.length > 0) {
        console.log('🏠 Room list:', result.map((r: Room) => ({ id: r.id, title: r.title, hotelId: r.hotelId })));
      }
      return result;
    },
    enabled: !!hotelId,
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: (data: CreateRoomRequest & { imageFile?: File }) => {
      if (!userId) {
        toast.error('You must be logged in to create a room.');
        throw new Error('User not authenticated');
      }
      console.log('🔄 Creating room via mutation for hotel:', data.hotelId);
      return roomsApi.createRoom({ ...data, userId });
    },
    onSuccess: (createdRoom: Room) => {
      console.log('✅ Room created successfully:', createdRoom);
      // Invalidate rooms queries for this hotel
      queryClient.invalidateQueries({ queryKey: ['rooms', createdRoom.hotelId] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      // Also invalidate hotel queries to update room count
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Room created successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Room creation failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to create room');
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoomRequest> }) => {
      if (!userId) {
        toast.error('You must be logged in to update a room.');
        throw new Error('User not authenticated');
      }
      return roomsApi.updateRoom(id, { ...data, userId });
    },
    onSuccess: (updatedRoom: Room) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', updatedRoom.id] });
      toast.success('Room updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update room');
    },
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) {
        toast.error('You must be logged in to delete a room.');
        throw new Error('User not authenticated');
      }
      return roomsApi.deleteRoom(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Room deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete room');
    },
  });

  console.log('🏠 useRooms Hook State:', {
    hotelId,
    roomCount: rooms.length,
    isLoading,
    hasError: !!error,
    rooms: rooms.map((r: Room) => ({ id: r.id, title: r.title }))
  });

  return {
    rooms,
    isLoading,
    error,
    createRoom: createRoomMutation.mutateAsync,
    updateRoom: updateRoomMutation.mutateAsync,
    deleteRoom: deleteRoomMutation.mutateAsync,
    isCreating: createRoomMutation.isPending,
    isUpdating: updateRoomMutation.isPending,
    isDeleting: deleteRoomMutation.isPending,
  };
};

export const useRoom = (id: string) => {
  return useQuery<Room>({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getRoom(id),
    enabled: !!id,
  });
};