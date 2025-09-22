import api from '@/lib/api';
import { Hotel, CreateHotelRequest } from '../../types/hotel.types';

export const hotelApi = {
  // Get all hotels
  getHotels: async (): Promise<Hotel[]> => {
    const response = await api.get('/hotels');
    return response.data.data;
  },

  // Get hotel by ID
  getHotel: async (id: string): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data.data;
  },

  // Create hotel with image upload
  createHotel: async (data: CreateHotelRequest & { imageFile?: File }): Promise<Hotel> => {
    let imageUrl = '';
    
    // Upload image to Minio if provided
    if (data.imageFile) {
      imageUrl = await uploadImageToMinio(data.imageFile, 'hotels');
    }

    const hotelData = {
      ...data,
      image: imageUrl,
    };

    const response = await api.post('/hotels', hotelData);
    return response.data.data;
  },

  // Update hotel
  updateHotel: async (id: string, data: Partial<CreateHotelRequest>): Promise<Hotel> => {
    const response = await api.put(`/hotels/${id}`, data);
    return response.data.data;
  },

  // Delete hotel
  deleteHotel: async (id: string): Promise<void> => {
    await api.delete(`/hotels/${id}`);
  },

  // Get my hotels
  getMyHotels: async (): Promise<Hotel[]> => {
    const response = await api.get('/hotels/my-hotels');
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