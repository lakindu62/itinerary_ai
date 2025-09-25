import { Booking } from '../entities/booking.entity';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByHotelOwnerId(hotelOwnerId: string): Promise<Booking[]>;
  findByRoomId(roomId: string): Promise<Booking[]>;
  update(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<void>;
  findConflictingBookings(roomId: string, startDate: Date, endDate: Date): Promise<Booking[]>;
}