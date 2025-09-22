import { Event } from '../entities/event.entity';

export abstract class EventRepository {
  abstract create(event: Event): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
  abstract update(event: Event): Promise<any | null>;
}
