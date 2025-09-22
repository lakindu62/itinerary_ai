import api from '@/lib/api';
import { Booking } from '../../types/booking.types';

export const emailService = {
  // Send booking confirmation
  sendBookingConfirmation: async (booking: Booking) => {
    const response = await api.post('/email/booking-confirmation', {
      bookingId: booking.id,
      userEmail: booking.userId, // Assuming userId contains email
      hotelName: 'Hotel Name', // You'll need to fetch this
      roomName: 'Room Name', // You'll need to fetch this
      checkIn: booking.startDate,
      checkOut: booking.endDate,
      totalAmount: booking.totalPrice,
    });
    return response.data;
  },

  // Send payment confirmation
  sendPaymentConfirmation: async (booking: Booking) => {
    const response = await api.post('/email/payment-confirmation', {
      bookingId: booking.id,
      paymentIntentId: booking.paymentIntentId,
      amount: booking.totalPrice,
    });
    return response.data;
  },

  // Send cancellation notification
  sendCancellationNotification: async (bookingId: string) => {
    const response = await api.post('/email/cancellation', {
      bookingId,
    });
    return response.data;
  },
};