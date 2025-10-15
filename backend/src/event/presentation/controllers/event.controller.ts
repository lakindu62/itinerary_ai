import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EventService } from '../../application/services/event.service';
import {
  CreateEventDto,
  UpdateEventDto,
} from '../../application/dtos/create-event.dto';
import {
  CreateEventRsvpDto,
  UpdateEventRsvpDto,
} from '../../application/dtos/create-event-rsvp.dto';
import {
  CreateEventHashtagDto,
  UpdateEventHashtagDto,
} from '../../application/dtos/create-event-hashtag.dto';
import {
  CreateEventCategoryDto,
  UpdateEventCategoryDto,
} from '../../application/dtos/create-event-category.dto';
import {
  CreateEventOrganizerDto,
  UpdateEventOrganizerDto,
} from '../../application/dtos/create-event-organizer.dto';
import {
  CreateEventVenueDto,
  UpdateEventVenueDto,
} from '../../application/dtos/create-event-venue.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { AuthenticatedUser } from '@shared/types/user-management';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // ================= PUBLIC ROUTES =================
  @Get('all')
  findAllPublic() {
    return this.eventService.getAllEventsPublic();
  }

  @Get(':id/public')
  findEventByIdPublic(@Param('id') id: string) {
    return this.eventService.getEventByIdPublic(id);
  }

  // ================= BUSINESS-SCOPED ROUTES =================

  // --- Hashtag Mapping (Specific route, must be before generic :id) ---
  @UseGuards(ClerkAuthGuard)
  @Get('/hashtag-mapping')
  getEventHashtagMappings(
    @Query('eventId') eventId: string,
    @Req() req: Request,
  ) {
    return this.eventService.getEventHashtagMappings(
      eventId,
      req.user as AuthenticatedUser,
    );
  }

  // --- Full Event CRUD ---
  @UseGuards(ClerkAuthGuard)
  @Post()
  createEvent(@Body() createDto: CreateEventDto, @Req() req: Request) {
    return this.eventService.createEvent(
      createDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Get()
  getAllEvents(@Req() req: Request) {
    return this.eventService.getAllEvents(req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':id') // Generic :id route comes AFTER more specific ones
  findEventById(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.findEventById(id, req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    return this.eventService.updateEvent(
      id,
      updateDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.deleteEvent(id, req.user as AuthenticatedUser);
  }

  // --- Venue CRUD ---
  @UseGuards(ClerkAuthGuard)
  @Post('venue')
  createVenue(@Body() createDto: CreateEventVenueDto, @Req() req: Request) {
    return this.eventService.createVenue(
      createDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Get('venue/all')
  getVenues(@Req() req: Request) {
    return this.eventService.getVenues(req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('venue/:id')
  getVenueById(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.getVenueById(id, req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('venue/:id')
  updateVenue(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventVenueDto,
    @Req() req: Request,
  ) {
    return this.eventService.updateVenue(
      id,
      updateDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Delete('venue/:id')
  deleteVenue(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.deleteVenue(id, req.user as AuthenticatedUser);
  }

  // --- Organizer CRUD ---
  @UseGuards(ClerkAuthGuard)
  @Post('organizer')
  createOrganizer(
    @Body() createDto: CreateEventOrganizerDto,
    @Req() req: Request,
  ) {
    return this.eventService.createOrganizer(
      createDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Get('organizer/all')
  getOrganizers(@Req() req: Request) {
    return this.eventService.getOrganizers(req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('organizer/:id')
  getOrganizerById(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.getOrganizerById(
      id,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('organizer/:id')
  updateOrganizer(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventOrganizerDto,
    @Req() req: Request,
  ) {
    return this.eventService.updateOrganizer(
      id,
      updateDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Delete('organizer/:id')
  deleteOrganizer(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.deleteOrganizer(id, req.user as AuthenticatedUser);
  }

  // --- Category CRUD ---
  @UseGuards(ClerkAuthGuard)
  @Post('category')
  createCategory(
    @Body() createDto: CreateEventCategoryDto,
    @Req() req: Request,
  ) {
    return this.eventService.createCategory(
      createDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Get('category/all')
  getCategories(@Req() req: Request) {
    return this.eventService.getCategories(req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('category/:id')
  getCategoryById(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.getCategoryById(id, req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventCategoryDto,
    @Req() req: Request,
  ) {
    return this.eventService.updateCategory(
      id,
      updateDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Delete('category/:id')
  deleteCategory(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.deleteCategory(id, req.user as AuthenticatedUser);
  }

  // --- RSVP (Traveler and Business) ---
  @UseGuards(ClerkAuthGuard)
  @Post('rsvp')
  createRsvp(@Body() createRsvpDto: CreateEventRsvpDto, @Req() req: Request) {
    return this.eventService.createRsvp(
      createRsvpDto,
      req.user as AuthenticatedUser,
    );
  }

  @UseGuards(ClerkAuthGuard)
  @Get('rsvp/all')
  getRsvps(@Req() req: Request) {
    return this.eventService.getRsvps(req.user as AuthenticatedUser);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete('rsvp/:id')
  deleteRsvp(@Param('id') id: string, @Req() req: Request) {
    return this.eventService.deleteRsvp(id, req.user as AuthenticatedUser);
  }

  // --- Hashtag (Global) ---
  @Get('hashtag/all')
  getAllHashtags() {
    return this.eventService.getHashtags();
  }

  @Post('hashtag')
  createHashtag(@Body() createHashtagDto: CreateEventHashtagDto) {
    return this.eventService.createHashtag(createHashtagDto);
  }

  @Get('hashtag/:id')
  getHashtagById(@Param('id') id: string) {
    return this.eventService.getHashtagById(id);
  }

  @Patch('hashtag/:id')
  updateHashtag(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventHashtagDto,
  ) {
    return this.eventService.updateHashtag(id, updateDto);
  }

  @Delete('hashtag/:id')
  deleteHashtag(@Param('id') id: string) {
    return this.eventService.deleteHashtag(id);
  }
}
