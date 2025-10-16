// backend/src/itinerary/application/ports/hotel-read-port.ts

export interface HotelSummary {
  id: string;
  name: string;
  description?: string;
  address: string;
  imageUrl?: string;
  city?: string;
  coordinates: [number, number];
  rating?: number;
  pricePerNight?: number;
  amenities?: string[];
}

export const HOTEL_READ_PORT = 'HOTEL_READ_PORT';

export interface HotelReadPort {
  getHotels(): Promise<HotelSummary[]>;
  getHotelsByDestination(destination: string): Promise<HotelSummary[]>;
}
