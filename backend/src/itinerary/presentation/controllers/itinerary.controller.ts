import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ItineraryService } from 'src/itinerary/application/services/itinerary.service';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  async create(@Body() createDto: CreateItineraryDto) {
    return await this.itineraryService.create(createDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.itineraryService.findById(id);
  }
}
