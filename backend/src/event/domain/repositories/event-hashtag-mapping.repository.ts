import { EventHashtagMapping } from '../entities/event-hashtag-mapping.entity';

export abstract class EventHashtagMappingRepository {
  abstract create(
    eventHashtagMapping: EventHashtagMapping,
  ): Promise<EventHashtagMapping>;

  abstract findByEventId(eventId: string): Promise<EventHashtagMapping[]>;
  abstract deleteByEventId(eventId: string): Promise<void>;
}
