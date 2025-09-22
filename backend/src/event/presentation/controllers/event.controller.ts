import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EventService } from '../../application/services/event.service';
import { CreateEventDto } from '../../application/dtos/create-event.dto';
import { CreateEventRsvpDto } from '../../application/dtos/create-event-rsvp.dto';
import { CreateEventHashtagDto } from '../../application/dtos/create-event-hashtag.dto';
import { CreateEventHashtagMappingDto } from '../../application/dtos/create-event-hashtag-mapping.dto';
import { CreateEventCategoryDto } from '../../application/dtos/create-event-category.dto';
import { CreateEventOrganizerDto } from '../../application/dtos/create-event-organizer.dto';
import { CreateEventVenueDto } from '../../application/dtos/create-event-venue.dto';

import { UpdateEventDto } from '../../application/dtos/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createDto: CreateEventDto) {
    return await this.eventService.create(createDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.eventService.findById(id);
  }

  @Post('rsvp')
  async createRsvp(@Body() createRsvpDto: CreateEventRsvpDto) {
    return await this.eventService.createRsvp(createRsvpDto);
  }

  @Post('hashtag')
  async createHashtag(@Body() createHashtagDto: CreateEventHashtagDto) {
    return await this.eventService.createHashtag(createHashtagDto);
  }

  @Post('hashtag/map')
  async mapHashtagToEvent(
    @Body() createEventHashtagMappingDto: CreateEventHashtagMappingDto,
  ) {
    return await this.eventService.mapHashtagToEvent(
      createEventHashtagMappingDto,
    );
  }

  @Post('category')
  async createCategory(@Body() createDto: CreateEventCategoryDto) {
    return await this.eventService.createCategory(createDto);
  }

  @Post('organizer')
  async createOrganizer(@Body() createDto: CreateEventOrganizerDto) {
    return await this.eventService.createOrganizer(createDto);
  }

  @Post('venue')
  async createVenue(@Body() createDto: CreateEventVenueDto) {
    return await this.eventService.createVenue(createDto);
  }

  //get venue by id
  @Get('venue/:id')
  async getVenueById(@Param('id') id: string) {
    return await this.eventService.getVenueById(id);
  }

  //get category by id
  @Get('category/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.eventService.getCategoryById(id);
  }
  //get organizer by id
  @Get('organizer/:id')
  async getOrganizerById(@Param('id') id: string) {
    return await this.eventService.getOrganizerById(id);
  }

  //get rsvp by id
  @Get('rsvp/:id')
  async getRsvpById(@Param('id') id: string) {
    return await this.eventService.getRsvpById(id);
  }

  //get hashtag by id
  @Get('hashtag/:id')
  async getHashtagById(@Param('id') id: string) {
    return await this.eventService.getHashtagById(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateDto: UpdateEventDto) {
  //   return await this.eventService.update(id, updateDto);
  // }

}