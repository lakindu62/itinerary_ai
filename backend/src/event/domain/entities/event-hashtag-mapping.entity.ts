import { Event } from './event.entity';
import { EventHashtag } from './event-hashtag.entity';

export class EventHashtagMapping {
  constructor(
    public event: Event,
    public hashtag: EventHashtag,
    // public created_at?: string,
  ) {}
}
