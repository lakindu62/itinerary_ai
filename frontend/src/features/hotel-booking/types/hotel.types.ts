export interface Hotel {
  id: string;
  title: string;
  description: string;
  image?: string;
  country: string;
  state: string;
  city: string;
  locationDescription?: string; // Made optional
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHotelRequest {
  userId?: string;
  title: string;
  description: string;
  image?: string;
  country: string;
  state: string;
  city: string;
  locationDescription?: string; // Made optional to match form
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  image?: string;
}

export interface HotelWithRooms extends Hotel {
  rooms?: {
    id: string;
    title: string;
    roomPrice: number;
    image?: string;
  }[];
  totalRooms?: number;
  availableRooms?: number;
}