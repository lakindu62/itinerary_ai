import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { BookingService } from '../../application/services/booking.service';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { UpdateBookingStatusDto } from '../../application/dtos/update-booking-status.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const booking = await this.bookingService.createBooking(userId, createBookingDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  @Get('my-bookings')
  async findMyBookings(@Headers('x-user-id') userId: string = 'test-user-123') {
    const bookings = await this.bookingService.findMyBookings(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('hotel-bookings')
  async findHotelBookings(@Headers('x-user-id') hotelOwnerId: string = 'test-user-123') {
    const bookings = await this.bookingService.findHotelBookings(hotelOwnerId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('room/:roomId')
  async findRoomBookings(@Param('roomId') roomId: string) {
    const bookings = await this.bookingService.findRoomBookings(roomId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('check-availability/:roomId')
  async checkRoomAvailability(
    @Param('roomId') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const isAvailable = await this.bookingService.checkRoomAvailability(roomId, start, end);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room availability checked',
      data: { available: isAvailable },
    };
  }

  @Get(':id')
  async findBookingById(@Param('id') id: string) {
    const booking = await this.bookingService.findBookingById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking found',
      data: booking,
    };
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    const booking = await this.bookingService.updateBookingStatus(id, userId, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking status updated successfully',
      data: booking,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelBooking(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
  ) {
    await this.bookingService.cancelBooking(id, userId);
  }
}