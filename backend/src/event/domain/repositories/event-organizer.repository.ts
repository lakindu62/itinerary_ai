import { EventOrganizer } from '../entities/event-organizer.entity';

export abstract class EventOrganizerRepository {
  abstract create(eventOrganizer: EventOrganizer): Promise<EventOrganizer>;
  abstract findAll(businessAccountId: string): Promise<EventOrganizer[]>;
  abstract findById(id: string, businessAccountId: string): Promise<EventOrganizer | null>;
  abstract update(id: string, updates: Partial<EventOrganizer>, businessAccountId: string): Promise<EventOrganizer | null>;
  abstract delete(id: string, businessAccountId: string): Promise<boolean>;
}