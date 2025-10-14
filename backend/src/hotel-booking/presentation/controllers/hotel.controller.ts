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
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { HotelService } from '../../application/services/hotel.service';
import { CreateHotelDto } from '../../application/dtos/create-hotel.dto';
import { UpdateHotelDto } from '../../application/dtos/update-hotel.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from '@shared/types/user-management';
import { Request } from 'express';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHotel(
    @Req() req: Request,
    @Body() createHotelDto: CreateHotelDto,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const hotel = await this.hotelService.createHotel(req.user.business_account_id, createHotelDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hotel created successfully',
      data: hotel,
    };
  }

  @Get()
  async findAllHotels(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ) {
    const filters = {
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
    };

    const hotels = await this.hotelService.findAllHotels(filters);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Get('my-hotels')
  async findMyHotels(@Req() req: Request) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const hotels = await this.hotelService.findHotelsByBusiness(req.user.business_account_id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
    };
  }

  @Get('search/location')
  async findHotelsByLocation(
    @Query('city') city: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ) {
    const hotels = await this.hotelService.findHotelsByLocation(city, state, country);
    return {
      statusCode: HttpStatus.OK,
      message: `Hotels in ${city} retrieved successfully`,
      data: hotels,
      count: hotels.length,
    };
  }

  @Get(':id')
  async findHotelById(@Param('id') id: string) {
    const hotel = await this.hotelService.findHotelById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel found',
      data: hotel,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Put(':id')
  async updateHotel(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const hotel = await this.hotelService.updateHotel(id, req.user.business_account_id, updateHotelDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel updated successfully',
      data: hotel,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHotel(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    await this.hotelService.deleteHotel(id, req.user.business_account_id);
  }
}