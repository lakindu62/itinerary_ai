import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelApi } from "../services/api/hotels.api";
import { Hotel, CreateHotelRequest } from "../types/hotel.types";
import { toast } from "react-hot-toast";

export const useHotels = () => {
  const queryClient = useQueryClient();

  // Get all hotels
  const {
    data: hotels = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => {
      console.log("🔄 React Query: Fetching hotels...");
      return hotelApi.getHotels();
    },
  });

  // Get my hotels
  const {
    data: myHotels = [],
    isLoading: isLoadingMyHotels,
    error: myHotelsError,
  } = useQuery({
    queryKey: ["my-hotels"],
    queryFn: () => {
      console.log("🔄 React Query: Fetching MY hotels...");
      return hotelApi.getMyHotels();
    },
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: (data: CreateHotelRequest & { imageFile?: File }) => {
      console.log("🔄 Creating hotel via mutation...");
      return hotelApi.createHotel(data);
    },
    onSuccess: (createdHotel: Hotel) => {
      console.log("✅ Hotel created successfully:", createdHotel);
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] });
      toast.success("Hotel created successfully!");
    },
    onError: (error: any) => {
      console.error("❌ Hotel creation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to create hotel");
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHotelRequest> & { imageFile?: File } }) => {
      console.log("🔄 Updating hotel via mutation:", id);
      return hotelApi.updateHotel(id, data);
    },
    onSuccess: (updatedHotel: Hotel) => {
      console.log("✅ Hotel updated successfully:", updatedHotel);
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", updatedHotel.id] });
      toast.success("Hotel updated successfully!");
    },
    onError: (error: any) => {
      console.error("❌ Hotel update failed:", error);
      toast.error(error?.response?.data?.message || "Failed to update hotel");
    },
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: (id: string) => hotelApi.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] });
      toast.success("Hotel deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete hotel");
    },
  });

  // Debug log
  console.log("🏨 useHotels Hook State:", {
    totalHotels: hotels.length,
    myHotels: myHotels.length,
    isLoading,
    isLoadingMyHotels,
    hasError: !!error || !!myHotelsError,
  });

  return {
    // Data
    hotels,
    myHotels,

    // Loading states
    isLoading,
    isLoadingMyHotels,
    error: error || myHotelsError,

    // Actions
    createHotel: createHotelMutation.mutateAsync,
    updateHotel: updateHotelMutation.mutateAsync,
    deleteHotel: deleteHotelMutation.mutateAsync,

    // Mutation states
    isCreating: createHotelMutation.isPending,
    isUpdating: updateHotelMutation.isPending,
    isDeleting: deleteHotelMutation.isPending,
  };
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotel(id),
    enabled: !!id,
  });
};
