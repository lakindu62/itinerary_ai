import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export class CreateMediaDto {
  @IsEnum(MediaType)
  type: MediaType;

  @IsString()
  url: string;

  @IsString()
  filename: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateMediaOrderDto {
  @IsString()
  mediaId: string;

  @IsNumber()
  order: number;
}

export class MediaResponseDto {
  id: string;
  type: MediaType;
  url: string;
  filename: string;
  order: number;
  title?: string;
  description?: string;
  createdAt: Date;
}