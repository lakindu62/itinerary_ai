import { PartialType } from "@nestjs/mapped-types";
import { CreateEventVenueDto } from "./create-event-venue.dto";

export class UpdateEventVenueDto extends PartialType(CreateEventVenueDto) {}