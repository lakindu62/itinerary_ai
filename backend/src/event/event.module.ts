import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './presentation/controllers/event.controller';
import { EventService } from './application/services/event.service';
import { EventRepository } from './domain/repositories/event.repository';
import { EventRepositoryImpl } from './infrastructure/repositories/event.repository.impl';
import { Event, EventSchema } from './infrastructure/schemas/event.schema';
import { EventVenue, EventVenueSchema } from './infrastructure/schemas/event-venue.schema';
import { EventOrganizer, EventOrganizerSchema } from './infrastructure/schemas/event-organizer.schema';
import { EventCategory, EventCategorySchema } from './infrastructure/schemas/event-category.schema';
import { EventVenueRepository } from './domain/repositories/event-venue.repository';
import { EventVenueRepositoryImpl } from './infrastructure/repositories/event-venue.repository.impl';
import { EventOrganizerRepository } from './domain/repositories/event-organizer.repository';
import { EventOrganizerRepositoryImpl } from './infrastructure/repositories/event-organizer.repository.impl';
import { EventCategoryRepository } from './domain/repositories/event-category.repository';
import { EventCategoryRepositoryImpl } from './infrastructure/repositories/event-category.repository.impl';
import { EventRsvp, EventRsvpSchema } from './infrastructure/schemas/event-rsvp.schema';
import { EventRsvpRepository } from './domain/repositories/event-rsvp.repository';
import { EventRsvpRepositoryImpl } from './infrastructure/repositories/event-rsvp.repository.impl';
import { EventHashtag, EventHashtagSchema } from './infrastructure/schemas/event-hashtag.schema';
import { EventHashtagRepository } from './domain/repositories/event-hashtag.repository';
import { EventHashtagRepositoryImpl } from './infrastructure/repositories/event-hashtag.repository.impl';
import { EventHashtagMapping, EventHashtagMappingSchema } from './infrastructure/schemas/event-hashtag-mapping.schema';
import { EventHashtagMappingRepository } from './domain/repositories/event-hashtag-mapping.repository';
import { EventHashtagMappingRepositoryImpl } from './infrastructure/repositories/event-hashtag-mapping.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventVenue.name, schema: EventVenueSchema },
      { name: EventOrganizer.name, schema: EventOrganizerSchema },
      { name: EventCategory.name, schema: EventCategorySchema },
      { name: EventRsvp.name, schema: EventRsvpSchema },
      { name: EventHashtag.name, schema: EventHashtagSchema },
      { name: EventHashtagMapping.name, schema: EventHashtagMappingSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    { provide: EventRepository, useClass: EventRepositoryImpl },
    { provide: EventVenueRepository, useClass: EventVenueRepositoryImpl },
    { provide: EventOrganizerRepository, useClass: EventOrganizerRepositoryImpl },
    { provide: EventCategoryRepository, useClass: EventCategoryRepositoryImpl },
    { provide: EventRsvpRepository, useClass: EventRsvpRepositoryImpl },
    { provide: EventHashtagRepository, useClass: EventHashtagRepositoryImpl },
    {
      provide: EventHashtagMappingRepository,
      useClass: EventHashtagMappingRepositoryImpl,
    },
  ],
})
export class EventModule {}
