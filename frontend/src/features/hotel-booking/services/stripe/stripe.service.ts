import { loadStripe } from '@stripe/stripe-js';
import api from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const stripeService = {
  // Create payment intent
  createPaymentIntent: async (bookingData: {
    roomId: string;
    hotelId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    currency: string;
  }) => {
    const response = await api.post('/payments/create-intent', bookingData);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string, bookingId: string) => {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');

    const { error } = await stripe.confirmPayment({
      elements: {} as any, // Will be provided by Stripe Elements
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/booking/confirmation?booking=${bookingId}`,
      },
    });

    if (error) {
      throw error;
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (paymentIntentId: string) => {
    const response = await api.post('/payments/success', { paymentIntentId });
    return response.data;
  },
};