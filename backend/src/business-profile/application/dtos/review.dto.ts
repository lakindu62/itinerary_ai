import { IsString, IsNumber, IsEmail, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  userId: string;
}

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}