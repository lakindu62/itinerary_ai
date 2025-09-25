import { IsString, IsBoolean, IsOptional } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UpdateHotelDto {
  // @ApiProperty({ example: 'Grand Plaza Hotel', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  // @ApiProperty({ example: 'Luxury hotel in the heart of the city', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // @ApiProperty({ example: 'https://example.com/hotel-image.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  // @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  // @ApiProperty({ example: 'California', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  // @ApiProperty({ example: 'Los Angeles', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  // @ApiProperty({ example: 'Located in downtown with easy access to major attractions', required: false })
  @IsOptional()
  @IsString()
  locationDescription?: string;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  gym?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  spa?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  bar?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  laundry?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  restaurant?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  shopping?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  freeParking?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  bikeRental?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  movieNights?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  swimmingPool?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  coffeeShop?: boolean;
}