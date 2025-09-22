import { EventVenue } from '../entities/event-venue.entity';

export abstract class EventVenueRepository {
  abstract create(eventVenue: EventVenue): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
  abstract update(eventVenue: EventVenue): Promise<any | null>;
  abstract delete(id: string): Promise<void>;
}
