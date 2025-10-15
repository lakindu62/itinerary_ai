import { EventCategory } from '../entities/event-category.entity';

export abstract class EventCategoryRepository {
  abstract create(eventCategory: EventCategory): Promise<EventCategory>;
  abstract findAll(businessAccountId: string): Promise<EventCategory[]>;
  abstract findById(id: string, businessAccountId: string): Promise<EventCategory | null>;
  abstract update(id: string, updates: Partial<EventCategory>, businessAccountId: string): Promise<EventCategory | null>;
  abstract delete(id: string, businessAccountId: string): Promise<boolean>;
}