import { EventHashtagMapping } from '../entities/event-hashtag-mapping.entity';

export abstract class EventHashtagMappingRepository {
  abstract create(
    eventHashtagMapping: EventHashtagMapping,
  ): Promise<EventHashtagMapping>;
}
