import { PartialType } from "@nestjs/mapped-types";
import { CreateEventRsvpDto } from "./create-event-rsvp.dto";

export class UpdateEventRsvpDto extends PartialType(CreateEventRsvpDto) {}