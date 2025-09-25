import { Hotel } from '../entities/hotel.entity';

export interface HotelRepository {
  create(hotel: Hotel): Promise<Hotel>;
  findById(id: string): Promise<Hotel | null>;
  findByUserId(userId: string): Promise<Hotel[]>;
  findAll(filters?: {
    city?: string;
    state?: string;
    country?: string;
    amenities?: string[];
  }): Promise<Hotel[]>;
  update(hotel: Hotel): Promise<Hotel>;
  delete(id: string): Promise<void>;
  findByLocation(city: string, state?: string, country?: string): Promise<Hotel[]>;
}