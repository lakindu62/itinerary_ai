import { EventRsvp } from '../entities/event-rsvp.entity';

export abstract class EventRsvpRepository {
  abstract create(eventRsvp: EventRsvp): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
}
