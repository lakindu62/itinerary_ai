import { Event } from '../entities/event.entity';

export abstract class EventRepository {
  abstract create(event: Event): Promise<Event>;
  abstract findAll(businessAccountId: string): Promise<Event[]>;
  abstract findAllPublic(): Promise<Event[]>;
  abstract findById(id: string, businessAccountId: string): Promise<Event | null>;
  abstract findPublicById(id: string): Promise<Event | null>;
  abstract update(id: string, updates: Partial<Event>, businessAccountId: string): Promise<Event | null>;
  abstract delete(id: string, businessAccountId: string): Promise<boolean>;
}