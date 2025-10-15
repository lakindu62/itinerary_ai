import { PartialType } from '@nestjs/mapped-types';

export class CreateEventRsvpDto {
    eventId: string;
    userId: string;
    rsvpStatus: string;
    guestCount: number;
}

export class UpdateEventRsvpDto extends PartialType(CreateEventRsvpDto) {}