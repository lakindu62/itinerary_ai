export interface Room {
  id: string;
  title: string;
  description: string;
  bedCount: number;
  guestCount: number;
  bathroomCount: number;
  kingBed: number;
  queenBed: number;
  image?: string;
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
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomRequest {
  title: string;
  description: string;
  bedCount: number;
  guestCount: number;
  bathroomCount: number;
  kingBed: number;
  queenBed: number;
  image?: string; // Added image property
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
  userId?: string;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  image?: string; // Added image property for updates
}

export interface RoomWithBookings extends Room {
  bookings?: {
    id: string;
    startDate: string;
    endDate: string;
    guestCount: number;
  }[];
  isAvailable?: boolean;
  nextAvailableDate?: string;
}