import { PartialType } from '@nestjs/mapped-types';

export class CreateEventHashtagDto {
    hashtagName: string;
}

export class UpdateEventHashtagDto extends PartialType(CreateEventHashtagDto) {}