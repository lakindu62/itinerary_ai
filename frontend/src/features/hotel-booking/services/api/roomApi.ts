import { rootApiSlice } from '../../../../store/api/rootApiSlice';

export interface CreateRoomData {
  hotelId: string;
  name: string;
  description: string;
  price: number;
  amenities: string[];
  images: string[];
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const roomApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation<Room, CreateRoomData>({
      query: (roomData) => ({
        url: '/rooms',
        method: 'POST',
        body: roomData,
      }),
    }),
    getRoom: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
    }),
    updateRoom: builder.mutation<Room, { id: string; data: Partial<CreateRoomData> }>({
      query: ({ id, data }) => ({
        url: `/rooms/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useGetRoomQuery,
  useGetRoomsByHotelQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
