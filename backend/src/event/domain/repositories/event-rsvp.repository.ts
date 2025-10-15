import { EventRsvp } from '../entities/event-rsvp.entity';

export abstract class EventRsvpRepository {
  abstract create(eventRsvp: EventRsvp): Promise<EventRsvp>;
  abstract findAll(businessAccountId: string): Promise<EventRsvp[]>;
  abstract findById(id: string, businessAccountId: string): Promise<EventRsvp | null>;
  abstract update(id: string, updates: Partial<EventRsvp>, businessAccountId: string): Promise<EventRsvp | null>;
  abstract delete(id: string, businessAccountId: string): Promise<boolean>;
  abstract getTotalGuestCountForEvent(eventId: string): Promise<number>;
}