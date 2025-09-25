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
import { RoomService } from '../../application/services/room.service';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Headers('x-user-id') userId?: string,  // Optional parameter comes last   
  ) {
    const actualUserId = userId || 'test-user-123';  // Use default if not provided
    const room = await this.roomService.createRoom(actualUserId, createRoomDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Room created successfully',
      data: room,
    };
  }

  @Get('hotel/:hotelId')
  async findRoomsByHotel(@Param('hotelId') hotelId: string) {
    const rooms = await this.roomService.findRoomsByHotel(hotelId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rooms retrieved successfully',
      data: rooms,
      count: rooms.length,
    };
  }

  @Get('available/:hotelId')
  async findAvailableRooms(
    @Param('hotelId') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const rooms = await this.roomService.findAvailableRooms(hotelId, start, end);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available rooms retrieved successfully',
      data: rooms,
      count: rooms.length,
    };
  }

  @Get(':id')
  async findRoomById(@Param('id') id: string) {
    const room = await this.roomService.findRoomById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room found',
      data: room,
    };
  }

  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Headers('x-user-id') userId?: string,  // Optional parameter comes last
  ) {
    const actualUserId = userId || 'test-user-123';  // Use default if not provided
    const room = await this.roomService.updateRoom(id, actualUserId, updateRoomDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room updated successfully',
      data: room,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,  // Optional parameter comes last
  ) {
    const actualUserId = userId || 'test-user-123';  // Use default if not provided
    await this.roomService.deleteRoom(id, actualUserId);
  }
}