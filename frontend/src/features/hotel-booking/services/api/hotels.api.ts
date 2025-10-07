import api from '@/lib/api';
import { uploadToResourceBucket } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '../../types/hotel.types';

// All protected endpoints now require a Clerk JWT token as an argument
export const hotelApi = {
  // Get all hotels (public)
  getHotels: async (): Promise<Hotel[]> => {
    const response = await api.get('/hotels');
    return response.data.data || [];
  },

  // Get my hotels (protected)
  getMyHotels: async (token: string): Promise<Hotel[]> => {
    const response = await api.get('/hotels/my-hotels', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data.data || [];
  },

  // Get hotel by ID (public)
  getHotel: async (id: string): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data.data;
  },

  // Create hotel (protected)
  createHotel: async (data: CreateHotelRequest & { imageFile?: File }, token: string): Promise<Hotel> => {
    let imagePath = '';
    if (data.imageFile) {
      imagePath = await uploadToResourceBucket(data.imageFile, 'hotels');
    }
    const { userId, ...hotelData } = data; // userId not needed, backend extracts from JWT
    const payload: CreateHotelRequest = {
      ...hotelData,
      image: imagePath,
    };
    const response = await api.post('/hotels', payload, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Update hotel (protected)
  updateHotel: async (id: string, data: UpdateHotelRequest & { imageFile?: File }, token: string): Promise<Hotel> => {
    let updateData: UpdateHotelRequest = { ...data };
    if (data.imageFile) {
      updateData.image = await uploadToResourceBucket(data.imageFile, 'hotels');
    }
    const { userId, ...cleanUpdateData } = updateData as any;
    const response = await api.put(`/hotels/${id}`, cleanUpdateData, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Delete hotel (protected)
  deleteHotel: async (id: string, token: string): Promise<void> => {
    await api.delete(`/hotels/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Search hotels by location (public)
  searchHotelsByLocation: async (city: string, state?: string, country?: string): Promise<Hotel[]> => {
    const params = new URLSearchParams();
    params.append('city', city);
    if (state) params.append('state', state);
    if (country) params.append('country', country);
    const response = await api.get(`/hotels/search/location?${params.toString()}`);
    return response.data.data || [];
  },

  // Get hotels with filters (public)
  getHotelsWithFilters: async (filters: {
    city?: string;
    state?: string;
    country?: string;
  }): Promise<Hotel[]> => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.state) params.append('state', filters.state);
    if (filters.country) params.append('country', filters.country);
    const response = await api.get(`/hotels?${params.toString()}`);
    return response.data.data || [];
  }
};

export default hotelApi;