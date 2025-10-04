import { Controller, Post, Get, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { EventService } from '../../application/services/event.service';
import { CreateEventDto } from '../../application/dtos/create-event.dto';
import { CreateEventRsvpDto } from '../../application/dtos/create-event-rsvp.dto';
import { CreateEventHashtagDto } from '../../application/dtos/create-event-hashtag.dto';
import { CreateEventHashtagMappingDto } from '../../application/dtos/create-event-hashtag-mapping.dto';
import { CreateEventCategoryDto } from '../../application/dtos/create-event-category.dto';
import { CreateEventOrganizerDto } from '../../application/dtos/create-event-organizer.dto';
import { CreateEventVenueDto } from '../../application/dtos/create-event-venue.dto';

import { UpdateEventDto } from '../../application/dtos/update-event.dto';
import { UpdateEventVenueDto } from 'src/event/application/dtos/update-event-venue.dto';
import { UpdateEventOrganizerDto } from 'src/event/application/dtos/update-event-organizer.dto';
import { UpdateEventCategoryDto } from 'src/event/application/dtos/update-event-category.dto';
import { UpdateEventHashtagDto } from 'src/event/application/dtos/update-event-hashtag.dto';
import { UpdateEventRsvpDto } from 'src/event/application/dtos/update-event-rsvp.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createDto: CreateEventDto) {
    return await this.eventService.create(createDto);
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




  // Add this route to get all venues
@Get('venue')
async getVenues() {
  return await this.eventService.getVenues();
}

@Get('organizer')
async getOrganizers() {
  return await this.eventService.getOrganizers();
}

@Get('category')
async getCategories() {
  return await this.eventService.getCategories();
}

@Get('rsvp')
async getRsvps() {
  return await this.eventService.getRsvps();
}

 @Get('hashtag')
async getAllHashtags() {
  return await this.eventService.getHashtags();
}

  @Get('allEvents')
  async getAllEvents() {
    return await this.eventService.getAllEvents();
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
  
  // Hashtag mapping routes
  // GET /api/events/hashtag-mapping?eventId=123
  @Get('hashtag-mapping')
  async getEventHashtagMappings(@Query('eventId') eventId: string) {
    return await this.eventService.getEventHashtagMappings(eventId);
  }

  //get event by id
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.eventService.findById(id);
  }




  //update
  @Patch('venue/:id')
  async updateVenue(@Param('id') id: string, @Body() updateDto: UpdateEventVenueDto) {
    return await this.eventService.updateVenue(id, updateDto);
  }

  @Patch('organizer/:id')
  async updateOrganizer(@Param('id') id: string, @Body() updateDto: UpdateEventOrganizerDto) {
    return await this.eventService.updateOrganizer(id, updateDto);
  }

  @Patch('category/:id')
  async updateCategory(@Param('id') id: string, @Body() updateDto: UpdateEventCategoryDto) {
    return await this.eventService.updateCategory(id, updateDto);
  }

  @Patch('hashtag/:id')
  async updateHashtag(@Param('id') id: string, @Body() updateDto: UpdateEventHashtagDto) {
    return await this.eventService.updateHashtag(id, updateDto);
  }

  @Patch('rsvp/:id')
  async updateRsvp(@Param('id') id: string, @Body() updateDto: UpdateEventRsvpDto) {
    return await this.eventService.updateRsvp(id, updateDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateEventDto) {
    return await this.eventService.update(id, updateDto);
  }



  //delete event by id
  @Delete('hashtag/:id')
  async deleteHashtag(@Param('id') id: string) {
    return await this.eventService.deleteHashtag(id);
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.eventService.deleteCategory(id);
  }

  @Delete('organizer/:id')
  async deleteOrganizer(@Param('id') id: string) {
    return await this.eventService.deleteOrganizer(id);
  }

  @Delete('venue/:id')
  async deleteVenue(@Param('id') id: string) {
    return await this.eventService.deleteVenue(id);
  }

  @Delete('rsvp/:id')
  async deleteRsvp(@Param('id') id: string) {
    return await this.eventService.deleteRsvp(id);
  }

   @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.eventService.delete(id);
  }


}