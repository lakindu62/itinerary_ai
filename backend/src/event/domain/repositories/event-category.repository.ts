import { EventCategory } from '../entities/event-category.entity';

export abstract class EventCategoryRepository {
  abstract create(eventCategory: EventCategory): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
}
