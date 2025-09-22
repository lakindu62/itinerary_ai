import api from '@/lib/api';
import { Room } from '../../types/room.types';

export const roomsApi = {
  // Get rooms by hotel
  getRoomsByHotel: async (hotelId: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/hotel/${hotelId}`);
    return response.data.data;
  },

  // Get single room
  getRoom: async (roomId: string): Promise<Room> => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data.data;
  },

  // Create room
  createRoom: async (data: any): Promise<Room> => {
    let imageUrl = '';
    
    if (data.imageFile) {
      imageUrl = await uploadImageToMinio(data.imageFile, 'rooms');
    }

    const roomData = {
      ...data,
      image: imageUrl,
    };

    const response = await api.post('/rooms', roomData);
    return response.data.data;
  },

  // Update room
  updateRoom: async (roomId: string, data: any): Promise<Room> => {
    const response = await api.put(`/rooms/${roomId}`, data);
    return response.data.data;
  },

  // Delete room
  deleteRoom: async (roomId: string): Promise<void> => {
    await api.delete(`/rooms/${roomId}`);
  },

  // Check availability
  checkAvailability: async (roomId: string, startDate: string, endDate: string): Promise<{ available: boolean }> => {
    const response = await api.get(`/bookings/check-availability/${roomId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },

  // Get available rooms
  getAvailableRooms: async (hotelId: string, startDate: string, endDate: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/available/${hotelId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
};

// Minio upload utility
async function uploadImageToMinio(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}