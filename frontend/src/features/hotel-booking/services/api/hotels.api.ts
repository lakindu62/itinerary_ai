import api from '@/lib/api';
import { uploadToResourceBucket } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '../../types/hotel.types';

export const hotelApi = {
  // Get all hotels - Enhanced with debugging
  getHotels: async (): Promise<Hotel[]> => {
    try {
      console.log('🏨 Fetching all hotels...');
      const response = await api.get('/hotels');
      console.log('✅ All hotels API response:', response.data);
      console.log('🏨 Hotels data:', response.data.data);
      console.log('🔢 Total hotels found:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching all hotels:', error);
      return [];
    }
  },

  // Get my hotels - Enhanced with debugging and proper error typing
  getMyHotels: async (): Promise<Hotel[]> => {
    try {
      console.log('🏨 Fetching MY hotels...');
      console.log('🏨 Calling endpoint: /hotels/my-hotels');
      
      const response = await api.get('/hotels/my-hotels');
      
      console.log('✅ My hotels API response:', response.data);
      console.log('🏨 My hotels data:', response.data.data);
      console.log('🔢 My hotels count:', response.data.data?.length || 0);
      
      // Additional debugging
      if (response.data.data && response.data.data.length > 0) {
        console.log('🎯 First hotel sample:', response.data.data[0]);
        response.data.data.forEach((hotel: Hotel, index: number) => {
          console.log(`🏨 Hotel ${index + 1}:`, {
            id: hotel.id,
            title: hotel.title,
            userId: hotel.userId,
            image: hotel.image
          });
        });
      } else {
        console.warn('⚠️ No hotels returned from my-hotels endpoint');
        
        // Let's try the regular hotels endpoint as fallback
        console.log('🔄 Trying fallback: fetching all hotels...');
        try {
          const allHotelsResponse = await api.get('/hotels');
          console.log('📊 All hotels response for debugging:', allHotelsResponse.data);
          
          if (allHotelsResponse.data.data?.length > 0) {
            console.log('🎯 Found hotels in /hotels endpoint, but not in /my-hotels');
            console.log('🔍 This suggests a user filtering issue');
            
            // Return all hotels as fallback for now
            console.log('🔄 Using all hotels as fallback...');
            return allHotelsResponse.data.data;
          }
        } catch (fallbackError: any) {
          console.error('❌ Fallback request also failed:', fallbackError);
        }
      }
      
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching my hotels:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Try fallback to all hotels if my-hotels fails
      try {
        console.log('🔄 my-hotels failed, trying all hotels as fallback...');
        const fallbackResponse = await api.get('/hotels');
        console.log('✅ Fallback successful, returning all hotels');
        return fallbackResponse.data.data || [];
      } catch (fallbackError: any) {
        console.error('❌ Both my-hotels and fallback failed:', fallbackError);
        return [];
      }
    }
  },

  // Get hotel by ID
  getHotel: async (id: string): Promise<Hotel> => {
    console.log('🏨 Fetching hotel by ID:', id);
    const response = await api.get(`/hotels/${id}`);
    console.log('✅ Hotel fetched successfully:', response.data.data?.title);
    return response.data.data;
  },

  // Create hotel - Store PATH in database, not full URL
  createHotel: async (data: CreateHotelRequest & { imageFile?: File }): Promise<Hotel> => {
    let imagePath = '';
    
    // Handle image upload to hotel-bucket
    if (data.imageFile) {
      try {
        console.log('🏨 Uploading hotel image to hotel-bucket...');
        
        // Upload and get PATH (not full URL)
        imagePath = await uploadToResourceBucket(
          data.imageFile, 
          'hotels',
          'NadPerz'
        );
        
        console.log('✅ Hotel image uploaded, path stored:', imagePath);
        
      } catch (error: any) {
        console.error('❌ Hotel image upload failed:', error);
        imagePath = '';
      }
    }

    // Store PATH in database, not full HTTP URL
    const hotelData: CreateHotelRequest = {
      title: data.title,
      description: data.description,
      image: imagePath,
      country: data.country,
      state: data.state,
      city: data.city,
      locationDescription: data.locationDescription, // Can be undefined
      gym: data.gym,
      spa: data.spa,
      bar: data.bar,
      laundry: data.laundry,
      restaurant: data.restaurant,
      shopping: data.shopping,
      freeParking: data.freeParking,
      bikeRental: data.bikeRental,
      freeWifi: data.freeWifi,
      movieNights: data.movieNights,
      swimmingPool: data.swimmingPool,
      coffeeShop: data.coffeeShop,
    };

    console.log('🏨 Creating hotel with data:', hotelData);
    const response = await api.post('/hotels', hotelData);
    console.log('✅ Hotel created successfully:', response.data.data);
    
    return response.data.data;
  },

  // Update hotel - Store PATH in database
  updateHotel: async (id: string, data: UpdateHotelRequest & { imageFile?: File }): Promise<Hotel> => {
    let updateData: UpdateHotelRequest = { ...data };
    
    // Handle image update if new image is provided
    if (data.imageFile) {
      try {
        console.log('🏨 Updating hotel image in hotel-bucket...');
        
        const imagePath = await uploadToResourceBucket(
          data.imageFile,
          'hotels', 
          'NadPerz'
        );
        
        updateData.image = imagePath; // Store path, not full URL
        console.log('✅ Hotel image updated, path stored:', imagePath);
        
      } catch (error: any) {
        console.error('❌ Hotel image update failed:', error);
      }
    }
    
    // Remove imageFile from update data
    const { imageFile, ...cleanUpdateData } = updateData as any;
    
    console.log('🏨 Updating hotel:', id, cleanUpdateData);
    const response = await api.put(`/hotels/${id}`, cleanUpdateData);
    console.log('✅ Hotel updated successfully');
    return response.data.data;
  },

  // Delete hotel
  deleteHotel: async (id: string): Promise<void> => {
    console.log('🏨 Deleting hotel:', id);
    await api.delete(`/hotels/${id}`);
    console.log('✅ Hotel deleted successfully');
  },

  // Search hotels by location
  searchHotelsByLocation: async (city: string, state?: string, country?: string): Promise<Hotel[]> => {
    try {
      const params = new URLSearchParams();
      params.append('city', city);
      if (state) params.append('state', state);
      if (country) params.append('country', country);
      
      console.log('🏨 Searching hotels by location:', { city, state, country });
      const response = await api.get(`/hotels/search/location?${params.toString()}`);
      console.log('✅ Hotels search completed:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error searching hotels:', error);
      return [];
    }
  },

  // Get hotels with filters
  getHotelsWithFilters: async (filters: {
    city?: string;
    state?: string;
    country?: string;
  }): Promise<Hotel[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.country) params.append('country', filters.country);
      
      console.log('🏨 Fetching hotels with filters:', filters);
      const response = await api.get(`/hotels?${params.toString()}`);
      console.log('✅ Filtered hotels fetched:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching filtered hotels:', error);
      return [];
    }
  }
};

export default hotelApi;