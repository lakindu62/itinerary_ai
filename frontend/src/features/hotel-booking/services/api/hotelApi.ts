import { rootApiSlice } from '../../../../store/api/rootApiSlice';

export interface CreateHotelData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  amenities: string[];
  images: string[];
}

export interface Hotel {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const hotelApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createHotel: builder.mutation<Hotel, CreateHotelData>({
      query: (hotelData) => ({
        url: '/hotels',
        method: 'POST',
        body: hotelData,
      }),
    }),
    getHotel: builder.query<Hotel, string>({
      query: (id) => `/hotels/${id}`,
    }),
    getMyHotels: builder.query<Hotel[], void>({
      query: () => '/hotels/my-hotels',
    }),
    getHotels: builder.query<Hotel[], void>({
      query: () => '/hotels',
    }),
    updateHotel: builder.mutation<Hotel, { id: string; data: Partial<CreateHotelData> }>({
      query: ({ id, data }) => ({
        url: `/hotels/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteHotel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateHotelMutation,
  useGetHotelQuery,
  useGetHotelsQuery,
  useGetMyHotelsQuery,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;
