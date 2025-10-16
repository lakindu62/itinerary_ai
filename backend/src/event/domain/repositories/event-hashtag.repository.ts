import { EventHashtag } from '../entities/event-hashtag.entity';

export abstract class EventHashtagRepository {
  abstract create(eventHashtag: EventHashtag): Promise<EventHashtag>;
  abstract findAll(): Promise<EventHashtag[]>;
  abstract findById(id: string): Promise<EventHashtag | null>;
  abstract findByName(name: string): Promise<EventHashtag | null>;
  abstract update(eventHashtag: EventHashtag): Promise<EventHashtag | null>;
  abstract delete(id: string): Promise<boolean>;
}