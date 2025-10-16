// backend/src/itinerary/infrastructure/adapters/event-read.adapter.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventService } from 'src/event/application/services/event.service';
import {
  EventReadPort,
  EventSummary,
} from 'src/itinerary/application/ports/event-read-port';

@Injectable()
export class EventReadAdapter implements EventReadPort {
  private readonly logger = new Logger(EventReadAdapter.name);
  constructor(private readonly eventService: EventService) {}

  async getPublicEvents(): Promise<EventSummary[]> {
    const events = await this.eventService.getAllEventsPublic();
    this.logger.log(`Found ${events.length} public events`);
    return events.map((e) => ({
      imageUrl: e.imagesUrl[0] ?? undefined,
      id: e.id!,
      eventName: e.eventName,
      description: e.description ?? undefined,
      startDate: String(e.startDate),
      endDate: String(e.endDate),
      venue: {
        venueName: e.venue?.venueName ?? undefined,
        city: e.venue?.city ?? undefined,
        coordinates: e.venue.coordinates,
      },
      category: {
        categoryName: e.category?.categoryName,
      },
    }));
  }

  async getPublicEventsByDestination(
    destination: string,
  ): Promise<EventSummary[]> {
    const events = await this.eventService.getAllEventsPublic();

    const filtered = events.filter(
      (e) => e.venue?.city?.toLowerCase() === destination.toLowerCase(),
    );
    this.logger.log(
      `Found ${filtered.length} public events for destination: ${destination}`,
    );
    return filtered.map((e) => ({
      id: e.id!,
      eventName: e.eventName,
      description: e.description ?? undefined,
      startDate: String(e.startDate),
      endDate: String(e.endDate),
      imageUrl: e.imagesUrl[0] || undefined,
      venue: {
        venueName: e.venue?.venueName ?? undefined,
        city: e.venue?.city ?? undefined,
        coordinates: e.venue.coordinates,
      },
      category: {
        categoryName: e.category?.categoryName,
      },
    }));
  }
}
