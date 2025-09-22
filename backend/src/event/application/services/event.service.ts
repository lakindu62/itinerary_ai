import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventVenueRepository } from '../../domain/repositories/event-venue.repository';
import { EventOrganizerRepository } from '../../domain/repositories/event-organizer.repository';
import { EventCategoryRepository } from '../../domain/repositories/event-category.repository';
import { EventRsvpRepository } from '../../domain/repositories/event-rsvp.repository';
import { EventRsvp } from '../../domain/entities/event-rsvp.entity';
import { CreateEventRsvpDto } from '../dtos/create-event-rsvp.dto';
import { EventHashtagRepository } from '../../domain/repositories/event-hashtag.repository';
import { EventHashtag } from '../../domain/entities/event-hashtag.entity';
import { CreateEventHashtagDto } from '../dtos/create-event-hashtag.dto';
import { EventHashtagMappingRepository } from '../../domain/repositories/event-hashtag-mapping.repository';
import { EventHashtagMapping } from '../../domain/entities/event-hashtag-mapping.entity';
import { CreateEventHashtagMappingDto } from '../dtos/create-event-hashtag-mapping.dto';
import { CreateEventCategoryDto } from '../dtos/create-event-category.dto';
import { CreateEventOrganizerDto } from '../dtos/create-event-organizer.dto';
import { CreateEventVenueDto } from '../dtos/create-event-venue.dto';
import { EventCategory } from '../../domain/entities/event-category.entity';
import { EventOrganizer } from '../../domain/entities/event-organizer.entity';
import { EventVenue } from '../../domain/entities/event-venue.entity';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { UpdateEventVenueDto } from '../dtos/update-event-venue.dto';
import { UpdateEventOrganizerDto } from '../dtos/update-event-organizer.dto';
import { UpdateEventCategoryDto } from '../dtos/update-event-category.dto';
import { UpdateEventHashtagDto } from '../dtos/update-event-hashtag.dto';
import { UpdateEventRsvpDto } from '../dtos/update-event-rsvp.dto';


@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventVenueRepository: EventVenueRepository,
    private readonly eventOrganizerRepository: EventOrganizerRepository,
    private readonly eventCategoryRepository: EventCategoryRepository,
    private readonly eventRsvpRepository: EventRsvpRepository,
    private readonly eventHashtagRepository: EventHashtagRepository,
    private readonly eventHashtagMappingRepository: EventHashtagMappingRepository,
  ) {}

  async create(createDto: CreateEventDto): Promise<Event> {
    const venue = await this.eventVenueRepository.findById(createDto.venueId);
    const organizer = await this.eventOrganizerRepository.findById(
      createDto.organizerId,
    );
    const category = await this.eventCategoryRepository.findById(
      createDto.categoryId,
    );

    // if (!venue || !organizer || !category) {
    //   throw new Error('Venue, Organizer or Category not found');
    // }

    const event = new Event(
      null,
      createDto.eventName,
      createDto.description || '',
      createDto.startDate,
      createDto.endDate || createDto.startDate,
      createDto.startTime || '',
      createDto.endTime || '',
      createDto.maxAttendees || 0,
      createDto.ticketPrice || 0,
      createDto.eventStatus || 'active',
      createDto.imagesUrl || [],
      venue,
      organizer,
      category,
    );

    return await this.eventRepository.create(event);
  }

  //find event by id
  async findById(id: string): Promise<Event | null> {
    return await this.eventRepository.findById(id);
  }

  //find the venue by id
  async getVenueById(id: string): Promise<EventVenue | null> {
    return await this.eventVenueRepository.findById(id);
  }

  //find the organizer by id
  async getOrganizerById(id: string): Promise<EventOrganizer | null> {
    return await this.eventOrganizerRepository.findById(id);
  }
  
  //find the category by id
  async getCategoryById(id: string): Promise<EventCategory | null> {
    return await this.eventCategoryRepository.findById(id);
  }
  //find the rsvp by id
  async getRsvpById(id: string): Promise<EventRsvp | null> {
    return await this.eventRsvpRepository.findById(id);
  }

  //find the hashtag by id
  async getHashtagById(id: string): Promise<EventHashtag | null> {
    return await this.eventHashtagRepository.findById(id);
  }

 




  //create

  async createRsvp(createRsvpDto: CreateEventRsvpDto): Promise<EventRsvp> {
    const event = await this.eventRepository.findById(createRsvpDto.eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    const eventRsvp = new EventRsvp(
      null,
      event,
      createRsvpDto.userId,
      createRsvpDto.rsvpStatus,
      createRsvpDto.guestCount,
    );

    return await this.eventRsvpRepository.create(eventRsvp);
  }

  async createHashtag(
    createHashtagDto: CreateEventHashtagDto,
  ): Promise<EventHashtag> {
    const eventHashtag = new EventHashtag(
      null,
      createHashtagDto.hashtagName,
    );

    return await this.eventHashtagRepository.create(eventHashtag);
  }

  async mapHashtagToEvent(
    createEventHashtagMappingDto: CreateEventHashtagMappingDto,
  ): Promise<EventHashtagMapping> {
    const event = await this.eventRepository.findById(
      createEventHashtagMappingDto.eventId,
    );
    const hashtag = await this.eventHashtagRepository.findById(
      createEventHashtagMappingDto.hashtagId,
    );

    if (!event || !hashtag) {
      throw new Error('Event or Hashtag not found');
    }

    const eventHashtagMapping = new EventHashtagMapping(
      event,
      hashtag,
    );

    return await this.eventHashtagMappingRepository.create(eventHashtagMapping);
  }

  async createCategory(
    createDto: CreateEventCategoryDto,
  ): Promise<EventCategory> {
    const category = new EventCategory(
      null,
      createDto.categoryName,
      createDto.description,
    );
    return await this.eventCategoryRepository.create(category);
  }

  async createOrganizer(
    createDto: CreateEventOrganizerDto,
  ): Promise<EventOrganizer> {
    const organizer = new EventOrganizer(
      null,
      createDto.organizerName,
      createDto.contactEmail,
      createDto.contactPhone,
      createDto.organization,
    );
    return await this.eventOrganizerRepository.create(organizer);
  }

  async createVenue(createDto: CreateEventVenueDto): Promise<EventVenue> {
    const venue = new EventVenue(
      null,
      createDto.venueName,
      createDto.address,
      createDto.city,
      createDto.province,
      createDto.postalCode,
      createDto.country,
      createDto.capacity,
      createDto.facilities,
    );
    return await this.eventVenueRepository.create(venue);
  }







  //update

  //update event by id
  async update(id: string, updateDto: UpdateEventDto): Promise<Event | null> {
    const existingEvent = await this.eventRepository.findById(id);

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingEvent, updateDto);

    return await this.eventRepository.update (existingEvent);
  }

  //update venue by id
  async updateVenue(id: string, updateDto: UpdateEventVenueDto): Promise<EventVenue | null> {
    const existingVenue = await this.eventVenueRepository.findById(id);

    if (!existingVenue) {
      throw new NotFoundException(`Event Venue with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingVenue, updateDto);

    return await this.eventVenueRepository.update(existingVenue);
  }

  //update organizer by id
  async updateOrganizer(id: string, updateDto: UpdateEventOrganizerDto): Promise<EventOrganizer | null> {
    const existingOrganizer = await this.eventOrganizerRepository.findById(id);

    if (!existingOrganizer) {
      throw new NotFoundException(`Event Organizer with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingOrganizer, updateDto);

    return await this.eventOrganizerRepository.update(existingOrganizer);
  }

  //update category by id
  async updateCategory(id: string, updateDto: UpdateEventCategoryDto): Promise<EventCategory | null> {
    const existingCategory = await this.eventCategoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundException(`Event Category with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingCategory, updateDto);

    return await this.eventCategoryRepository.update(existingCategory);
  }


  //update hashtag by id
  async updateHashtag(id: string, updateDto: UpdateEventHashtagDto): Promise<EventHashtag | null> {
    const existingHashtag = await this.eventHashtagRepository.findById(id);

    if (!existingHashtag) {
      throw new NotFoundException(`Event Hashtag with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingHashtag, updateDto);

    return await this.eventHashtagRepository.update(existingHashtag);
  }

  //update rsvp by id
  async updateRsvp(id: string, updateDto: UpdateEventRsvpDto): Promise<EventRsvp | null> {
    const existingRsvp = await this.eventRsvpRepository.findById(id);

    if (!existingRsvp) {
      throw new NotFoundException(`Event Rsvp with ID ${id} not found`);
    }

    // Apply updates from DTO to the existing domain entity
    Object.assign(existingRsvp, updateDto);

    return await this.eventRsvpRepository.update(existingRsvp);
  }





//delete

  //delete event by id
 async delete(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventRepository.delete(id);
  }

  async deleteHashtag(id: string): Promise<void> {
    const hashtag = await this.eventHashtagRepository.findById(id);
    if (!hashtag) {
      throw new NotFoundException(`Event Hashtag with ID ${id} not found`);
    }
    await this.eventHashtagRepository.delete(id);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.eventCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Event Category with ID ${id} not found`);
    }
    await this.eventCategoryRepository.delete(id);
  }

  async deleteOrganizer(id: string): Promise<void> {
    const organizer = await this.eventOrganizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Event Organizer with ID ${id} not found`);
    }
    await this.eventOrganizerRepository.delete(id);
  }

  async deleteVenue(id: string): Promise<void> {
    const venue = await this.eventVenueRepository.findById(id);
    if (!venue) {
      throw new NotFoundException(`Event Venue with ID ${id} not found`);
    }
    await this.eventVenueRepository.delete(id);
  }

  async deleteRsvp(id: string): Promise<void> {
    const rsvp = await this.eventRsvpRepository.findById(id);
    if (!rsvp) {
      throw new NotFoundException(`Event Rsvp with ID ${id} not found`);
    }
    await this.eventRsvpRepository.delete(id);
  }

}
