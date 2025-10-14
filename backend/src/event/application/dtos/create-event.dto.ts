import { PartialType } from '@nestjs/mapped-types';

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
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}