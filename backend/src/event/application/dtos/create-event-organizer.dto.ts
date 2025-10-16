import { PartialType } from '@nestjs/mapped-types';

export class CreateEventOrganizerDto {
    organizerName: string;
    contactEmail: string;
    contactPhone: string;
    organization: string;
}

export class UpdateEventOrganizerDto extends PartialType(CreateEventOrganizerDto) {}