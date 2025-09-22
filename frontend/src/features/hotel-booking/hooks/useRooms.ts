import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../services/api/rooms.api';
import { toast } from 'react-hot-toast';

export const useRooms = (hotelId?: string) => {
  const queryClient = useQueryClient();

  // Get rooms by hotel
  const {
    data: rooms = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['rooms', hotelId],
    queryFn: () => roomsApi.getRoomsByHotel(hotelId!),
    enabled: !!hotelId,
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: roomsApi.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create room');
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => roomsApi.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update room');
    },
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: roomsApi.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    },
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

// Hook for single room
export const useRoom = (roomId: string) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomsApi.getRoom(roomId),
    enabled: !!roomId,
  });
};

// Hook for room availability
export const useRoomAvailability = (roomId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['room-availability', roomId, startDate, endDate],
    queryFn: () => roomsApi.checkAvailability(roomId, startDate, endDate),
    enabled: !!(roomId && startDate && endDate),
  });
};