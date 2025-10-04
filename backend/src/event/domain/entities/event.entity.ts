import { EventVenue } from './event-venue.entity';
import { EventOrganizer } from './event-organizer.entity';
import { EventCategory } from './event-category.entity';
import { EventHashtag } from './event-hashtag.entity';

export class Event {
  constructor(
    public id: string | null,
    public eventName: string,
    public description: string,
    public startDate: string,
    public endDate: string,
    public startTime: string,
    public endTime: string,
    public maxAttendees: number,
    public ticketPrice: number,
    public eventStatus: string,
    public imagesUrl: string[],
    public venue: EventVenue,
    public organizer: EventOrganizer,
    public category: EventCategory,
    public hashtags?: EventHashtag[],
    // public created_at?: string,
    // public updated_at?: string,
  ) {}
}
