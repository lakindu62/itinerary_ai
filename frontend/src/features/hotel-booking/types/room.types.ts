export interface Room {
  id: string;
  title: string;
  description: string;
  bedCount: number;
  guestCount: number;
  bathroomCount: number;
  kingBed: number;
  queenBed: number;
  image: string;
  breakfastPrice: number;
  roomPrice: number;
  roomService: boolean;
  tv: boolean;
  balcony: boolean;
  freeWifi: boolean;
  cityView: boolean;
  oceanView: boolean;
  forestView: boolean;
  mountainView: boolean;
  airCondition: boolean;
  soundProofed: boolean;
  hotelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAvailability {
  roomId: string;
  available: boolean;
  // conflictingBookings?: Booking[];
}