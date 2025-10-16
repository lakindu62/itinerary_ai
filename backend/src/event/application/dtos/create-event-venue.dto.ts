import { PartialType } from '@nestjs/mapped-types';

export class CreateEventVenueDto {
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  coordinates: [number, number]; // [longitude, latitude]
  facilities: string[];
}

export class UpdateEventVenueDto extends PartialType(CreateEventVenueDto) {}
