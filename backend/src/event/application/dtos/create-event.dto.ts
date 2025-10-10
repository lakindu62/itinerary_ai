export class CreateEventDto {
  eventName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  maxAttendees?: number;
  ticketPrice?: number;
  eventStatus?: string;
  imagesUrl?: string[];
  venueId: string;
  organizerId: string;
  categoryId: string;
  hashtagIds?: string[];
  // hashtags?: string[];
  // location?: string;
}
