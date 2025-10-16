import { EventVenue } from '../entities/event-venue.entity';

export abstract class EventVenueRepository {
  abstract create(eventVenue: EventVenue): Promise<EventVenue>;
  abstract findAll(businessAccountId: string): Promise<EventVenue[]>;
  abstract findById(id: string, businessAccountId: string): Promise<EventVenue | null>;
  abstract update(id: string, updates: Partial<EventVenue>, businessAccountId: string): Promise<EventVenue | null>;
  abstract delete(id: string, businessAccountId: string): Promise<boolean>;
}