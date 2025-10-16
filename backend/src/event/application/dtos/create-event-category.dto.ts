import { PartialType } from '@nestjs/mapped-types';

export class CreateEventCategoryDto {
    categoryName: string;
    description: string;
}

export class UpdateEventCategoryDto extends PartialType(CreateEventCategoryDto) {}