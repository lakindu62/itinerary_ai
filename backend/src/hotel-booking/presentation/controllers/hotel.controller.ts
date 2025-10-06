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
  BadRequestException,
} from '@nestjs/common';
import { HotelService } from '../../application/services/hotel.service';
import { CreateHotelDto } from '../../application/dtos/create-hotel.dto';
import { UpdateHotelDto } from '../../application/dtos/update-hotel.dto';
import { ClerkAuthGuard } from '../../../shared/guards/clerk-auth-guard';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createHotel(
    @Body() createHotelDto: CreateHotelDto,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    const hotel = await this.hotelService.createHotel(createHotelDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hotel created successfully',
      data: hotel,
    };
  }

  @Get('my-hotels')
  @UseGuards(ClerkAuthGuard)
  async findMyHotels(@Req() req: any) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    const hotels = await this.hotelService.findHotelsByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
    };
  }

  @Put(':id')
  @UseGuards(ClerkAuthGuard)
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    const hotel = await this.hotelService.updateHotel(id, userId, updateHotelDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel updated successfully',
      data: hotel,
    };
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHotel(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    await this.hotelService.deleteHotel(id, userId);
  }

  // Publicly accessible endpoints
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
}
