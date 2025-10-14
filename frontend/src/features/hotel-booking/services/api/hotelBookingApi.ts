import { rootApiSlice } from '../../../../store/api/rootApiSlice';

export interface CreateBookingData {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

export interface Booking {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelCountry?: string;
  roomId: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  conflicts?: any[];
}

export const hotelBookingApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, CreateBookingData>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
    }),
    getMyBookings: builder.query<Booking[], void>({
      query: () => '/bookings/my-bookings',
    }),
    getHotelBookings: builder.query<Booking[], void>({
      query: () => '/bookings/hotel-bookings',
    }),
    updateBookingStatus: builder.mutation<Booking, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),
    cancelBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
    }),
    createPaymentIntent: builder.mutation<{ clientSecret: string }, { amount: number }>({
      query: ({ amount }) => ({
        url: '/payments/create-payment-intent',
        method: 'POST',
        body: { amount },
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetHotelBookingsQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useCreatePaymentIntentMutation,
} = hotelBookingApi;
