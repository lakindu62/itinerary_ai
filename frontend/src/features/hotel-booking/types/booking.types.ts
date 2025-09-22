export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  hotelOwnerId: string;
  startDate: string;
  endDate: string;
  breakfastIncluded: boolean;
  currency: string;
  totalPrice: number;
  paymentStatus: boolean;
  paymentIntentId?: string;
  bookedAt: string;
  // Additional fields for conflict management
  source: 'INTERNAL' | 'EXTERNAL';
  externalBookingId?: string;
  conflictResolved: boolean;
}

export interface BookingConflict {
  id: string;
  roomId: string;
  conflictingBookings: Booking[];
  status: 'PENDING' | 'RESOLVED';
  resolvedAt?: string;
}