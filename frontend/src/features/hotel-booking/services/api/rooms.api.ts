import api from '@/lib/api';
import { uploadToResourceBucket } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Room, CreateRoomRequest, UpdateRoomRequest } from '../../types/room.types';

export const roomsApi = {
  // Get rooms by hotel - Enhanced debugging
  getRoomsByHotel: async (hotelId: string): Promise<Room[]> => {
    try {
      console.log('🏠 API: Fetching rooms for hotel:', hotelId);
      console.log('🏠 API: Calling endpoint:', `/rooms/hotel/${hotelId}`);
      
      const response = await api.get(`/rooms/hotel/${hotelId}`);
      
      console.log('✅ Rooms API response:', response.data);
      console.log('🏠 Rooms data:', response.data.data);
      console.log('🔢 Room count for hotel', hotelId, ':', response.data.data?.length || 0);
      
      if (response.data.data && response.data.data.length > 0) {
        response.data.data.forEach((room: Room, index: number) => {
          console.log(`🏠 Room ${index + 1}:`, {
            id: room.id,
            title: room.title,
            hotelId: room.hotelId,
            image: room.image
          });
        });
      } else {
        console.warn('⚠️ No rooms found for hotel:', hotelId);
        
        // Try to debug: fetch all rooms to see what's available
        try {
          console.log('🔍 Debug: Fetching ALL rooms to check...');
          const allRoomsResponse = await api.get('/rooms');
          console.log('📊 All rooms in database:', allRoomsResponse.data.data?.length || 0);
          
          if (allRoomsResponse.data.data?.length > 0) {
            const roomsForThisHotel = allRoomsResponse.data.data.filter((r: Room) => r.hotelId === hotelId);
            console.log('🎯 Found rooms for this hotel in all rooms:', roomsForThisHotel.length);
            
            if (roomsForThisHotel.length > 0) {
              console.log('🔍 This suggests the /rooms/hotel/ID endpoint might not be working correctly');
              console.log('🔄 Using filtered results as fallback');
              return roomsForThisHotel;
            }
          }
        } catch (debugError) {
          console.error('❌ Debug request failed:', debugError);
        }
      }
      
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching rooms for hotel', hotelId, ':', error);
      console.error('❌ Error details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      return [];
    }
  },

  // Get single room
  getRoom: async (roomId: string): Promise<Room> => {
    console.log('🏠 API: Fetching room by ID:', roomId);
    const response = await api.get(`/rooms/${roomId}`);
    console.log('✅ Room fetched successfully:', response.data.data?.title);
    return response.data.data;
  },

  // Create room - Store PATH in database, not full URL
  createRoom: async (data: CreateRoomRequest & { imageFile?: File }): Promise<Room> => {
    let imagePath = '';
    
    if (data.imageFile) {
      try {
        console.log('🏠 Uploading room image to room-bucket...');
        
        // Upload to room-bucket with NadPerz username
        imagePath = await uploadToResourceBucket(
          data.imageFile, 
          'rooms',
          'NadPerz'
        );
        
        console.log('✅ Room image uploaded, path stored:', imagePath);
        
      } catch (error: any) {
        console.error('❌ Room image upload failed:', error);
        // Use empty path instead of placeholder URL
        imagePath = '';
      }
    }

    // Store PATH in database, not full HTTP URL
    const roomData: CreateRoomRequest = {
      ...data,
      image: imagePath, // Store path like "room-bucket/images/rooms_NadPerz_123456789_image.jpg"
    };
    
    // Remove imageFile from data sent to API
    const { imageFile, ...apiData } = roomData as any;

    console.log('🏠 Creating room with data:', apiData);
    console.log('🏠 Room will be associated with hotel:', apiData.hotelId);
    const response = await api.post('/rooms', apiData);
    console.log('✅ Room created successfully:', response.data.data);
    return response.data.data;
  },

  // Update room
  updateRoom: async (roomId: string, data: UpdateRoomRequest & { imageFile?: File }): Promise<Room> => {
    let updateData: UpdateRoomRequest = { ...data };
    
    // Handle image update if new image is provided
    if (data.imageFile) {
      try {
        console.log('🏠 Updating room image in room-bucket...');
        
        const imagePath = await uploadToResourceBucket(
          data.imageFile,
          'rooms',
          'NadPerz'
        );
        
        updateData.image = imagePath; // Store path, not full URL
        console.log('✅ Room image updated, path stored:', imagePath);
        
      } catch (error: any) {
        console.error('❌ Room image update failed:', error);
      }
    }
    
    // Remove imageFile from update data
    const { imageFile, ...cleanUpdateData } = updateData as any;
    
    console.log('🏠 Updating room:', roomId, cleanUpdateData);
    const response = await api.put(`/rooms/${roomId}`, cleanUpdateData);
    console.log('✅ Room updated successfully');
    return response.data.data;
  },

  // Delete room
  deleteRoom: async (roomId: string): Promise<void> => {
    console.log('🏠 Deleting room:', roomId);
    await api.delete(`/rooms/${roomId}`);
    console.log('✅ Room deleted successfully');
  },

  // Check availability
  checkAvailability: async (roomId: string, startDate: string, endDate: string): Promise<{ available: boolean }> => {
    console.log('🏠 Checking room availability:', { roomId, startDate, endDate });
    const response = await api.get(`/bookings/check-availability/${roomId}?startDate=${startDate}&endDate=${endDate}`);
    console.log('✅ Availability checked:', response.data.data);
    return response.data.data;
  },

  // Get available rooms
  getAvailableRooms: async (hotelId: string, startDate: string, endDate: string): Promise<Room[]> => {
    try {
      console.log('🏠 Fetching available rooms:', { hotelId, startDate, endDate });
      const response = await api.get(`/rooms/available/${hotelId}?startDate=${startDate}&endDate=${endDate}`);
      console.log('✅ Available rooms fetched:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching available rooms:', error);
      return [];
    }
  },
};

export default roomsApi;