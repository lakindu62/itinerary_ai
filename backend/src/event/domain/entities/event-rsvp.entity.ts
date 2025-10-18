import { Event } from './event.entity';

export class EventRsvp {
  constructor(
    public id: string | null,
    public readonly businessAccountId: string,
    public event: Event,
    public userId: string,
    public rsvpStatus: string,
    public guestCount: number,
    public readonly createdAt?: Date,
  ) {}
}