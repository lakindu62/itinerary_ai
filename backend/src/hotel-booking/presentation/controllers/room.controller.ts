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
import { RoomService } from '../../application/services/room.service';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';
import { ClerkAuthGuard } from '../../../shared/guards/clerk-auth-guard';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    const room = await this.roomService.createRoom(createRoomDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Room created successfully',
      data: room,
    };
  }

  @Put(':id')
  @UseGuards(ClerkAuthGuard)
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    const room = await this.roomService.updateRoom(id, userId, updateRoomDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room updated successfully',
      data: room,
    };
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in authentication token');
    }
    await this.roomService.deleteRoom(id, userId);
  }

  // Publicly accessible endpoints
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
  async findOne(@Param('id') id: string) {
    return this.roomService.findRoomById(id);
  }
}
