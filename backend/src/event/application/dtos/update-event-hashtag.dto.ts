import { PartialType } from "@nestjs/mapped-types";
import { CreateEventHashtagDto } from "./create-event-hashtag.dto";

export class UpdateEventHashtagDto extends PartialType(CreateEventHashtagDto) {}