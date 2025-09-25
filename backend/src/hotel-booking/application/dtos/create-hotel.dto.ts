import { IsString, IsBoolean, IsOptional } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  // @ApiProperty({ example: 'Grand Plaza Hotel' })
  @IsString()
  title: string;

  // @ApiProperty({ example: 'Luxury hotel in the heart of the city' })
  @IsString()
  description: string;

  // @ApiProperty({ example: 'https://example.com/hotel-image.jpg' })
  @IsString()
  image: string;

  // @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;

  // @ApiProperty({ example: 'California' })
  @IsString()
  state: string;

  // @ApiProperty({ example: 'Los Angeles' })
  @IsString()
  city: string;

  // @ApiProperty({ example: 'Located in downtown with easy access to major attractions' })
  @IsString()
  locationDescription: string;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  gym?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  spa?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  bar?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  laundry?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  restaurant?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  shopping?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  freeParking?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  bikeRental?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  movieNights?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  swimmingPool?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  coffeeShop?: boolean;
}