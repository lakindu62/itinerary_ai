import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateBusinessProfileDto {
  @IsString()
  businessName: string;

  @IsString()
  ownerId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;
}

export class UpdateBusinessProfileDto {
  @IsString()
  @IsOptional()
  businessName?: string;
  
  @IsString()
  @IsOptional()
  description?: string;
  
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class BusinessProfileResponseDto {
  id: string;
  businessName: string;
  ownerId: string;
  description?: string;
  categories: string[];
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  sliderImages: any[];
  videos: any[];
  posts: any[]; // Add posts array
  reels: any[]; // Add reels array
  menuItems: any[]; // Add menu items array
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}