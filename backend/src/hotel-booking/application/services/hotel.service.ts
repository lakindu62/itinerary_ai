import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { Hotel } from '../../domain/entities/hotel.entity';
import { HotelRepository } from '../../domain/repositories/hotel.repository';
import { CreateHotelDto } from '../dtos/create-hotel.dto';
import { UpdateHotelDto } from '../dtos/update-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @Inject('HotelRepository')
    private readonly hotelRepository: HotelRepository
  ) {}

  async createHotel(userId: string, createHotelDto: CreateHotelDto): Promise<Hotel> {
    try {
      const hotel = Hotel.create({
        userId,
        ...createHotelDto,
      });
      return await this.hotelRepository.create(hotel);
    } catch (error) {
      throw new BadRequestException('Failed to create hotel: ' + error.message);
    }
  }

  async findHotelById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findById(id);
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async findAllHotels(filters?: {
    city?: string;
    state?: string;
    country?: string;
    amenities?: string[];
  }): Promise<Hotel[]> {
    return await this.hotelRepository.findAll(filters);
  }

  async findHotelsByUser(userId: string): Promise<Hotel[]> {
    return await this.hotelRepository.findByUserId(userId);
  }

  async updateHotel(id: string, userId: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const existingHotel = await this.findHotelById(id);
    
    if (existingHotel.userId !== userId) {
      throw new ForbiddenException('You can only update your own hotels');
    }

    const updatedHotel = existingHotel.updateDetails(updateHotelDto);
    return await this.hotelRepository.update(updatedHotel);
  }

  async deleteHotel(id: string, userId: string): Promise<void> {
    const existingHotel = await this.findHotelById(id);
    
    if (existingHotel.userId !== userId) {
      throw new ForbiddenException('You can only delete your own hotels');
    }

    await this.hotelRepository.delete(id);
  }

  async findHotelsByLocation(city: string, state?: string, country?: string): Promise<Hotel[]> {
    return await this.hotelRepository.findByLocation(city, state, country);
  }
}