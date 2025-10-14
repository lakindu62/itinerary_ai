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
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from '../../application/services/booking.service';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { UpdateBookingStatusDto } from '../../application/dtos/update-booking-status.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { AuthenticatedUser, UserRole } from '@shared/types/user-management';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Request } from 'express';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(
    @Req() req: Request,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const booking = await this.bookingService.createBooking(req.user, createBookingDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Get('my-bookings')
  async findMyBookings(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const bookings = await this.bookingService.findMyBookings(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Get('hotel-bookings')
  async findHotelBookings(@Req() req: Request) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const bookings = await this.bookingService.findHotelBookings(req.user.business_account_id);
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

  @UseGuards(ClerkAuthGuard)
  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const booking = await this.bookingService.updateBookingStatus(id, req.user, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking status updated successfully',
      data: booking,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelBooking(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    await this.bookingService.cancelBooking(id, req.user);
  }
}