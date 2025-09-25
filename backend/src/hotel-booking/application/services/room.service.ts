import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { Room } from '../../domain/entities/room.entity';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { HotelRepository } from '../../domain/repositories/hotel.repository';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { UpdateRoomDto } from '../dtos/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('HotelRepository')
    private readonly hotelRepository: HotelRepository,
  ) {}

  async createRoom(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    // Verify hotel ownership
    const hotel = await this.hotelRepository.findById(createRoomDto.hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.userId !== userId) {
      throw new ForbiddenException('You can only add rooms to your own hotels');
    }

    try {
      const room = Room.create(createRoomDto);
      return await this.roomRepository.create(room);
    } catch (error) {
      throw new BadRequestException('Failed to create room: ' + error.message);
    }
  }

  async findRoomById(id: string): Promise<Room> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async findRoomsByHotel(hotelId: string): Promise<Room[]> {
    return await this.roomRepository.findByHotelId(hotelId);
  }

  async findAvailableRooms(hotelId: string, startDate: Date, endDate: Date): Promise<Room[]> {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    return await this.roomRepository.findAvailableRooms(hotelId, startDate, endDate);
  }

  async updateRoom(id: string, userId: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const existingRoom = await this.findRoomById(id);
    
    // Verify hotel ownership
    const hotel = await this.hotelRepository.findById(existingRoom.hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.userId !== userId) {
      throw new ForbiddenException('You can only update rooms in your own hotels');
    }

    const updatedRoom = existingRoom.updateDetails(updateRoomDto);
    return await this.roomRepository.update(updatedRoom);
  }

  async deleteRoom(id: string, userId: string): Promise<void> {
    const existingRoom = await this.findRoomById(id);
    
    // Verify hotel ownership
    const hotel = await this.hotelRepository.findById(existingRoom.hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.userId !== userId) {
      throw new ForbiddenException('You can only delete rooms in your own hotels');
    }

    await this.roomRepository.delete(id);
  }
}