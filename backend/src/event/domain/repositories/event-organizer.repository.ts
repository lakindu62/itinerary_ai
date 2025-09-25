import { EventOrganizer } from '../entities/event-organizer.entity';

export abstract class EventOrganizerRepository {
  abstract create(eventOrganizer: EventOrganizer): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
}
