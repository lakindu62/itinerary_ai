import { EventVenue } from '../entities/event-venue.entity';

export abstract class EventVenueRepository {
  abstract create(eventVenue: EventVenue): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
}
