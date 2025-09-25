import { Event } from './event.entity';

export class EventRsvp {
  constructor(
    public id: string | null,
    public event: Event,
    public userId: string,
    public rsvpStatus: string,
    public guestCount: number,
    // public rsvpDate?: string,
  ) {}
}
