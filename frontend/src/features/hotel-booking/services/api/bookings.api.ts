import api from '@/lib/api';
import { Booking } from '../../types/booking.types';

export const bookingsApi = {
  // Create booking
  createBooking: async (data: any): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data.data;
  },

  // Get all bookings (for admin)
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/hotel-bookings');
    return response.data.data;
  },

  // Get user bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data;
  },

  // Get single booking
  getBooking: async (bookingId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, data: { paymentStatus: boolean; paymentIntentId?: string }): Promise<Booking> => {
    const response = await api.put(`/bookings/${bookingId}/status`, data);
    return response.data.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.delete(`/bookings/${bookingId}`);
  },

  // Get room bookings
  getRoomBookings: async (roomId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/room/${roomId}`);
    return response.data.data;
  },
};