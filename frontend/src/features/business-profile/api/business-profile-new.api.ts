import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Types
export interface BusinessProfile {
  id: string;
  businessName: string;
  ownerId: string;
  description?: string;
  categories: string[];
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  sliderImages: BusinessMedia[];
  videos: BusinessMedia[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  filename: string;
  order: number;
  createdAt: Date;
}

export interface CreateBusinessProfileData {
  businessName: string;
  ownerId: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
}

export interface UpdateBusinessProfileData {
  businessName?: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
  isActive?: boolean;
}

export interface CreateMediaData {
  type: 'image' | 'video';
  url: string;
  filename: string;
  order?: number;
  title?: string;
  description?: string;
}

// New Business Profile API
export const businessProfileApi = {
  // Profile Management
  createProfile: async (data: CreateBusinessProfileData): Promise<BusinessProfile> => {
    try {
      const response = await api.post('/business-profiles', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating business profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to create business profile');
    }
  },

  getProfile: async (id: string): Promise<BusinessProfile> => {
    try {
      const response = await api.get(`/business-profiles/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching business profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch business profile');
    }
  },

  getProfilesByOwner: async (ownerId: string): Promise<BusinessProfile[]> => {
    try {
      const response = await api.get(`/business-profiles/owner/${ownerId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profiles by owner:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profiles');
    }
  },

  getAllProfiles: async (page = 1, limit = 10): Promise<{ profiles: BusinessProfile[], total: number }> => {
    try {
      const response = await api.get(`/business-profiles?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all profiles:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profiles');
    }
  },

  updateProfile: async (id: string, data: UpdateBusinessProfileData, ownerId: string): Promise<BusinessProfile> => {
    try {
      const response = await api.put(`/business-profiles/${id}?ownerId=${ownerId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating business profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update business profile');
    }
  },

  deleteProfile: async (id: string, ownerId: string): Promise<void> => {
    try {
      await api.delete(`/business-profiles/${id}?ownerId=${ownerId}`);
    } catch (error: any) {
      console.error('Error deleting business profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete business profile');
    }
  },

  // Media Management
  addSliderImage: async (profileId: string, mediaData: CreateMediaData, ownerId: string): Promise<BusinessProfile> => {
    try {
      const response = await api.post(`/business-profiles/${profileId}/slider-images?ownerId=${ownerId}`, mediaData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding slider image:', error);
      throw new Error(error.response?.data?.message || 'Failed to add slider image');
    }
  },

  removeSliderImage: async (profileId: string, mediaId: string, ownerId: string): Promise<void> => {
    try {
      await api.delete(`/business-profiles/${profileId}/slider-images/${mediaId}?ownerId=${ownerId}`);
    } catch (error: any) {
      console.error('Error removing slider image:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove slider image');
    }
  },

  getSliderImages: async (profileId: string): Promise<BusinessMedia[]> => {
    try {
      const response = await api.get(`/business-profiles/${profileId}/slider-images`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching slider images:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch slider images');
    }
  },

  addVideo: async (profileId: string, mediaData: CreateMediaData, ownerId: string): Promise<BusinessProfile> => {
    try {
      const response = await api.post(`/business-profiles/${profileId}/videos?ownerId=${ownerId}`, mediaData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding video:', error);
      throw new Error(error.response?.data?.message || 'Failed to add video');
    }
  },

  removeVideo: async (profileId: string, mediaId: string, ownerId: string): Promise<void> => {
    try {
      await api.delete(`/business-profiles/${profileId}/videos/${mediaId}?ownerId=${ownerId}`);
    } catch (error: any) {
      console.error('Error removing video:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove video');
    }
  },

  getVideos: async (profileId: string): Promise<BusinessMedia[]> => {
    try {
      const response = await api.get(`/business-profiles/${profileId}/videos`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch videos');
    }
  },
};