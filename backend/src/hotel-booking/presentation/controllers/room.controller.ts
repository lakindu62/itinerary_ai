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
import { RoomService } from '../../application/services/room.service';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from '@shared/types/user-management';
import { Request } from 'express';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Req() req: Request,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const room = await this.roomService.createRoom(req.user.business_account_id, createRoomDto);
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

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    const room = await this.roomService.updateRoom(id, req.user.business_account_id, updateRoomDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room updated successfully',
      data: room,
    };
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.BUSINESS_OWNER])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    if (!req.user?.business_account_id) {
      throw new UnauthorizedException('User is not a business owner');
    }
    await this.roomService.deleteRoom(id, req.user.business_account_id);
  }
}