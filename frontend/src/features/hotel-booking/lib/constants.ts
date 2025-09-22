export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
} as const;

export const CONFLICT_STATUS = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
} as const;

export const AMENITIES = [
  { key: 'gym', label: 'Gym', icon: '🏋️' },
  { key: 'spa', label: 'Spa', icon: '💆' },
  { key: 'bar', label: 'Bar', icon: '🍸' },
  { key: 'laundry', label: 'Laundry', icon: '🧺' },
  { key: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { key: 'shopping', label: 'Shopping', icon: '🛍️' },
  { key: 'freeParking', label: 'Free Parking', icon: '🚗' },
  { key: 'bikeRental', label: 'Bike Rental', icon: '🚲' },
  { key: 'freeWifi', label: 'Free WiFi', icon: '📶' },
  { key: 'movieNights', label: 'Movie Nights', icon: '🎬' },
  { key: 'swimmingPool', label: 'Swimming Pool', icon: '🏊' },
  { key: 'coffeeShop', label: 'Coffee Shop', icon: '☕' },
] as const;

export const ROOM_AMENITIES = [
  { key: 'roomService', label: 'Room Service', icon: '🛎️' },
  { key: 'tv', label: 'TV', icon: '📺' },
  { key: 'balcony', label: 'Balcony', icon: '🌅' },
  { key: 'freeWifi', label: 'Free WiFi', icon: '📶' },
  { key: 'cityView', label: 'City View', icon: '🏙️' },
  { key: 'oceanView', label: 'Ocean View', icon: '🌊' },
  { key: 'forestView', label: 'Forest View', icon: '🌲' },
  { key: 'mountainView', label: 'Mountain View', icon: '⛰️' },
  { key: 'airCondition', label: 'Air Conditioning', icon: '❄️' },
  { key: 'soundProofed', label: 'Sound Proofed', icon: '🔇' },
] as const;