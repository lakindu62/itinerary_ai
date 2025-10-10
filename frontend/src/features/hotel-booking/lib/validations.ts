import * as z from 'zod';
import { HOTEL_BOOKING_CONSTANTS } from './constants';

// Booking validation schema - Fixed optional/required fields
export const bookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  hotelId: z.string().min(1, 'Hotel is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  guestCount: z.number().min(1, 'At least 1 guest is required'),
  breakfastIncluded: z.boolean().default(false), // Make required with default
  totalPrice: z.number().min(0, 'Total price must be positive'),
  currency: z.string().default('USD'), // Make required with default
  specialRequests: z.string().optional(),
});

// TypeScript type from schema
export type BookingFormData = z.infer<typeof bookingSchema>;

// Rest of your validation functions remain the same...
export const validateHotelTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Hotel name is required' };
  }
  
  if (title.length < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_HOTEL_NAME_LENGTH) {
    return { 
      valid: false, 
      error: `Hotel name must be at least ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_HOTEL_NAME_LENGTH} characters` 
    };
  }
  
  if (title.length > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_HOTEL_NAME_LENGTH) {
    return { 
      valid: false, 
      error: `Hotel name must not exceed ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_HOTEL_NAME_LENGTH} characters` 
    };
  }
  
  return { valid: true };
};

export const validateHotelDescription = (description: string): { valid: boolean; error?: string } => {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'Hotel description is required' };
  }
  
  if (description.length < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_DESCRIPTION_LENGTH) {
    return { 
      valid: false, 
      error: `Description must be at least ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_DESCRIPTION_LENGTH} characters` 
    };
  }
  
  if (description.length > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_DESCRIPTION_LENGTH) {
    return { 
      valid: false, 
      error: `Description must not exceed ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_DESCRIPTION_LENGTH} characters` 
    };
  }
  
  return { valid: true };
};

export const validateRoomPrice = (price: number): { valid: boolean; error?: string } => {
  if (!price || price <= 0) {
    return { valid: false, error: 'Room price is required and must be greater than 0' };
  }
  
  if (price < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_ROOM_PRICE) {
    return { 
      valid: false, 
      error: `Room price must be at least $${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_ROOM_PRICE}` 
    };
  }
  
  if (price > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_ROOM_PRICE) {
    return { 
      valid: false, 
      error: `Room price must not exceed $${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_ROOM_PRICE}` 
    };
  }
  
  return { valid: true };
};

export const validateRoomCapacity = (
  guestCount: number,
  bedCount: number,
  bathroomCount: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!guestCount || guestCount < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_GUESTS) {
    errors.push(`Guest count must be at least ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_GUESTS}`);
  }
  
  if (guestCount > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_GUESTS) {
    errors.push(`Guest count must not exceed ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_GUESTS}`);
  }
  
  if (!bedCount || bedCount < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BEDS) {
    errors.push(`Bed count must be at least ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BEDS}`);
  }
  
  if (bedCount > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BEDS) {
    errors.push(`Bed count must not exceed ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BEDS}`);
  }
  
  if (!bathroomCount || bathroomCount < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BATHROOMS) {
    errors.push(`Bathroom count must be at least ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BATHROOMS}`);
  }
  
  if (bathroomCount > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BATHROOMS) {
    errors.push(`Bathroom count must not exceed ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BATHROOMS}`);
  }
  
  return { valid: errors.length === 0, errors };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true };
};

export const validateBookingDates = (
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Please enter valid dates' };
  }
  
  if (start < now) {
    return { valid: false, error: 'Start date must be in the future' };
  }
  
  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' };
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BOOKING_DAYS) {
    return { 
      valid: false, 
      error: `Minimum booking duration is ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BOOKING_DAYS} day${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MIN_BOOKING_DAYS !== 1 ? 's' : ''}` 
    };
  }
  
  if (diffDays > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BOOKING_DAYS) {
    return { 
      valid: false, 
      error: `Maximum booking duration is ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.MAX_BOOKING_DAYS} days` 
    };
  }
  
  const advanceTime = Math.abs(start.getTime() - now.getTime());
  const advanceDays = Math.ceil(advanceTime / (1000 * 60 * 60 * 24));
  
  if (advanceDays > HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.ADVANCE_BOOKING_DAYS) {
    return { 
      valid: false, 
      error: `Bookings can only be made up to ${HOTEL_BOOKING_CONSTANTS.BUSINESS_RULES.ADVANCE_BOOKING_DAYS} days in advance` 
    };
  }
  
  return { valid: true };
};

export const hotelValidations = {
  hotel: {
    title: validateHotelTitle,
    description: validateHotelDescription,
  },
  
  room: {
    price: validateRoomPrice,
    capacity: validateRoomCapacity,
  },
  
  booking: {
    dates: validateBookingDates,
    schema: bookingSchema,
  },
  
  common: {
    email: validateEmail,
  },
  
  validateHotel: (hotel: {
    title: string;
    description: string;
    country: string;
    state: string;
    city: string;
  }) => {
    const errors: string[] = [];
    
    const titleValidation = validateHotelTitle(hotel.title);
    if (!titleValidation.valid) errors.push(titleValidation.error!);
    
    const descriptionValidation = validateHotelDescription(hotel.description);
    if (!descriptionValidation.valid) errors.push(descriptionValidation.error!);
    
    if (!hotel.country?.trim()) errors.push('Country is required');
    if (!hotel.state?.trim()) errors.push('State is required');
    if (!hotel.city?.trim()) errors.push('City is required');
    
    return { valid: errors.length === 0, errors };
  },
  
  validateRoom: (room: {
    title: string;
    description: string;
    roomPrice: number;
    guestCount: number;
    bedCount: number;
    bathroomCount: number;
  }) => {
    const errors: string[] = [];
    
    const titleValidation = validateHotelTitle(room.title);
    if (!titleValidation.valid) errors.push(titleValidation.error!);
    
    const descriptionValidation = validateHotelDescription(room.description);
    if (!descriptionValidation.valid) errors.push(descriptionValidation.error!);
    
    const priceValidation = validateRoomPrice(room.roomPrice);
    if (!priceValidation.valid) errors.push(priceValidation.error!);
    
    const capacityValidation = validateRoomCapacity(room.guestCount, room.bedCount, room.bathroomCount);
    if (!capacityValidation.valid) errors.push(...capacityValidation.errors);
    
    return { valid: errors.length === 0, errors };
  }
};

export default hotelValidations;