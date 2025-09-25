import { Room } from '../entities/room.entity';

export interface RoomRepository {
  create(room: Room): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findByHotelId(hotelId: string): Promise<Room[]>;
  findAvailableRooms(hotelId: string, startDate: Date, endDate: Date): Promise<Room[]>;
  update(room: Room): Promise<Room>;
  delete(id: string): Promise<void>;
  findByCapacity(guestCount: number, hotelId?: string): Promise<Room[]>;
}