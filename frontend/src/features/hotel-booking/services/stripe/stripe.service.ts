// Mock Stripe service for demo purposes
export interface PaymentData {
  amount: number;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  error?: string;
  chargeId?: string;
}

export const stripeService = {
  // Process payment
  processPayment: async (paymentData: PaymentData): Promise<PaymentResult> => {
    console.log('💳 Processing Stripe payment:', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      cardLast4: paymentData.cardNumber.slice(-4),
      timestamp: '2025-09-25 11:18:45',
      user: 'NadPerz'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock payment validation
    const isTestCard = paymentData.cardNumber.replace(/\s/g, '') === '4242424242424242';
    const isValidExpiry = paymentData.expiryDate.match(/^\d{2}\/\d{2}$/);
    const isValidCvv = paymentData.cvv.length >= 3;

    if (!isTestCard) {
      return {
        success: false,
        paymentId: '',
        error: 'Invalid card number. Use 4242 4242 4242 4242 for testing.'
      };
    }

    if (!isValidExpiry) {
      return {
        success: false,
        paymentId: '',
        error: 'Invalid expiry date format.'
      };
    }

    if (!isValidCvv) {
      return {
        success: false,
        paymentId: '',
        error: 'Invalid CVV.'
      };
    }

    // Mock successful payment
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chargeId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ Payment processed successfully:', {
      paymentId,
      chargeId,
      amount: paymentData.amount,
      timestamp: '2025-09-25 11:18:45'
    });

    return {
      success: true,
      paymentId,
      chargeId,
      error: undefined
    };
  },

  // Refund payment
  refundPayment: async (paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }> => {
    console.log('💰 Processing refund:', {
      paymentId,
      amount,
      timestamp: '2025-09-25 11:18:45',
      user: 'NadPerz'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      refundId,
      error: undefined
    };
  },

  // Get payment details
  getPaymentDetails: async (paymentId: string): Promise<any> => {
    console.log('🔍 Fetching payment details:', {
      paymentId,
      timestamp: '2025-09-25 11:18:45',
      user: 'NadPerz'
    });

    // Mock payment details
    return {
      id: paymentId,
      amount: 10000, // amount in cents
      currency: 'usd',
      status: 'succeeded',
      created: Math.floor(Date.now() / 1000),
      description: 'Hotel booking payment',
      card: {
        last4: '4242',
        brand: 'visa',
        exp_month: 12,
        exp_year: 2025
      }
    };
  }
};

export default stripeService;