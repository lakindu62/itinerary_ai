import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessProfileApi, MenuItem, getAuthToken } from '../api/business-profile.api';
import { BusinessMedia } from '../types/media.types';
import { toast } from 'sonner';

// Media Hooks
export const useMediaQuery = (type: BusinessMedia['type']) => {
  return useQuery({
    queryKey: ['business-media', type],
    queryFn: async () => {
      try {
        const data = await businessProfileApi.getMedia(type);
        return data || []; // Return empty array if data is null/undefined
      } catch (error) {
        console.error('Error fetching media:', error);
        throw error;
      }
    },
    retry: 1, // Only retry once on failure
    initialData: [], // Start with empty array
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessProfileApi.createMedia,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-media', variables.type] });
      toast.success('Media added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add media: ' + error.message);
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessProfileApi.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-media'] });
      toast.success('Media deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete media: ' + error.message);
    },
  });
};

// Menu Item Hooks
export const useMenuItemsQuery = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      try {
        const data = await businessProfileApi.getMenuItems();
        return data || [];
      } catch (error: any) {
        console.error('Error fetching menu items:', error);
        // Don't throw the error, return empty array instead
        if (error.message?.includes('Backend server is not running')) {
          console.warn('Backend not available, returning empty menu items');
          return [];
        }
        throw error;
      }
    },
    initialData: [], // Start with empty array
    retry: (failureCount, error: any) => {
      // Don't retry if it's a backend connection issue
      if (error.message?.includes('Backend server is not running')) {
        return false;
      }
      return failureCount < 1; // Only retry once for other errors
    },
  });
};

// Analytics Hooks
export const useAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['business-analytics'],
    queryFn: async () => {
      try {
        // Check if we have a valid token before making the request
        const token = getAuthToken();
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        const data = await businessProfileApi.getAnalytics();
        return data || null;
      } catch (error: any) {
        // Handle specific error cases
        if (error.response?.status === 401) {
          window.location.href = '/sign-in';
          throw new Error('Please sign in to view analytics');
        }
        console.error('Error fetching analytics:', error);
        throw error;
      }
    },
    retry: false, // Don't retry on auth errors
    refetchOnWindowFocus: true, // Refresh data when window regains focus
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessProfileApi.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add menu item: ' + error.message);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessProfileApi.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete menu item: ' + error.message);
    },
  });
};