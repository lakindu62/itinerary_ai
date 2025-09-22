import { EventHashtag } from '../entities/event-hashtag.entity';

export abstract class EventHashtagRepository {
  abstract create(eventHashtag: EventHashtag): Promise<any>;
  abstract findById(id: string): Promise<any | null>;
  abstract findByName(name: string): Promise<any | null>;
  abstract update(eventHashtag: EventHashtag): Promise<any | null>;
  abstract delete(id: string): Promise<void>;
}
