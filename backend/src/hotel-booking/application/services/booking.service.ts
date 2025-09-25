import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, ConflictException } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { HotelRepository } from '../../domain/repositories/hotel.repository';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { UpdateBookingStatusDto } from '../dtos/update-booking-status.dto';

@Injectable()
export class BookingService {
  constructor(
    @Inject('BookingRepository')
    private readonly bookingRepository: BookingRepository,
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('HotelRepository')
    private readonly hotelRepository: HotelRepository,
  ) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate dates
    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Verify room exists
    const room = await this.roomRepository.findById(createBookingDto.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Verify hotel exists
    const hotel = await this.hotelRepository.findById(createBookingDto.hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // Verify room belongs to hotel
    if (room.hotelId !== createBookingDto.hotelId) {
      throw new BadRequestException('Room does not belong to the specified hotel');
    }

    // Verify hotel owner
    if (hotel.userId !== createBookingDto.hotelOwnerId) {
      throw new BadRequestException('Invalid hotel owner ID');
    }

    // Check for conflicting bookings
    const conflictingBookings = await this.bookingRepository.findConflictingBookings(
      createBookingDto.roomId,
      startDate,
      endDate
    );

    if (conflictingBookings.length > 0) {
      throw new ConflictException('Room is not available for the selected dates');
    }

    try {
      // FIX: Pass the correct object structure to Booking.create()
      const booking = Booking.create({
        userId,
        roomId: createBookingDto.roomId,
        hotelId: createBookingDto.hotelId,
        hotelOwnerId: createBookingDto.hotelOwnerId,
        startDate,
        endDate,
        breakfastIncluded: createBookingDto.breakfastIncluded,
        currency: createBookingDto.currency,
        totalPrice: createBookingDto.totalPrice,
        paymentStatus: false,
      });

      return await this.bookingRepository.create(booking);
    } catch (error) {
      throw new BadRequestException('Failed to create booking: ' + error.message);
    }
  }

  async findBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findMyBookings(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByUserId(userId);
  }

  async findHotelBookings(hotelOwnerId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByHotelOwnerId(hotelOwnerId);
  }

  async findRoomBookings(roomId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByRoomId(roomId);
  }

  async updateBookingStatus(
    id: string,
    userId: string,
    updateDto: UpdateBookingStatusDto
  ): Promise<Booking> {
    const existingBooking = await this.findBookingById(id);
    
    // Only booking owner or hotel owner can update payment status
    if (existingBooking.userId !== userId && existingBooking.hotelOwnerId !== userId) {
      throw new ForbiddenException('You can only update your own bookings or bookings for your hotels');
    }

    const updatedBooking = existingBooking.updatePaymentStatus(
      updateDto.paymentStatus,
      updateDto.paymentIntentId
    );

    return await this.bookingRepository.update(updatedBooking);
  }

  async cancelBooking(id: string, userId: string): Promise<void> {
    const existingBooking = await this.findBookingById(id);
    
    // Only booking owner can cancel
    if (existingBooking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    // Check if booking can be cancelled (e.g., not too close to start date)
    const now = new Date();
    const daysDifference = Math.ceil((existingBooking.startDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference < 1) {
      throw new BadRequestException('Cannot cancel booking less than 24 hours before check-in');
    }

    await this.bookingRepository.delete(id);
  }

  async checkRoomAvailability(roomId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const conflictingBookings = await this.bookingRepository.findConflictingBookings(
      roomId,
      startDate,
      endDate
    );
    return conflictingBookings.length === 0;
  }
}