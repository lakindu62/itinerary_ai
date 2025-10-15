import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthenticatedUser } from '@shared/types/user-management';
import { EventRepository } from '../../domain/repositories/event.repository';
import { EventVenueRepository } from '../../domain/repositories/event-venue.repository';
import { EventOrganizerRepository } from '../../domain/repositories/event-organizer.repository';
import { EventCategoryRepository } from '../../domain/repositories/event-category.repository';
import { EventRsvpRepository } from '../../domain/repositories/event-rsvp.repository';
import { EventHashtagRepository } from '../../domain/repositories/event-hashtag.repository';
import { EventHashtagMappingRepository } from '../../domain/repositories/event-hashtag-mapping.repository';
import { Event } from '../../domain/entities/event.entity';
import { EventVenue } from '../../domain/entities/event-venue.entity';
import { EventOrganizer } from '../../domain/entities/event-organizer.entity';
import { EventCategory } from '../../domain/entities/event-category.entity';
import { EventRsvp } from '../../domain/entities/event-rsvp.entity';
import { EventHashtag } from '../../domain/entities/event-hashtag.entity';
import { EventHashtagMapping } from '../../domain/entities/event-hashtag-mapping.entity';
import { CreateEventDto, UpdateEventDto } from '../dtos/create-event.dto';
import {
  CreateEventVenueDto,
  UpdateEventVenueDto,
} from '../dtos/create-event-venue.dto';
import {
  CreateEventOrganizerDto,
  UpdateEventOrganizerDto,
} from '../dtos/create-event-organizer.dto';
import {
  CreateEventCategoryDto,
  UpdateEventCategoryDto,
} from '../dtos/create-event-category.dto';
import {
  CreateEventRsvpDto,
  UpdateEventRsvpDto,
} from '../dtos/create-event-rsvp.dto';
import {
  CreateEventHashtagDto,
  UpdateEventHashtagDto,
} from '../dtos/create-event-hashtag.dto';
import { CreateEventHashtagMappingDto } from '../dtos/create-event-hashtag-mapping.dto';

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

  private _getBusinessId(user: AuthenticatedUser): string {
    if (!user.business_account_id) {
      throw new UnauthorizedException(
        'User is not associated with a business.',
      );
    }
    return user.business_account_id;
  }

  // =================================================================
  // Public Methods (No Business Scope)
  // =================================================================

  async getAllEventsPublic(): Promise<Event[]> {
    return this.eventRepository.findAllPublic();
  }

  async getEventByIdPublic(id: string): Promise<Event | null> {
    const event = await this.eventRepository.findPublicById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  // =================================================================
  // Business-Scoped Event Methods
  // =================================================================

  async createEvent(
    createDto: CreateEventDto,
    user: AuthenticatedUser,
  ): Promise<Event> {
    const businessAccountId = this._getBusinessId(user);

    const venue = await this.eventVenueRepository.findById(
      createDto.venueId,
      businessAccountId,
    );
    if (!venue)
      throw new NotFoundException(
        `Venue with ID ${createDto.venueId} not found for your business.`,
      );

    const organizer = await this.eventOrganizerRepository.findById(
      createDto.organizerId,
      businessAccountId,
    );
    if (!organizer)
      throw new NotFoundException(
        `Organizer with ID ${createDto.organizerId} not found for your business.`,
      );

    const category = await this.eventCategoryRepository.findById(
      createDto.categoryId,
      businessAccountId,
    );
    if (!category)
      throw new NotFoundException(
        `Category with ID ${createDto.categoryId} not found for your business.`,
      );

    const event = new Event(
      null,
      businessAccountId,
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

    const savedEvent = await this.eventRepository.create(event);

    if (createDto.hashtagIds && createDto.hashtagIds.length > 0) {
      for (const hashtagId of createDto.hashtagIds) {
        const hashtag = await this.eventHashtagRepository.findById(hashtagId); // Hashtags are global
        if (hashtag) {
          const mapping = new EventHashtagMapping(savedEvent, hashtag);
          await this.eventHashtagMappingRepository.create(mapping);
        }
      }
    }
    return savedEvent;
  }

  async getAllEvents(user: AuthenticatedUser): Promise<Event[]> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventRepository.findAll(businessAccountId);
  }

  async findEventById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<Event | null> {
    const businessAccountId = this._getBusinessId(user);
    const event = await this.eventRepository.findById(id, businessAccountId);
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${id} not found for your business.`,
      );
    }
    return event;
  }

  async updateEvent(
    id: string,
    updateDto: UpdateEventDto,
    user: AuthenticatedUser,
  ): Promise<Event | null> {
    const businessAccountId = this._getBusinessId(user);

    // First, ensure the event exists and belongs to the business before updating
    const existingEvent = await this.findEventById(id, user); // This also throws NotFoundException if not found

    // Build the update payload for Mongoose explicitly
    const updatePayload: Partial<Event> = {};

    // Copy direct properties from DTO to payload
    if (updateDto.eventName !== undefined)
      updatePayload.eventName = updateDto.eventName;
    if (updateDto.description !== undefined)
      updatePayload.description = updateDto.description;
    if (updateDto.startDate !== undefined)
      updatePayload.startDate = updateDto.startDate;
    if (updateDto.endDate !== undefined)
      updatePayload.endDate = updateDto.endDate;
    if (updateDto.startTime !== undefined)
      updatePayload.startTime = updateDto.startTime;
    if (updateDto.endTime !== undefined)
      updatePayload.endTime = updateDto.endTime;
    if (updateDto.maxAttendees !== undefined)
      updatePayload.maxAttendees = updateDto.maxAttendees;
    if (updateDto.ticketPrice !== undefined)
      updatePayload.ticketPrice = updateDto.ticketPrice;
    if (updateDto.eventStatus !== undefined)
      updatePayload.eventStatus = updateDto.eventStatus;
    if (updateDto.imagesUrl !== undefined)
      updatePayload.imagesUrl = updateDto.imagesUrl;

    // Map DTO IDs to Mongoose reference fields
    if (updateDto.venueId) {
      const venue = await this.eventVenueRepository.findById(
        updateDto.venueId,
        businessAccountId,
      );
      if (!venue)
        throw new NotFoundException(
          `Venue with ID ${updateDto.venueId} not found for your business.`,
        );
      updatePayload.venue = venue; // Assign the full venue object (Mongoose will extract _id)
    }
    if (updateDto.organizerId) {
      const organizer = await this.eventOrganizerRepository.findById(
        updateDto.organizerId,
        businessAccountId,
      );
      if (!organizer)
        throw new NotFoundException(
          `Organizer with ID ${updateDto.organizerId} not found for your business.`,
        );
      updatePayload.organizer = organizer;
    }
    if (updateDto.categoryId) {
      const category = await this.eventCategoryRepository.findById(
        updateDto.categoryId,
        businessAccountId,
      );
      if (!category)
        throw new NotFoundException(
          `Category with ID ${updateDto.categoryId} not found for your business.`,
        );
      updatePayload.category = category;
    }

    const updatedEvent = await this.eventRepository.update(
      id,
      updatePayload,
      businessAccountId,
    );

    // ... (hashtag mapping logic remains the same)
    if (updateDto.hashtagIds) {
      await this.eventHashtagMappingRepository.deleteByEventId(id);
      for (const hashtagId of updateDto.hashtagIds) {
        const hashtag = await this.eventHashtagRepository.findById(hashtagId);
        if (hashtag && updatedEvent) {
          // Check updatedEvent is not null
          const mapping = new EventHashtagMapping(updatedEvent, hashtag);
          await this.eventHashtagMappingRepository.create(mapping);
        }
      }
    }
    return updatedEvent;
  }

  async deleteEvent(id: string, user: AuthenticatedUser): Promise<void> {
    const businessAccountId = this._getBusinessId(user);
    const success = await this.eventRepository.delete(id, businessAccountId);
    if (!success) {
      throw new NotFoundException(
        `Event with ID "${id}" not found for your business.`,
      );
    }
  }

  // =================================================================
  // Business-Scoped Sub-Entity Methods (Venue, Organizer, Category, RSVP)
  // =================================================================

  async createVenue(
    createDto: CreateEventVenueDto,
    user: AuthenticatedUser,
  ): Promise<EventVenue> {
    console.log('🚀 ~ EventService ~ createVenue ~ createDto:', createDto);
    const businessAccountId = this._getBusinessId(user);
    const venue = new EventVenue(
      null,
      businessAccountId,
      createDto.venueName,
      createDto.address,
      createDto.city,
      createDto.province,
      createDto.postalCode,
      createDto.country,
      createDto.coordinates,
      createDto.capacity,
      createDto.facilities,
    );
    console.log('🚀 ~ EventService ~ createVenue ~ venue:', venue);
    return this.eventVenueRepository.create(venue);
  }

  async getVenues(user: AuthenticatedUser): Promise<EventVenue[]> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventVenueRepository.findAll(businessAccountId);
  }

  async getVenueById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<EventVenue | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventVenueRepository.findById(id, businessAccountId);
  }

  async updateVenue(
    id: string,
    updateDto: UpdateEventVenueDto,
    user: AuthenticatedUser,
  ): Promise<EventVenue | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventVenueRepository.update(id, updateDto, businessAccountId);
  }

  async deleteVenue(id: string, user: AuthenticatedUser): Promise<void> {
    const businessAccountId = this._getBusinessId(user);
    const success = await this.eventVenueRepository.delete(
      id,
      businessAccountId,
    );
    if (!success) throw new NotFoundException(`Venue with ID ${id} not found.`);
  }

  async createOrganizer(
    createDto: CreateEventOrganizerDto,
    user: AuthenticatedUser,
  ): Promise<EventOrganizer> {
    const businessAccountId = this._getBusinessId(user);
    const organizer = new EventOrganizer(
      null,
      businessAccountId,
      createDto.organizerName,
      createDto.contactEmail,
      createDto.contactPhone,
      createDto.organization,
    );
    return this.eventOrganizerRepository.create(organizer);
  }

  async getOrganizers(user: AuthenticatedUser): Promise<EventOrganizer[]> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventOrganizerRepository.findAll(businessAccountId);
  }

  async getOrganizerById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<EventOrganizer | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventOrganizerRepository.findById(id, businessAccountId);
  }

  async updateOrganizer(
    id: string,
    updateDto: UpdateEventOrganizerDto,
    user: AuthenticatedUser,
  ): Promise<EventOrganizer | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventOrganizerRepository.update(
      id,
      updateDto,
      businessAccountId,
    );
  }

  async deleteOrganizer(id: string, user: AuthenticatedUser): Promise<void> {
    const businessAccountId = this._getBusinessId(user);
    const success = await this.eventOrganizerRepository.delete(
      id,
      businessAccountId,
    );
    if (!success)
      throw new NotFoundException(`Organizer with ID ${id} not found.`);
  }

  async createCategory(
    createDto: CreateEventCategoryDto,
    user: AuthenticatedUser,
  ): Promise<EventCategory> {
    const businessAccountId = this._getBusinessId(user);
    const category = new EventCategory(
      null,
      businessAccountId,
      createDto.categoryName,
      createDto.description,
    );
    return this.eventCategoryRepository.create(category);
  }

  async getCategories(user: AuthenticatedUser): Promise<EventCategory[]> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventCategoryRepository.findAll(businessAccountId);
  }

  async getCategoryById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<EventCategory | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventCategoryRepository.findById(id, businessAccountId);
  }

  async updateCategory(
    id: string,
    updateDto: UpdateEventCategoryDto,
    user: AuthenticatedUser,
  ): Promise<EventCategory | null> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventCategoryRepository.update(
      id,
      updateDto,
      businessAccountId,
    );
  }

  async deleteCategory(id: string, user: AuthenticatedUser): Promise<void> {
    const businessAccountId = this._getBusinessId(user);
    const success = await this.eventCategoryRepository.delete(
      id,
      businessAccountId,
    );
    if (!success)
      throw new NotFoundException(`Category with ID ${id} not found.`);
  }

  async createRsvp(
    createRsvpDto: CreateEventRsvpDto,
    user: AuthenticatedUser,
  ): Promise<EventRsvp> {
    console.log('--- Starting createRsvp ---');
    console.log('Incoming DTO:', createRsvpDto);

    const event = await this.eventRepository.findPublicById(
      createRsvpDto.eventId,
    );
    if (!event) {
      console.error('Event not found!');
      throw new NotFoundException('Event not found');
    }
    console.log('Found Event:', {
      id: event.id,
      maxAttendees: event.maxAttendees,
    });

    // Capacity Check
    const currentBookedGuests =
      await this.eventRsvpRepository.getTotalGuestCountForEvent(event.id!);
    const availableCapacity = event.maxAttendees - currentBookedGuests;

    if (createRsvpDto.guestCount <= 0) {
      throw new BadRequestException('Guest count must be at least 1.');
    }

    if (createRsvpDto.guestCount > availableCapacity) {
      throw new BadRequestException(
        `Not enough tickets available. Only ${availableCapacity} tickets remaining.`,
      );
    }

    const eventRsvp = new EventRsvp(
      null,
      event.businessAccountId,
      event,
      user.clerk_id,
      createRsvpDto.rsvpStatus,
      createRsvpDto.guestCount,
    );
    return this.eventRsvpRepository.create(eventRsvp);
  }

  async getRsvps(user: AuthenticatedUser): Promise<EventRsvp[]> {
    const businessAccountId = this._getBusinessId(user);
    return this.eventRsvpRepository.findAll(businessAccountId);
  }

  async deleteRsvp(id: string, user: AuthenticatedUser): Promise<void> {
    const businessAccountId = this._getBusinessId(user);
    const success = await this.eventRsvpRepository.delete(
      id,
      businessAccountId,
    );
    if (!success) throw new NotFoundException(`RSVP with ID ${id} not found.`);
  }

  // =================================================================
  // Global Hashtag Methods
  // =================================================================

  async getHashtags(): Promise<EventHashtag[]> {
    return this.eventHashtagRepository.findAll();
  }

  async createHashtag(
    createHashtagDto: CreateEventHashtagDto,
  ): Promise<EventHashtag> {
    const eventHashtag = new EventHashtag(null, createHashtagDto.hashtagName);
    return this.eventHashtagRepository.create(eventHashtag);
  }

  async getHashtagById(id: string): Promise<EventHashtag | null> {
    return this.eventHashtagRepository.findById(id);
  }

  async updateHashtag(
    id: string,
    updateDto: UpdateEventHashtagDto,
  ): Promise<EventHashtag | null> {
    const existingHashtag = await this.eventHashtagRepository.findById(id);
    if (!existingHashtag) {
      throw new NotFoundException(`Hashtag with ID ${id} not found`);
    }
    Object.assign(existingHashtag, updateDto);
    return this.eventHashtagRepository.update(existingHashtag);
  }

  async deleteHashtag(id: string): Promise<void> {
    const success = await this.eventHashtagRepository.delete(id);
    if (!success)
      throw new NotFoundException(`Hashtag with ID ${id} not found.`);
  }

  async getEventHashtagMappings(
    eventId: string,
    user: AuthenticatedUser,
  ): Promise<EventHashtagMapping[]> {
    // First, ensure the event exists and belongs to the authenticated business
    await this.findEventById(eventId, user);
    return this.eventHashtagMappingRepository.findByEventId(eventId);
  }
}
