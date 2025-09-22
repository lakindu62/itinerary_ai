import { z } from 'zod';

export const hotelSchema = z.object({
  title: z.string().min(3, 'Hotel title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  locationDescription: z.string().min(10, 'Location description is required'),
  gym: z.boolean(),
  spa: z.boolean(),
  bar: z.boolean(),
  laundry: z.boolean(),
  restaurant: z.boolean(),
  shopping: z.boolean(),
  freeParking: z.boolean(),
  bikeRental: z.boolean(),
  freeWifi: z.boolean(),
  movieNights: z.boolean(),
  swimmingPool: z.boolean(),
  coffeeShop: z.boolean(),
});

export const roomSchema = z.object({
  title: z.string().min(3, 'Room title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  bedCount: z.number().min(1, 'At least 1 bed is required').max(10),
  guestCount: z.number().min(1, 'At least 1 guest capacity').max(20),
  bathroomCount: z.number().min(1, 'At least 1 bathroom is required').max(5),
  kingBed: z.number().min(0).max(5),
  queenBed: z.number().min(0).max(5),
  breakfastPrice: z.number().min(0, 'Breakfast price cannot be negative'),
  roomPrice: z.number().min(1, 'Room price must be greater than 0'),
  roomService: z.boolean(),
  tv: z.boolean(),
  balcony: z.boolean(),
  freeWifi: z.boolean(),
  cityView: z.boolean(),
  oceanView: z.boolean(),
  forestView: z.boolean(),
  mountainView: z.boolean(),
  airCondition: z.boolean(),
  soundProofed: z.boolean(),
});

export const bookingSchema = z.object({
  roomId: z.string().min(1, 'Room selection is required'),
  hotelId: z.string().min(1, 'Hotel ID is required'),
  startDate: z.string().min(1, 'Check-in date is required'),
  endDate: z.string().min(1, 'Check-out date is required'),
  breakfastIncluded: z.boolean(),
  totalPrice: z.number().min(1, 'Total price must be greater than 0'),
  currency: z.string().default('USD'),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'Check-out date must be after check-in date',
  path: ['endDate'],
});