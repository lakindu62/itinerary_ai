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
} from '@nestjs/common';
import { HotelService } from '../../application/services/hotel.service';
import { CreateHotelDto } from '../../application/dtos/create-hotel.dto';
import { UpdateHotelDto } from '../../application/dtos/update-hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHotel(
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() createHotelDto: CreateHotelDto,
  ) {
    const hotel = await this.hotelService.createHotel(userId, createHotelDto);
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

  @Get('my-hotels')
  async findMyHotels(@Headers('x-user-id') userId: string = 'test-user-123') {
    const hotels = await this.hotelService.findHotelsByUser(userId);
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

  @Put(':id')
  async updateHotel(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    const hotel = await this.hotelService.updateHotel(id, userId, updateHotelDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel updated successfully',
      data: hotel,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHotel(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
  ) {
    await this.hotelService.deleteHotel(id, userId);
  }
}